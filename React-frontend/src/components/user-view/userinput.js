import { useState } from 'react';
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



export const UserInput = (props) => {
  const [values, setValues] = useState();
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalText, setText] = useState("")

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event) => {
    setValues(event.target.value);
  };

  const setTimeline = (timelinearray) => {
    let T = []
    timelinearray.forEach(time => {
        // T.push(time.substring(11, 16))  // a hack to get the time from ISO-8601 string
        T.push(new Date(time).toLocaleTimeString('en-GB', { hour: "numeric", minute: "numeric"}))
    })
    return T
}
  const onSubmit = async () => {
      console.log("th", payload)
     setOpen(true)
  }

  const onGenerate = async () => {
    setValues(JSON.stringify(payload,null, 3));
}

  return (
    <div>
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
          subheader=""
          title="Schedule New Charging"
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
        name="simid"
        type="text"
        sx={{ m: 1 }}
      />
        <TextField
        fullWidth
        label="Arival Time"
        margin="none"
        name="simid"
        type="text"
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
        name="simid"
        type="text"
        sx={{ m: 1 }}
      />
        <TextField
        fullWidth
        label="Target Time"
        margin="none"
        name="simid"
        type="text"
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
      { open ?     
                              <UserPowerChart
                              data1={payload.uc2.chargingState}
                              data2={payload.uc2.powerOutput}
                              arrivalTime={payload.uc2.userComponent.ArrivalTime}
                              labels={setTimeline(payload.uc2.timeline)}
                              user={payload.uc2.userComponent}
                              station={payload.uc2.stationComponent}
                              finalcharge={payload.uc2.finalchargingState}
                              />
      : <> </> }
      </Grid>
      </Grid>
    </div>
  );
};
