import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';
import { api, ENDPOINTS } from '../../api/api';

// Helper function to aggregate data by year
const aggregateDataByYear = (data) => {
  const result = {};
  data.forEach(item => {
    const date = new Date(item.time);
    const year = date.getFullYear();
    if (!result[year]) {
      result[year] = 0;
    }
    result[year] += item.quantity;
  });
  return Object.keys(result).map(year => ({
    year: year,
    quantity: result[year]
  }));
};

const YearChart = () => {
  const [options, setOptions] = useState({
    chart: {
      type: 'bar'
    },
    xaxis: {
      categories: [] // Will be set dynamically
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

        const depositsData = aggregateDataByYear(depositResponse.data);
        const withdrawsData = aggregateDataByYear(withdrawResponse.data);

        const years = [...new Set([...depositsData.map(d => d.year), ...withdrawsData.map(d => d.year)])];

        setOptions((prevState) => ({
          ...prevState,
          xaxis: {
            ...prevState.xaxis,
            categories: years
          }
        }));

        setSeries([
          {
            name: 'Deposits',
            data: depositsData.map(d => d.quantity)
          },
          {
            name: 'Withdraws',
            data: withdrawsData.map(d => d.quantity)
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
      <ApexCharts options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default YearChart;
