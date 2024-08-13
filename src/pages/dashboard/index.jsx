import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';

// project import
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import WeekChart from './WeekChart';

// API import
import { api, ENDPOINTS } from '../../api/api';
import MonthChart from './MonthChat';
import YearChart from './Year';

const DashboardDefault = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [totalWithdraws, setTotalWithdraws] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [totalCoinTypes, setTotalCoinTypes] = useState(0);
  const [totalNetworks, setTotalNetworks] = useState(0);
  const [totalImageSliders, setTotalImageSliders] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Users Count
        const usersResponse = await api.get(ENDPOINTS.USERS);
        console.log(usersResponse.data); // Check the actual structure
        setTotalUsers(usersResponse.data.length || 0); // Access correct property


        // Fetch Deposits Count
        const depositsResponse = await api.get(ENDPOINTS.DEPOSITS);
        console.log('Deposits Response:', depositsResponse.data);
        setTotalDeposits(depositsResponse.data.length || 0);

        // Fetch Withdraws Count
        const withdrawsResponse = await api.get(ENDPOINTS.WITHDRAWS);
        console.log('Withdraws Response:', withdrawsResponse.data);
        setTotalWithdraws(withdrawsResponse.data.length || 0);

        // Fetch Coins Count
        const coinsResponse = await api.get(ENDPOINTS.COINS);
        console.log('Coins Response:', coinsResponse.data);
        setTotalCoins(coinsResponse.data.length || 0);

        // Fetch Coin Types Count
        const coinTypesResponse = await api.get(ENDPOINTS.COINTYPES);
        console.log('Coin Types Response:', coinTypesResponse.data);
        setTotalCoinTypes(coinTypesResponse.data.length || 0);

        // Fetch Networks Count
        const networksResponse = await api.get(ENDPOINTS.NETWORKS);
        console.log('Networks Response:', networksResponse.data);
        setTotalNetworks(networksResponse.data.length || 0);

        // Fetch Image Sliders Count
        const imageSlidersResponse = await api.get(ENDPOINTS.IMAGE_SLIDER);
        console.log('Image Sliders Response:', imageSlidersResponse.data);
        setTotalImageSliders(imageSlidersResponse.data.length || 0);

      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Users" count={totalUsers} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Deposits" count={totalDeposits} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Withdraws" count={totalWithdraws} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Coins" count={totalCoins} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Coin Types" count={totalCoinTypes} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Networks" count={totalNetworks} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Image Sliders" count={totalImageSliders} />
      </Grid>
      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      <Grid item xs={12} md={6} lg={6}>
        <WeekChart />
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <MonthChart />
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <YearChart />
      </Grid>
    </Grid>
  );
}

export default DashboardDefault;
