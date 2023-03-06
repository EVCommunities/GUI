const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
const fs = require('fs');
const dbPath = './db.json';
const { InMemoryDatabase } = require('in-memory-database');

const CAR_MAX_POWER_IN_DEMO = 9.5;

app.use(cors());

app.listen(7001, () => {
  console.log("Server running on port 7001");
});

let db = [];
if (fs.existsSync(dbPath)) {
  db = JSON.parse(fs.readFileSync(dbPath));
}
app.use(express.json())

const client = new InMemoryDatabase();

const logreaderAddress = process.env.LOGREADER_API || "http://localhost:8080"  ;
const simulationStarterAddress = process.env.SIMULATION_STARTER || "http://localhost:8500/"  ;
const privateToken = process.env.PRIVATE_TOKEN || "missing"

app.get("/data", async function(req, res) {
  if (req.query.simid) {
    try {
      let simid = req.query.simid;

      //Get the initial data in simulation config yaml file
      const initialData = await axios.get(
        logreaderAddress + "/simulations/" + simid + "/messages?topic=Start"
      );
      let stations;
      let epochStartTime;
      let epochLength;
      let users;
      let epochCount;
      initialData.data.forEach(element => {
        if (element.ProcessParameters) {
          stations = element.ProcessParameters.StationComponent;
          epochStartTime = element.ProcessParameters.SimulationManager.InitialStartTime;
          epochLength = element.ProcessParameters.SimulationManager.EpochLength;
          users = element.ProcessParameters.UserComponent;
          epochCount = element.ProcessParameters.SimulationManager.MaxEpochCount;
          return;
        }
      });

      //Create empty userobjects for each user and assign relevant station for the user
      let userObjects = {};
      let timeseconds = new Date(epochStartTime).getTime()
      Object.keys(users).forEach(userKey => {
        let stationComp;
        Object.keys(stations).forEach(elem => {
          if (
            users[userKey].StationId.toString() === stations[elem].StationId
          ) {
            stationComp = stations[elem];
          }
        });
        userObjects[userKey] = {
          powerOutput: [],
          chargingState: [],
          timeline: [],
          userComponent: users[userKey],
          stationComponent: stationComp,
          initialChargingState: null,
          finalchargingState: null
        };
      });

      // Initial start time of the simulations
      let timeL = []

      //Get epoch data for each epoch
      for (let i = 1; i < epochCount + 1; i++) {
        const epochData = await axios.get(
          logreaderAddress + "/simulations/" + simid + "/messages?epoch=" + i
        );
        timeL.push(new Date(timeseconds + (epochLength * (i-1) * 1000)));
        Object.keys(userObjects).forEach(uc => {
        // Add null values if user is not arrived to station
        if (new Date (userObjects[uc].userComponent.ArrivalTime) > new Date(timeseconds + (epochLength * (i-1) * 1000))) {
          userObjects[uc].powerOutput.push(null)
          userObjects[uc].chargingState.push(null)
        } else {
          //Add initial charging state
          if(userObjects[uc].initialChargingState == null){
            userObjects[uc].initialChargingState = userObjects[uc].userComponent.StateOfCharge
            userObjects[uc].chargingState.push(userObjects[uc].userComponent.StateOfCharge)

          }
          epochData.data.forEach(d => {
            if(new Date (userObjects[uc].userComponent.TargetTime) > new Date(timeseconds + (epochLength * (i-1) * 1000))){
              if(userObjects[uc].stationComponent.StationId == d.StationId && d.Topic == "PowerOutputTopic"){
                userObjects[uc].powerOutput.push(d.PowerOutput)
              }
              if(userObjects[uc].userComponent.UserId == d.UserId && d.Topic == "User.CarState"){
                userObjects[uc].chargingState.push(d.StateOfCharge)
              }
            } else {
              if(userObjects[uc].finalchargingState == null) {
                userObjects[uc].finalchargingState = userObjects[uc].chargingState[(userObjects[uc].chargingState).length - 1]
                userObjects[uc].powerOutput.push(0)
              }
            }

          });
        }
        if(userObjects[uc].finalchargingState == null && i == epochCount) {
          userObjects[uc].finalchargingState = userObjects[uc].chargingState[(userObjects[uc].chargingState).length - 1]
        }


      })

      }
      Object.keys(userObjects).forEach(uc => {
        userObjects[uc].timeline = timeL
      })
      res.send(userObjects)
      res.end();
    } catch(error) {
      console.log(error)
      res.sendStatus(500)
      res.end()
        }
  } else {
  res.sendStatus(400)
  res.end()
  }
});


