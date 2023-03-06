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
  Snackbar,
  Modal
} from '@mui/material';
import axios from "axios";

const backendAddress = process.env.NEXT_PUBLIC_EVC_GUI_BACKEND || "http://localhost:7001";



export const ControlPanel = (props) => {
  const [values, setValues] = useState();
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalText, setText] = useState("Loading")
  const [currentUser, setcurrentUser] = useState();
  const [data, setData] = useState();
  const [s_name, setSName] = useState();
  const [e_length, setELength] = useState();
  const [tot_power, setTPower] = useState();
  const [user_names, setUserNames] = useState();
  const [user_name_map, setUserNameMap] = useState();
  const [url, setURL] = useState('');


  const handleChange = (event) => {
    let eName = event.target.name
    if(eName == 's_name'){
        setSName((event.target.value))
    } else if(eName == 'tot_power'){
        setTPower(parseInt(event.target.value))
    } else if (eName == 'user_names'){
        setUserNames(event.target.value);
        let userNameList = event.target.value.split(" ").filter(name => name != "");
        if (userNameList.length == 0) {
          userNameList = ["User"];
        }
        let userNameMap = {};
        for (let i=0; i<userNameList.length; ++i) {
          userNameMap[i+1] = userNameList[i];
        }
        setUserNameMap(userNameMap);
    } else{
        setELength(parseInt(event.target.value))
    }
  };

  const clearSession = async () => {
    try {
        const res = await axios.delete(backendAddress + "/session" );
        console.log(res.data)
        setURL('')
    } catch(e) {
        console.log(e)
    }
  }

  const onSubmit = async () => {
    if (user_name_map == undefined || user_name_map.constructor != Object) {
      setUserNameMap({"1": "User"});
    }
    console.log("Users: ", user_name_map);
    let tempurl = window.location.href.toString()
    tempurl = tempurl.replace('controlpanel','')
    console.log("tmp  :",tempurl)
    setURL(tempurl)
    try {
        let payload = {
            "Name": s_name,
            "EpochLength": e_length,
            "TotalMaxPower": tot_power,
            "UserNames": user_name_map
        }
        const res = await axios.post(backendAddress + "/session",payload );
        setText(res.data)
        setOpen(true)

      } catch(e) {
        console.log(e)
        setLoading(false)
        setText(e.message)
      }
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>

        <Grid container
spacing={2} >
                  <Grid
            item
            lg={12}
            md={12}
            xs={12}
          >
      <Card>
      <Grid container
spacing={2}>
      <Grid item
md={12}>
        <CardHeader
         subheader={"Set the initial configurations for users"}
          title={"Start a New Simulation for Interactive Users"}
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
  <TextField
        fullWidth
        label="Simulation Name"
        margin="none"
        name="s_name"
        type="text"
        onChange={handleChange}
        value={s_name}
        sx={{ m: 1 }}
      />
        <TextField
        fullWidth
        label="Epoch Length"
        margin="none"
        name="e_length"
        type="number"
        onChange={handleChange}
        value={e_length}
        sx={{ m: 1 }}
      />

        <TextField
        fullWidth
        label="Total Max Power (kwh)"
        margin="none"
        name="tot_power"
        type="number"
        onChange={handleChange}
        value={tot_power}
        sx={{ m: 1 }}
      />

        <TextField
        fullWidth
        label="List of user names"
        margin="none"
        name="user_names"
        type="text"
        onChange={handleChange}
        value={user_names}
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

    { url ?
      <Grid
      item
      lg={7}
      md={6}
      xs={6}
    >
              <Card>
      <Grid container
spacing={2}>
      <Grid item
md={6}>
        <CardHeader
          subheader=""
          title="URLs List of Users"
        />
        </Grid>
        <Grid item
md={6}>
        <div style={{ padding: 20 }}>
        <Button
            color="secondary"
            variant="contained"
            onClick={clearSession}
          >
            Clear Session
          </Button>
        </div>

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
<TextField fullWidth disabled  label={user_name_map['1'] + ' URL'} id="margin-dense" margin="dense" value={url + 'users?username=1'}
InputLabelProps={{
        shrink: true,
      }} />
{"2" in user_name_map ? <TextField fullWidth disabled label={user_name_map['2'] + ' URL'} id="margin-dense" margin="dense" value={url + 'users?username=2'} /> : <></> }
{"3" in user_name_map ? <TextField fullWidth disabled label={user_name_map['3'] + ' URL'} id="margin-dense" margin="dense" value={url + 'users?username=3'} /> : <></> }
{"4" in user_name_map ? <TextField fullWidth disabled label={user_name_map['4'] + ' URL'} id="margin-dense" margin="dense" value={url + 'users?username=4'} /> : <></> }
{"5" in user_name_map ? <TextField fullWidth disabled label={user_name_map['5'] + ' URL'} id="margin-dense" margin="dense" value={url + 'users?username=5'} /> : <></> }
{"6" in user_name_map ? <TextField fullWidth disabled label={user_name_map['6'] + ' URL'} id="margin-dense" margin="dense" value={url + 'users?username=6'} /> : <></> }
{"7" in user_name_map ? <TextField fullWidth disabled label={user_name_map['7'] + ' URL'} id="margin-dense" margin="dense" value={url + 'users?username=7'} /> : <></> }
{"8" in user_name_map ? <TextField fullWidth disabled label={user_name_map['8'] + ' URL'} id="margin-dense" margin="dense" value={url + 'users?username=8'} /> : <></> }
{"9" in user_name_map ? <TextField fullWidth disabled label={user_name_map['9'] + ' URL'} id="margin-dense" margin="dense" value={url + 'users?username=9'} /> : <></> }

            </Grid>
          </Grid>
        </CardContent>
      </Card>

</Grid>
    : <> </> }


      </Grid>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {modalText}
        </Alert>
      </Snackbar>
    </div>
  );
};
