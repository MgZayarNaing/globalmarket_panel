import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';
import { api, ENDPOINTS } from '../../api/api';

// Helper function to aggregate data by month
const aggregateDataByMonth = (data) => {
  const result = Array(12).fill(0);
  data.forEach(item => {
    const date = new Date(item.time);
    const month = date.getMonth();
    result[month] += item.quantity;
  });
  return result;
};

const MonthChart = () => {
  const [options, setOptions] = useState({
    chart: {
      type: 'line'
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yaxis: {
      title: {
        text: 'Amount'
      }
    },
    stroke: {
      curve: 'smooth'
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + ' units';
        }
      }
    },
    colors: ['#008FFB', '#00E396']
  });

  const [series, setSeries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [depositResponse, withdrawResponse] = await Promise.all([
          api.get(ENDPOINTS.DEPOSITS),
          api.get(ENDPOINTS.WITHDRAWS)
        ]);

        const depositsData = aggregateDataByMonth(depositResponse.data.results);
        const withdrawsData = aggregateDataByMonth(withdrawResponse.data.results);

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

export default MonthChart;
