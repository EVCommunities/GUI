import React, { useEffect, useState }  from "react";
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Box, Button, Card, CardContent, CardHeader, Divider, useTheme, Grid } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import axios from "axios";
import {UserPowerChart} from "./user-power-chart";

export const Graphs = (props) => {

    let simid = props.simid
    const backendAddress = process.env.NEXT_PUBLIC_EVC_GUI_BACKEND || "http://localhost:7001";

    const setTimeline = (timelinearray) => {
        let T = []
        timelinearray.forEach(time => {
            // T.push(time.substring(11, 16))  // a hack to get the time from ISO-8601 string
            T.push(new Date(time).toLocaleTimeString('en-GB', { hour: "numeric", minute: "numeric"}))
        })
        return T
    }
    const [data, setData] = useState([]);
    console.log("simid: ",props.simid)
    useEffect(() => {
        async function getData() {
            let arr = []
            try {
                const res = await axios.get(backendAddress + "/data?simid=" + simid);
                let graphcount = Object.keys(res.data)

                let i = 1
                graphcount.forEach(item => {

                        arr.push(
                            <Grid
                            item
                            lg={6}
                            md={6}
                            xl={4}
                            xs={12}
                          >
                        <UserPowerChart
                            data1={res.data[item].chargingState}
                            data2={res.data[item].powerOutput}
                            arrivalTime={res.data[item].userComponent.ArrivalTime}
                            labels={setTimeline(res.data[item].timeline)}
                            user={res.data[item].userComponent}
                            station={res.data[item].stationComponent}
                            finalcharge={res.data[item].finalchargingState}
                            />
                            </Grid>
                          )
                    i = i + 1

                })
            } catch(error) {
                console.log(error)
            }
            console.log(arr)
            setData(arr)
        }
        getData();
     },[props.simid])



    return (

        <>
        {simid ? data : <> </> }

        </>
    )
};