app.get("/simulations", async(req, res) => {
    try {
        const simulations = await axios.get(logreaderAddress + "/simulations");
        res.send(simulations.data)
        res.end();
    } catch(e) {
        console.log(e)
        res.sendStatus(400)
        res.end()
    }

})

app.post("/simulations", async(req, res) => {
  try {
     console.log(req.body)
     const newSim = await axios.post(simulationStarterAddress , req.body, {
      headers: {
      'Content-Type': 'application/json',
      'private-token': privateToken
      }
    });
     res.send(newSim.data)
     res.end()
  } catch(e) {
      console.log(e)
      res.sendStatus(400)
      res.end()
  }

})

app.get("/users", async function(req, res) {
  res.send(db)
  res.end()
})

app.post("/session", async function(req, res) {
  let sim_payload = JSON.parse(fs.readFileSync('./simulation_payload.json'));
  sim_payload.Name = req.body.Name
  sim_payload.EpochLength = req.body.EpochLength
  sim_payload.TotalMaxPower = req.body.TotalMaxPower

  client.set('sim_payload', sim_payload);
  client.set('user_names', req.body.UserNames);
  res.send("Session is set successfully")
  res.end()
})

app.delete("/session", async function(req, res) {
  client.delete('sim_payload')
  client.delete('user_names')
  client.delete('user_sessions')
  client.delete('simulation_status')
  client.delete('sim_message')
  res.send("Current session is removed successfully")

})

app.get("/session_users", async function(req, res) {
  let user_names = client.get('user_names');
  console.log(user_names)
  res.send(user_names)
  res.end()
})

app.get("/session", async function(req, res) {
  let stor = client.get('sim_payload');
  console.log(stor)
  res.send(stor)
  res.end()
})

app.post("/usersession", async function(req, res) {
  let stor = client.get('sim_payload');
  if(stor === undefined){
    res.status(400)
    res.send("Session is Not Started by Admin")
  } else {
    let user_sessions = client.get('user_sessions');
    if(user_sessions === undefined){
      user_sessions = []
    }
    user_sessions.push(req.body)
    client.set('user_sessions', user_sessions);
    res.send("User session is received")
    res.end()
    if (user_sessions.length == Object.keys(client.get("user_names")).length){
      client.set('simulation_status', 'started')
      let sim_payload  = client.get('sim_payload');
      sim_payload.Users = user_sessions

      let station_payload = [];
      for (const user_session of user_sessions) {
        station_payload.push({
          "StationId": user_session.StationId,
          "MaxPower": CAR_MAX_POWER_IN_DEMO
        })
      }
      sim_payload.Stations = station_payload;

      console.log("simP :", sim_payload)
      try {
        const newSim = await axios.post(simulationStarterAddress , sim_payload, {
          headers: {
          'Content-Type': 'application/json',
          'private-token': privateToken
          }
        });
        client.set('simulation_status', 'finished')
        client.set('sim_message',newSim.data)
        console.log(newSim.data)
      }
      catch(error) {
        console.log(error);
        client.set('simulation_status', 'finished')
        client.set('sim_message', 'Error starting the simulation')
      }

    }
  }
})


app.get("/usersession", async function(req, res) {
  let user_sessions = client.get('user_sessions');
  if(user_sessions === undefined){
    res.status(404)
    res.send("Session is not initiated")
    res.end()
  } else {
    if (user_sessions.length == Object.keys(client.get("user_names")).length){
      if(client.get('simulation_status') == 'finished') {
        let sim_message = client.get('sim_message')
        res.send(sim_message)
      } else {
        res.send("Simulation is running now")
      }
    } else {
      res.send("Waiting for all users to submit information")
    }
    res.end()
  }

})

