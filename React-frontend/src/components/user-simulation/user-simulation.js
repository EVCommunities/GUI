import { useState,useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CardMedia,
  Grid,
  TextField,
  CircularProgress,
  Alert,
  Chip,
  Typography,
  Modal
} from '@mui/material';
import {UserPowerChart} from "../dashboard/user-power-chart";
import {RequirementResult} from "./requirement-result";
import payload_single from './sample-data-single.json'
import axios from "axios";

const backendAddress = process.env.NEXT_PUBLIC_EVC_GUI_BACKEND || "http://localhost:7001";

const CAR_IMAGES = 3;


export const UserSimulation = (props) => {
  const [values, setValues] = useState();
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalText, setText] = useState("Loading")
  const [currentUser, setcurrentUser] = useState();
  const [data, setData] = useState();
  const [results, setResults] = useState();
  const [c_battery, setCBattery] = useState(0);
  const [c_time, setCTime] = useState('');
  const [r_battery, setRBattery] = useState(0);
  const [r_time, setRTime] = useState('');

  const handleClose = (event, reason) => {
    if (reason && reason == "backdropClick" && (modalText == "Waiting for all users to submit information" ||
    modalText == "Simulation is running now") ) {
        return;
    }
    setOpen(false);
}

  const handleChange = (event) => {
    let eName = event.target.name
    console.log('ename :',eName)
    if(eName == 'c_battery'){
        setCBattery(parseInt(event.target.value))
    } else if(eName == 'r_battery'){
        setRBattery(parseInt(event.target.value))
    } else if(eName == 'c_time'){
        setCTime(event.target.value)
    } else{
        setRTime(event.target.value)
    }
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const setTimeline = (timelinearray) => {
    let T = []
    timelinearray.forEach(time => {
        // T.push(time.substring(11, 16))  // a hack to get the time from ISO-8601 string
        T.push(new Date(time).toLocaleTimeString('en-GB', { hour: "numeric", minute: "numeric"}))
    })
    return T
}

const checkStatus = async () => {
    try {
        let res = await axios.get(backendAddress + "/usersession");
        return res
    } catch(e){
        console.log(e)
    }
}

const getData = async (simid) => {
    try {
        let user = payload_single;
        const userNameMap = await getUserNameMap();
        const userId = parseInt(props.username);
        const userName = userNameMap[userId];
        user.UserId = userId;
        user.UserName = userName;
        user.StationId = props.username;
        setcurrentUser(user);

        const res = await axios.get(backendAddress + "/data?simid=" + simid);
        console.log("got",res.data)
        console.log('cuser :', currentUser)
        setData(res.data[user.UserName])

        const results = await axios.get(backendAddress + "/result?simid=" + simid);
        console.log("Results: ", results.data);
        setResults(results.data);

        setOpen(false)
    } catch(error) {
        console.log(error)
    }
}

  const onSubmit = async () => {
    try {
        setText("Processing")
        setOpen(true)
        if (new Date(c_time) > new Date(r_time)){
            setText("Target Time must be greater than Arrival Time")
            setLoading(false)
            return
        }
        currentUser.StateOfCharge = c_battery
        currentUser.ArrivalTime = new Date(c_time).toISOString('en-US', { timeZone: 'GMT' })
        currentUser.TargetStateOfCharge = r_battery
        currentUser.TargetTime = new Date(r_time).toISOString('en-US', { timeZone: 'GMT' })
        console.log("CR :",currentUser)
        const res = await axios.post(backendAddress + "/usersession",(currentUser) );
        console.log(res.data)
        setLoading(true)
        setText(currentUser.UserName + " requirements are submitted. Waiting to process.......")
        const intervalid = setInterval( async () => {
            try{
                const sessionResponse = await checkStatus()
                console.log('sr :',sessionResponse)
                if(sessionResponse.status == 200){
                    if (sessionResponse.data == "Waiting for all users to submit information" ||
                    sessionResponse.data == "Simulation is running now" ){
                        setText(sessionResponse.data)
                    } else {
                        clearInterval(intervalid)
                        setText(sessionResponse.data.message + " " + "Simulation Id :" + sessionResponse.data.simulation_id)
                        console.log(modalText)
                        setTimeout(() => {
                            getData(sessionResponse.data.simulation_id)
                          }, "20000")

                    }
                }
            } catch (e){
                setLoading(false)
                setText("An error occurred " + e.message ? e.message : "" )
                console.log(e)
            }

        }, 5000);
      } catch(e) {
        console.log(e)
        setLoading(false)
        setText(e.response.data ? e.response.data : e.message )
      }



  }

async function getUserNameMap() {
  try {
    let response = await axios.get(backendAddress + "/session_users");
    return (response.data != undefined && response.data.constructor == Object) ? response.data : {};
  } catch (e) {
    return {};
  }
}

useEffect(() => {
  async function getNames() {
    return await getUserNameMap();
  }
  let userNameMap = {};
  getNames().then(names => {
    userNameMap = names

    console.log("username: " + props.username);
    console.log("All users: ", userNameMap);
    if (props.username in userNameMap) {
        const userId = parseInt(props.username);
        const userName = userNameMap[userId];
        let user = payload_single;
        user.UserId = userId;
        user.UserName = userName;
        user.StationId = props.username;
        setcurrentUser(user);

        console.log("simid :", props.simid)
        console.log("it :", currentUser)
        if(props.simid){
            setTimeout(() => {
                getData(props.simid)
              }, "2000")

        }
    } else {
        if(props.username === undefined){
            setText("User ID is undefined")
        } else {
            setText("User with ID " + props.username + " is not recognized." )
        }

        setOpen(true)
    }
  }).catch(error => {
    console.log(error);
  });
},[props.username])


  return (
    <div>
        { currentUser ?
        <Grid container
spacing={2} >
                  <Grid
            item
            lg={5}
            md={5}
            xs={12}
          >
      <Card>
      <Grid container
spacing={2}>
      <Grid item
md={12}>
        <CardHeader
          style={{ padding: 15 }}
          title={"Schedule New Charging for " + currentUser.UserName}
        />
        </Grid>
        <Grid item
md={6}>

          </Grid>
          </Grid>
        <Divider />
        <CardMedia
        sx={{ height: 190 }}
        image={"/static/images/" + (parseInt(props.username) % 3 + 1) + ".jpg"}
        title="Car image"
      />
        <CardContent>
        <Typography
            color="info"
            gutterBottom="true"
            variant="overline"
          >
            Battery Capacity : <span style={{'color':'blue'}}>{currentUser.CarBatteryCapacity}kwh </span>  &nbsp; &nbsp;
            </Typography>
            <Typography
            color="info"
            gutterBottom="true"
            variant="overline"
          >
            Max Power Input : <span style={{'color':'blue'}}>{currentUser.CarMaxPower}kw </span>  &nbsp; &nbsp;
            </Typography>
      <Divider />
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={12}
              xs={12}
            >
<Chip label="Current State"
color="primary"
variant="outlined"
sx={{ m: 2 }} />
  <TextField
        fullWidth
        label="Current Battery Percentage"
        margin="none"
        name="c_battery"
        type="number"
        onChange={handleChange}
        value={c_battery}
        sx={{ m: 0.2 }}
      />
        <TextField
        fullWidth
        label="Arival Time"
        margin="none"
        name="c_time"
        type="datetime-local"
        onChange={handleChange}
        value={c_time}
        InputLabelProps={{
            shrink: true,
          }}
        sx={{ m: 1 }}
      />

       <Chip label="Requesting State"
color="primary"
variant="outlined"
sx={{ m: 2 }} />
        <TextField
        fullWidth
        label="Requesting Battery Percentage"
        margin="none"
        name="r_battery"
        type="number"
        onChange={handleChange}
        value={r_battery}
        sx={{ m: 0.2 }}
      />
        <TextField
        fullWidth
        label="Target Time"
        margin="none"
        name="r_time"
        type="datetime-local"
        value={r_time}
        onChange={handleChange}
        InputLabelProps={{
            shrink: true,
          }}
        sx={{ m: 1 }}
      />

        <Button
            color="secondary"
            variant="contained"
            sx={{ m: 1 }}
            onClick={onSubmit}
          >
            Submit
          </Button>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
        </Box>
      </Card>
      </Grid>
      <Grid
            item
            lg={7}
            md={6}
            xs={12}
          >
      { data ?
                              <UserPowerChart
                              data1={data.chargingState}
                              data2={data.powerOutput}
                              arrivalTime={data.userComponent.ArrivalTime}
                              labels={setTimeline(data.timeline)}
                              user={data.userComponent}
                              station={data.stationComponent}
                              finalcharge={data.finalchargingState}
                              />
      : <> </> }
      { results ?
        <RequirementResult
          data={results}
        />
      : <> </> }
      </Grid>
      </Grid>
    : <> </> }

<Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style}>
  {isLoading ? <CircularProgress /> : <> </>}
    <Typography id="modal-modal-title" variant="h6" component="h2">
      {modalText}
    </Typography>
    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
    </Typography>
  </Box>
</Modal>
    </div>
  );
};
