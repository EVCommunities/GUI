
import Head from 'next/head';
import { Box, Container } from '@mui/material';
import { SimulationrListResults } from '../components/simulation/simulation-list-results';
import { DashboardLayout } from '../components/dashboard-layout';



const Page = () => (
  <>
    <Head>
      <title>
        Simiulations
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
        <Box sx={{ mt: 3 }}>
          <SimulationrListResults />
        </Box>
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
