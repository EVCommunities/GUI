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

    const setTimeline = (timelinearray) => {
        let T = []
        timelinearray.forEach(time => {
            T.push(new Date(time))
        })
        return T
    }
    const [data, setData] = useState([]);
    console.log("simid: awa  ",props.simid)
    useEffect(() => {
        async function getData() {
            let arr = []
            try {
                const res = await axios.get("http://localhost:7001/data?simid=" + simid);
                let graphcount = Object.keys(res.data)

                let i = 1
                graphcount.forEach(item => {
    
                        arr.push(  
                            <Grid
                            item
                            lg={6}
                            md={6}
                            xl={6}
                            xs={12}
                          >
                        <UserPowerChart
                            data1={res.data[item].chargingState}
                            data2={res.data[item].powerOutput}
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