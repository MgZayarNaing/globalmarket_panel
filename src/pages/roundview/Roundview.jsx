import { Box, Stack, TextField, Typography,Button,Container,Grid,Paper,
    TableContainer,Table,TableCell,TableHead,TableRow,TableBody } from '@mui/material';
  import { api, ENDPOINTS } from 'api/api';
  import React, { useEffect, useState } from 'react'
  import AddIcon from '@mui/icons-material/Add';
  import DensityLargeIcon from '@mui/icons-material/DensityLarge';
  
  const Roundview = () => {
      const [data,setdata] = useState([])
      const [customers,setCustomers] = useState([])
      const [loading, setLoading] = useState(false);
      const [error,setError] = useState();
      const [ran,setran] = useState([])
  
      const fetchroundview = async () => {
          try {
              setLoading(true);
              const response = await api.get(`${ENDPOINTS.ROUNDVIEW}`);
              setdata(response.data || []);
              setran(response.data.ran)
              setLoading(false);
          } catch (error) {
              setError(error);
              setLoading(false);
          }
      };
  
      const fetchCustomers = async () => {
        try {
            const response = await api.get(ENDPOINTS.USERS);
            setCustomers(response.data || []);
        } catch (error) {
            console.error('Fetch customers error:', error);
        }
    };
  
      useEffect(()=>{
          fetchroundview();
          fetchCustomers();
      },[])
  
      const inputChanged = (evt) => {
         let random ={...ran}	
         random[evt.target.name] = evt.target.value
         setran(random)
         calculatetotal(random)
        }
  
        const calculatetotal = (ran) =>{
          let random = ran
          let total = Number(ran.a) + Number(ran.b) + Number(ran.c)
          random.total=total
          setran(random)
        }
  
        useEffect(() => {
          const interval = setInterval(() => {
            const countdown = document.getElementById("countdown");
            const now = new Date();
            let minutes = 5 - now.getMinutes() % 5;
            if (minutes == 5) {
              minutes = 0;
            }
            let seconds = 60 - now.getSeconds();
      
            let displayMinutes = minutes < 10 ? "0" + minutes : minutes;
            let displaySeconds = seconds < 10 ? "0" + seconds : seconds;
            countdown.innerHTML = displayMinutes + " : " + displaySeconds;
          }, 1000);
          return () => clearInterval(interval);
        }, []);
  
    return (
      <>
      <Stack direction="row" sx={{marginX:"25%"}}>
      <Box sx={{
            padding:2,
            maxWidth:"40%",
            backgroundColor:'#fff',
            boxShadow:2,
            borderRadius: 1,
          }}>
        <Typography variant='h4' sx={{textAlign:"center"}}>Current Round &nbsp; {ran.roundno}</Typography>
      </Box>
      <Box sx={{padding:2,
            backgroundColor:'#fff',
            boxShadow:2,
            borderRadius: 1,
            marginLeft:1}}>
            <Typography variant='h4' sx={{marginTop:1}} id="countdown">0:00</Typography>
      </Box>
      </Stack>
  
      <Stack direction="row" sx={{marginX:"25%",marginTop:1,}}>
      <Box sx={{
            padding:2,
            backgroundColor:'#fff',
            boxShadow:2,
            borderRadius: 1,
          }}>
      <Stack direction="row">
      <TextField
            id="outlined-number"
            type="text"
            style={{maxWidth:"50px",backgroundColor:"white"}}
            InputLabelProps={{
              shrink: true,
            }}
            name="a"
            value={ran.a}
            onChange={inputChanged}
          />
          <div style={{paddingTop:"10px"}}>
          <AddIcon/>
          </div>
     <TextField
            id="outlined-number"
            type="text"
            style={{maxWidth:"50px",backgroundColor:"white"}}
            InputLabelProps={{
              shrink: true,
            }}
            name="b"
            value={ran.b}
            onChange={inputChanged}
          />
          <div style={{paddingTop:"10px"}}>
           <AddIcon/></div>
     <TextField
            id="outlined-number"
            type="text"
            style={{maxWidth:"50px",backgroundColor:"white"}}
            InputLabelProps={{
              shrink: true,
            }}
             name="c"
            value={ran.c}
            onChange={inputChanged}
          />
          <div style={{paddingTop:"10px"}}>
          <DensityLargeIcon/></div>
      <TextField
            id="outlined-number"
            type="text"
            style={{maxWidth:"50px",backgroundColor:"white"}}
            InputLabelProps={{
              shrink: true,
            }}
             name="total"
            value={ran.total}
          />
  
      <Button variant="contained" sx={{marginLeft:1}}>
          save
      </Button>
      </Stack>
      </Box>
      </Stack>
  
  <Container sx={{marginTop:2}}>
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Typography variant="h3" sx={{textAlign:"center"}}>NEW MEMBER</Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}>
          <Typography variant="h5" sx={{textAlign:"center"}}>All User</Typography>
          <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
              <TableCell align="center">User</TableCell>
                <TableCell align="center">Choice</TableCell>
                <TableCell align="center">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.rm1 && data.rm1.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="center">{customers.find(customer => customer.uuid === row.user)?.name || ''}</TableCell>
                  <TableCell align="center">{row.choice}</TableCell>
                  <TableCell align="center">{row.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
          </Grid>
  
          <Grid item xs={6}>
          <Typography variant="h5" sx={{textAlign:"center"}}>Current Winner</Typography>
          <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
              <TableCell align="center">User</TableCell>
                <TableCell align="center">Choice</TableCell>
                <TableCell align="center">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.rm1cw && data.rm1cw.map((row) => (
                <TableRow key={row.id}>
                 <TableCell align="center">{customers.find(customer => customer.uuid === row.user)?.name || ''}</TableCell>
                  <TableCell align="center">{row.choice}</TableCell>
                  <TableCell align="center">{row.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
          </Grid>
        </Grid> {/* container */}
      </Grid>
  
      <Grid item xs={6}>
      <Typography variant="h3" sx={{textAlign:"center"}}>INTERMEDIATE</Typography>
      <Grid container spacing={1}>
          <Grid item xs={6}>
          <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
               <TableCell align="center">User</TableCell>
                <TableCell align="center">Choice</TableCell>
                <TableCell align="center">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.rm2 && data.rm2.map((row) => (
                <TableRow key={row.id}>
                   <TableCell align="center">{customers.find(customer => customer.uuid === row.user)?.name || ''}</TableCell>
                  <TableCell align="center">{row.choice}</TableCell>
                  <TableCell align="center">{row.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
          </Grid>
  
          <Grid item xs={6}>
          <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">User</TableCell>
                <TableCell align="center">Choice</TableCell>
                <TableCell align="center">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.rm2cw && data.rm2cw.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="center">{customers.find(customer => customer.uuid === row.user)?.name || ''}</TableCell>
                  <TableCell align="center">{row.choice}</TableCell>
                  <TableCell align="center">{row.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
          </Grid>
        </Grid> {/* container */}
      </Grid>
    </Grid>
  </Container>
      </>
    )
  }
  
  export default Roundview;
  