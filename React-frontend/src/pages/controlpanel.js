import Head from 'next/head';
import { Box, Container, Grid, Typography } from '@mui/material';
import { NewSimulation } from '../components/simulation/new-simulation';
import { DashboardLayout } from '../components/dashboard-layout';
import { useRouter } from 'next/router'
import Link from 'next/link'
import {ControlPanel} from '../components/control-panel/control-panel'


const Page = () => (
  
    <>
    <Head>
      <title>
       Control Panel
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth ='lg'>
        <Grid
          container
          spacing={3}
        >
            <ControlPanel>
                
            </ControlPanel>
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
