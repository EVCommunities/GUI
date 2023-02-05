import { useEffect,useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import axios from "axios";
import { getInitials } from '../../utils/get-initials';

export const SimulationrListResults = ({ customers, ...rest }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [simulations, setSimulations] = useState([]);

  const backendAddress = process.env.NEXT_PUBLIC_EVC_GUI_BACKEND || "http://localhost:7001";


useEffect(() => {
    async function getSimulations() {
        let arr = []
        try {
            const res = await axios.get(backendAddress + "/simulations");
            arr = res.data
        } catch(error) {
            console.log(error)
        }
        console.log(arr)
        setSimulations(arr)
    }
    getSimulations();
 },[])

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    console.log("newpage :",newPage)
    setPage(newPage);
  };

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                Simulation Id
                </TableCell>
                <TableCell>
                Description
                </TableCell>
                <TableCell>
                Epochs
                </TableCell>
                <TableCell>
                End Time
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {simulations.slice((page*limit), ((page+1)*limit)).map((customer) => (
                <TableRow
                  hover
                  key={customer.SimulationId}
                  selected={selectedCustomerIds.indexOf(customer.SimulationId) !== -1}
                >
                  {/* <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomerIds.indexOf(customer.id) !== -1}
                      onChange={(event) => handleSelectOne(event, customer.id)}
                      value="true"
                    />
                  </TableCell> */}
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {customer.Name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {customer.SimulationId}
                  </TableCell>
                  <TableCell>
                    {customer.Description}
                  </TableCell>
                  <TableCell>
                    {customer.Epochs}
                  </TableCell>
                  <TableCell>
                    {customer.EndTime}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={simulations.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

SimulationrListResults.propTypes = {

};
