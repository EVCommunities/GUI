const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");

app.use(cors());

app.listen(7001, () => {
  console.log("Server running on port 7001");
});

app.use(express.json())

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
     res.status(newSim.status).send(newSim.data);
     res.end()
  } catch(e) {
      console.log(e)
      if (Object.hasOwn(e, "response") && Object.hasOwn(e.response, "status") && Object.hasOwn(e.response, "data")) {
        res.status(e.response.status).send(e.response.data);
      } else {
        res.sendStatus(400);
      }
      res.end()
  }

})
