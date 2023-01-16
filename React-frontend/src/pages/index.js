import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';

import { DashboardLayout } from '../components/dashboard-layout';
import {Graphs} from '../components/dashboard/graphs';
import {GraphSection} from '../components/dashboard/graphs-section';


const Page = () => (
  <>
    <Head>
      <title>
        Dashboard | Material Kit
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >
            <GraphSection/> 
                        <Graphs />

        </Grid>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
