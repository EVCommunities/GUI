import React, { useEffect, useState }  from "react";
import {Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend, TimeScale} from "chart.js";
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Box, Button, Card, CardContent, CardHeader, Divider, useTheme,LinearProgress, Typography } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import axios from "axios";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, TimeScale);

export const UserPowerChart = (props) => {
  const theme = useTheme();

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          // unit: "minute",
          // unitStepSize: 1000
          displayFormats: {
            minute: 'h:mm'
        }
        }
      },
      "y1": {
        id:"y1",
        beginAtZero: true,
        position: 'left',
        display: true,
        max:100
      },
      "y2": {
        id:"y2",
        beginAtZero: true,
        position: 'right',
        display: true,
        max:100
      }
    },
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    xAxes: [
      // {
      //   ticks: {
      //     fontColor: theme.palette.text.secondary
      //   },
      //   gridLines: {
      //     display: false,
      //     drawBorder: false
      //   }
      // }
    ],
    yAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
          beginAtZero: true,
          min: 0
        },
        gridLines: {
          borderDash: [2],
          borderDashOffset: [2],
          color: theme.palette.divider,
          drawBorder: false,
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
          zeroLineColor: theme.palette.divider
        }
      }
    ],
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };


  const labels = props.labels;
  let data1 = props.data1
  let data2 = props.data2
  let count = 0
  const [state, setState] = useState({
    labels: labels,
    datasets: [
      {
          label: 'Battery',
          backgroundColor: '#B2B9E1',
          borderColor: "#3F51B5",
          data: data1,
          borderWidth: 4,
          yAxisID: 'y1',
          },
          {
          label: 'Power',
          backgroundColor: '#FDD199',
          borderColor: "#FB8C00",
          data: data2,
          borderWidth: 4,
          stepped: true,
          yAxisID: 'y2',
          }
    ]
  });


  return (
    <Card {...props}>
      <CardHeader
        action={(
          <Button
            endIcon={<ArrowDropDownIcon fontSize="small" />}
            size="small"
          >
            Ongoing Power Chart

          </Button>
        )}
        title={props.user.UserName}
      />
      <Divider />
      <CardContent>
      <Typography
            color="info"
            gutterBottom="true"
            variant="overline"
          >
            Battery Capacity : <span style={{'color':'blue'}}>{props.user.CarBatteryCapacity}kwh </span>  &nbsp; &nbsp;
            </Typography>
            <Typography
            color="info"
            gutterBottom="true"
            variant="overline"
          >
            Max Power Input : <span style={{'color':'blue'}}>{props.user.CarMaxPower}kw </span>  &nbsp; &nbsp;
            </Typography>
      <Divider />
      <Typography
            color="success"
            gutterBottom="true"
            variant="overline"
          >
             Initial Battery : <span style={{'color':'red'}}> {props.user.StateOfCharge}%  </span>&nbsp; &nbsp;
            </Typography>
            <Typography
            color="info"
            gutterBottom="true"
            variant="overline"
          >
            Requested Battery: <span style={{'color':'orange'}}>{props.user.TargetStateOfCharge}% </span>  &nbsp; &nbsp;
            </Typography>
            <Typography
            color="success"
            gutterBottom="true"
            variant="overline"
          >
            Final Battery: <span style={{'color':'green'}}> {props.finalcharge}% </span>  &nbsp; &nbsp;
          </Typography>
          <Divider />
        <Box
          sx={{
            height: 400,
            position: 'relative'
          }}
        >
          <Line
            data={state}
            options={options}
          />
        </Box>
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
          endIcon={<ArrowRightIcon fontSize="small" />}
          size="small"
        >
          Overview
        </Button>
      </Box>
    </Card>
  );
};
