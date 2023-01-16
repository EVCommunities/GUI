const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");

app.use(cors());

app.listen(7001, () => {
  console.log("Server running on port 7001");
});

app.get("/data", async function(req, res) {
  if (req.query.simid) {
    try {
      let simid = req.query.simid;
      const initialData = await axios.get(
        "http://localhost:8080/simulations/" + simid + "/messages?topic=Start"
      );
      let stations; 
      let epochs; 
      let epochLength; 
      let users; 
      let epochCount;
      initialData.data.forEach(element => {
        if (element.ProcessParameters) {
          stations = element.ProcessParameters.StationComponent;
          epochs = element.ProcessParameters.SimulationManager.MaxEpochCount;
          epochLength = element.ProcessParameters.SimulationManager.EpochLength;
          users = element.ProcessParameters.UserComponent;
          epochCount = element.ProcessParameters.SimulationManager.MaxEpochCount;
          return;
        }
      });
      let stationObjs = {};
      Object.keys(stations).forEach(elem => {
        let userComp;
        Object.keys(users).forEach(userKey => {
          if (
            users[userKey].StationId.toString() === stations[elem].StationId
          ) {
            userComp = users[userKey];
          }
        });
        stationObjs[elem] = {
          powerOutput: [],
          chargingState: [userComp.StateOfCharge],
          timeline: [0],
          userComponent: userComp,
          stationComponent: stations[elem],
          finalchargingState: 0
        };
      });
      for (let i = 1; i < epochCount + 1; i++) {
        const epochData = await axios.get(
          "http://localhost:8080/simulations/" + simid + "/messages?epoch=" + i
        );
        epochData.data.forEach(d => {
          if (d.PowerOutput || d.PowerOutput == 0) {
            stationObjs[d.SourceProcessId].powerOutput.push(d.PowerOutput);
            if (i == epochCount) {
              stationObjs[d.SourceProcessId].powerOutput.push(d.PowerOutput);
            }
          }
          if (d.StateOfCharge && d.Topic === "User.CarState") {
            sid = "s" + d.StationId;
            stationObjs[sid].chargingState.push(d.StateOfCharge);
            stationObjs[sid].finalchargingState = d.StateOfCharge;
            if (d.Topic === "User.CarState") {
              stationObjs[sid].timeline.push(i);
            }
          }
        });
      }
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
     
