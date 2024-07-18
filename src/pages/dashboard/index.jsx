import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

// API import
import { api, ENDPOINTS } from '../../api/api';

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
        const usersResponse = await api.get(ENDPOINTS.USERS);
        setTotalUsers(usersResponse.data.count || 0);

        const depositsResponse = await api.get(ENDPOINTS.DEPOSITS);
        setTotalDeposits(depositsResponse.data.count || 0);

        const withdrawsResponse = await api.get(ENDPOINTS.WITHDRAWS);
        setTotalWithdraws(withdrawsResponse.data.count || 0);

        const coinsResponse = await api.get(ENDPOINTS.COINS);
        setTotalCoins(coinsResponse.data.count || 0);

        const coinTypesResponse = await api.get(ENDPOINTS.COINTYPES);
        setTotalCoinTypes(coinTypesResponse.data.count || 0);

        const networksResponse = await api.get(ENDPOINTS.NETWORKS);
        setTotalNetworks(networksResponse.data.count || 0);

        const imageSlidersResponse = await api.get(ENDPOINTS.IMAGE_SLIDER);
        setTotalImageSliders(imageSlidersResponse.data.count || 0);
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
    </Grid>
  );
}

export default DashboardDefault;
