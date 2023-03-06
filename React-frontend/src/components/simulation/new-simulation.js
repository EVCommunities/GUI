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
  Typography,
  Modal
} from '@mui/material';
import axios from "axios";
import payload from './sample-payload.json'

const backendAddress = process.env.NEXT_PUBLIC_EVC_GUI_BACKEND || "http://localhost:7001";



export const NewSimulation = (props) => {
  const [values, setValues] = useState();
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalText, setText] = useState("")

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event) => {
    setValues(event.target.value);
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

  const onSubmit = async () => {
      console.log(values)
      handleOpen();
      setLoading(true)
      setText("Simulation is Starting")
      try {
        const res = await axios.post(backendAddress + "/simulations",JSON.parse(values) );
        console.log(res.data)
        setLoading(false)
        if (Object.hasOwn(res.data, "simulation_id")) {
          setText(res.data.message + " " + "Simulation Id :" + res.data.simulation_id);
        } else {
          setText(res.data.message + " " + "Error:" + res.data.error);
        }
      } catch(e) {
        console.log(e)
        setLoading(false)
        if (Object.hasOwn(e, "response") && Object.hasOwn(e.response, "data") && Object.hasOwn(e.response.data, "error")) {
          setText("Error: " + e.response.data.error);
        } else {
          setText(e.message);
        }
      }
  }

  const onGenerate = async () => {
    setValues(JSON.stringify(payload,null, 3));
}

  return (
    <form
      autoComplete="off"
      noValidate
      {...props}
    >
      <Card>
      <Grid container
spacing={2}>
      <Grid item
md={6}>
        <CardHeader
          subheader=""
          title="Simulation Starter"
        />
        </Grid>
        <Grid item
md={6}>
        <div style={{ padding: 20 }}>
        <Button
            color="secondary"
            variant="contained"
            onClick={onGenerate}
          >
            Generate Payload
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

              <TextField
                fullWidth
                helperText="Please specify the simulation config"
                label="Simulation config in JSON"
                name="simulation"
                multiline
                minRows = {30}
                onChange={handleChange}
                disabled={isLoading}
                required
                value={values}
                variant="outlined"
              />
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
          <Button
            color="primary"
            variant="contained"
            onClick={onSubmit}
          >
            Start Simulation
          </Button>
        </Box>
      </Card>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        {isLoading ? <CircularProgress /> : <> </>}
          <Typography id="modal-modal-title"
variant="h6"
component="h2">
            {modalText}
          </Typography>
        </Box>
      </Modal>
    </form>
  );
};
