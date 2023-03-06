import React, { useEffect, useState }  from "react";
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Box, Button,TextField, Card, CardContent, CardHeader, Divider, useTheme, Grid, Item } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import axios from "axios";
import {NewSales} from "./user-power-chart";
import {Graphs} from "./graphs";

export const GraphSection = (props) => {

  const [userInput, setUserInput] = useState('');
  const [id, setID] = useState(userInput);
  const [graphLoaded, setgraphLoaded] = useState(false);

  const handleInputChange = (event) => {
    setUserInput(event.target.value)
  }
  const handleButtonClick = async () => {
    try {
      setID(userInput)
      setgraphLoaded(true)
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleClearButtonClick = async () => {
    try {
      setID(null)
      setUserInput('')
      setgraphLoaded(false)
    } catch (error) {
      console.error('Error:', error);
    }
  }

    return (
        
        <>

  <Grid item
xs={3}>
  <TextField
        fullWidth
        label="Simulation Id"
        margin="none"
        name="simid"
        type="text"
        value={userInput}
        onChange={handleInputChange}
      />
  </Grid>
  <Grid item
xs={6}>
  <Button
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        onClick={handleButtonClick}
      >
       Search
      </Button>
      &nbsp; &nbsp;
      { graphLoaded ?   <Button
        color="error"
        size="large"
        type="submit"
        variant="contained"
        onClick={handleClearButtonClick}
      >
       Clear
      </Button> : <> </> }
  </Grid>
    <Graphs
    simid={id}
    />
    </>
    )
} 