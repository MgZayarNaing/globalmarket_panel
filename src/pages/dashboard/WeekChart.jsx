import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';
import { api, ENDPOINTS } from '../../api/api';

// Helper function to aggregate data by week
const aggregateDataByWeek = (data) => {
  const result = Array(7).fill(0);
  data.forEach(item => {
    const date = new Date(item.time);
    const day = date.getDay();
    result[day] += item.quantity;
  });
  return result;
};

const WeekChart = () => {
  const [options, setOptions] = useState({
    chart: {
      type: 'line'
    },
    xaxis: {
      categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    }
  });

  const [series, setSeries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [depositResponse, withdrawResponse] = await Promise.all([
          api.get(ENDPOINTS.DEPOSITS),
          api.get(ENDPOINTS.WITHDRAWS)
        ]);

        const depositsData = aggregateDataByWeek(depositResponse.data.results);
        const withdrawsData = aggregateDataByWeek(withdrawResponse.data.results);

        setSeries([
          {
            name: 'Deposits',
            data: depositsData
          },
          {
            name: 'Withdraws',
            data: withdrawsData
          }
        ]);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div id="chart">
      <ApexCharts options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default WeekChart;
