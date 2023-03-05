import { useState,useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  CircularProgress,
  Alert,
  Chip,
  Typography,
  Modal
} from '@mui/material';
import {UserPowerChart} from "../dashboard/user-power-chart";
import payload from './sample-data.json'
import axios from "axios";

const backendAddress = process.env.NEXT_PUBLIC_EVC_GUI_BACKEND || "http://localhost:7001";



export const UserSimulation = (props) => {
  const [values, setValues] = useState();
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalText, setText] = useState("Loading")
  const [currentUser, setcurrentUser] = useState();
  const [data, setData] = useState();
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
    // setValues(event.target.value);
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
        const index = payload.findIndex(item => item.UserId === parseInt(props.username))
        setcurrentUser(payload[index])
        const res = await axios.get(backendAddress + "/data?simid=" + simid);
        console.log("got",res.data)
        console.log('cuser :', currentUser)
        setData(res.data[payload[index].UserName])
        setOpen(true)
    } catch(error) {
        console.log(error)
    }
}

  const onSubmit = async () => {
    try {
        setText("Processing")
        setOpen(true)
        currentUser.StateOfCharge = c_battery
        currentUser.ArrivalTime = c_time  + ':00Z'
        currentUser.TargetStateOfCharge = r_battery
        currentUser.TargetTime = r_time + ':00Z'
        console.log("CR :",currentUser)
        const res = await axios.post(backendAddress + "/usersession",(currentUser) );
        console.log(res.data)
        setLoading(false)
        setText(currentUser.UserName + " requirements are submitted. Waiting to process.......")
        const intervalid = setInterval( async () => {
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
        }, 5000);
      } catch(e) {
        console.log(e)
        setLoading(false)
        setText(e.response.data ? e.response.data : e.message )
      }



  }

const usernames = ['1','2','3']

useEffect(() => {
    
    if(usernames.includes(props.username)){
        const index = payload.findIndex(item => item.UserId === parseInt(props.username))
        
        setcurrentUser(payload[index])
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
            setText("User " + props.username + " is not recognized." )
        }
        
        setOpen(true)
    }
 },[props.username])


  return (
    <div>
        { currentUser ? 
        <Grid container
spacing={2} >
                  <Grid
            item
            lg={4}
            md={4}
            xs={6}
          >
      <Card>
      <Grid container
spacing={2}>
      <Grid item
md={12}>
        <CardHeader
        //   subheader= 
          title={"Schedule New Charging for User - " + props.username}
        />
        </Grid>
        <Grid item
md={6}>

          </Grid>
          </Grid>
        <Divider />
        <CardContent>
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
        sx={{ m: 1 }}
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
        sx={{ m: 1 }}
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
            xs={6}
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
