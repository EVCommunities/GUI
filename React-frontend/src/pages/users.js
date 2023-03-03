import Head from 'next/head';
import { Box, Container, Grid, Typography } from '@mui/material';
import { NewSimulation } from '../components/simulation/new-simulation';
import { DashboardLayout } from '../components/dashboard-layout';
import { useRouter } from 'next/router'
import Link from 'next/link'
import {UserSimulation} from '../components/user-simulation/user-simulation'


const Page = ({username,simid}) => (
  
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
<UserSimulation
username={username}
simid={simid}
/>
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

Page.getInitialProps = async ({ query }) => {
  const {username} = query
  const {simid} = query
  console.log('simid :',simid)
  return {username, simid}
}

export default Page;
