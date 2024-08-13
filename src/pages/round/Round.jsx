import { api, ENDPOINTS } from 'api/api';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const Round = () => {
  const [random, setrandom] = useState([]);
  
  const fetchrandom = async () => {
    try {
      const response = await api.get(`${ENDPOINTS.RAMDOM}`);
      setrandom(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchrandom();
  }, []);

  const cominground = random.filter((r) => r.status === 2);

  console.log(cominground);

  return (
    <>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Round No</TableCell>
              <TableCell>First Number</TableCell>
              <TableCell>Second Number</TableCell>
              <TableCell>Third Number</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cominground.map((r) => (
              <TableRow key={r.roundno}>
                <TableCell>{r.roundno}</TableCell>
                <TableCell>{r.a}</TableCell>
                <TableCell>{r.b}</TableCell>
                <TableCell>{r.c}</TableCell>
                <TableCell>{r.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Round;
