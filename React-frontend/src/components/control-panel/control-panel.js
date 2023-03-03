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
  const [url, setURL] = useState('');


  const handleChange = (event) => {
    let eName = event.target.name
    if(eName == 's_name'){
        setSName((event.target.value))
    } else if(eName == 'tot_power'){
        setTPower(parseInt(event.target.value))
    } else{
        setELength(parseInt(event.target.value))
    }
  };


  const onSubmit = async () => {
    let tempurl = window.location.href.toString()
    tempurl = tempurl.replace('controlpanel','')
    console.log("tmp  :",tempurl)
    setURL(tempurl)
    try {

        let payload = {
            "Name": s_name,
            "EpochLength": e_length,
            "TotalMaxPower": tot_power
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
<TextField fullWidth disabled  label={'User1 URL'} id="margin-dense" margin="dense" value={url + 'users?username=1'}        
InputLabelProps={{
        shrink: true,
      }} />
<TextField fullWidth disabled  label={'User2 URL'} id="margin-dense" margin="dense" value={url + 'users?username=2'}  />
<TextField fullWidth disabled  label={'User3 URL'} id="margin-dense" margin="dense" value={url + 'users?username=3'}  />
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
