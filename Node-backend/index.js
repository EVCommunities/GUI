const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");

app.use(cors());

app.listen(7001, () => {
  console.log("Server running on port 7001");
});

const logreaderAddress = process.env.LOGREADER_API || "http://localhost:8080";

app.get("/data", async function(req, res) {
  if (req.query.simid) {
    try {
      let simid = req.query.simid;
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
      let stationObjs = {};
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
        stationObjs[userKey] = {
          powerOutput: [],
          chargingState: [],
          timeline: [],
          userComponent: users[userKey],
          stationComponent: stationComp,
          initialChargingState: null,
          finalchargingState: null
        };
      });
      let timeL = [new Date(timeseconds)]
      for (let i = 1; i < epochCount + 1; i++) {
        const epochData = await axios.get(
          logreaderAddress + "/simulations/" + simid + "/messages?epoch=" + i
        );
        timeL.push(new Date(timeseconds + (epochLength * i * 1000)));
        Object.keys(stationObjs).forEach(uc => {
        if(new Date (stationObjs[uc].userComponent.ArrivalTime) > new Date(timeseconds + (epochLength * i * 1000))){
          stationObjs[uc].powerOutput.push(null)
          stationObjs[uc].chargingState.push(null)
        } else {
          if(stationObjs[uc].initialChargingState == null){
            stationObjs[uc].initialChargingState = stationObjs[uc].userComponent.StateOfCharge
            if(stationObjs[uc].chargingState.includes(null)){
              stationObjs[uc].powerOutput.push(null)
              stationObjs[uc].chargingState.push(null)
            } else {
              stationObjs[uc].chargingState.push(stationObjs[uc].userComponent.StateOfCharge)
            }
            
          }
          epochData.data.forEach(d => {
            if(stationObjs[uc].userComponent.UserId == d.UserId && d.Topic == "PowerOutputTopic"){
              stationObjs[uc].powerOutput.push(d.PowerOutput)
            }
            if(stationObjs[uc].userComponent.UserId == d.UserId && d.Topic == "User.CarState"){
              stationObjs[uc].chargingState.push(d.StateOfCharge)
            }
          });
        }
        if(new Date (stationObjs[uc].userComponent.TargetTime) < new Date(timeseconds + (epochLength * i * 1000))){
          if(stationObjs[uc].finalchargingState == null) {
            stationObjs[uc].finalchargingState = stationObjs[uc].chargingState[(stationObjs[uc].chargingState).length - 1]
            let pw = stationObjs[uc].powerOutput[(stationObjs[uc].powerOutput).length - 1]
            stationObjs[uc].powerOutput.push(pw)
          }
          stationObjs[uc].chargingState.pop()

        }


        })
      }
      Object.keys(stationObjs).forEach(uc => {
        stationObjs[uc].timeline = timeL
      })
      res.send(stationObjs)
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
