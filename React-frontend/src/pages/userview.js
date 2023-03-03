
import Head from 'next/head';
import { Box, Container, Grid,Typography } from '@mui/material';
import { SimulationrListResults } from '../components/simulation/simulation-list-results';
import { DashboardLayout } from '../components/dashboard-layout';
import {UserInput} from '../components/user-view/userinput'



const Page = () => (
  <>
    <Head>
      <title>
        User View
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

<UserInput />
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
