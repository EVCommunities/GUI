import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Typography} from '@mui/material';


export const RequirementResult = (props) => {
  const users = Object.keys(props.data);
  const results = users.map(user => {return {"user": user, "result": props.data[user].Result}});
  const requirementsOk = users.map(user => props.data[user].Ok).reduce((first, second) => first && second);
  const title = requirementsOk ? "All user requirements fulfilled" : "Some requirements were not fulfilled";

  return (
    <TableContainer component={Paper}>
      <Typography
        color="success"
        gutterBottom="true"
        variant="overline"
      >
        <span style={requirementsOk ? {'color': 'green'} : {'color': 'red'}}>{title}</span>
      </Typography>
      <Table aria-label="simple table">
        <TableBody>
          <TableRow>
            {results.map((result) => (
              <TableCell align='center'>
                <strong>{result.user}</strong>: <span style={result.result >= 100.0 ? {'background-color': 'green'} : {'background-color': 'red'}}>{result.result} %</span>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
