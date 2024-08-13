import { Box, Stack, TextField, Typography, Button, Container, Grid, Paper, TableContainer, Table, TableCell, TableHead, TableRow, TableBody, Card, CardContent } from '@mui/material';
import { api, ENDPOINTS } from 'api/api';
import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import DensityLargeIcon from '@mui/icons-material/DensityLarge';

const Roundview = () => {
    const [data, setdata] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [ran, setran] = useState([]);

    const fetchroundview = async () => {
        try {
            setLoading(true);
            const response = await api.get(`${ENDPOINTS.ROUNDVIEW}`);
            setdata(response.data || []);
            setran(response.data.ran);
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

    useEffect(() => {
        fetchroundview();
        fetchCustomers();
    }, []);

    const inputChanged = (evt) => {
        let random = { ...ran };
        random[evt.target.name] = evt.target.value;
        setran(random);
        calculatetotal(random);
    };

    const calculatetotal = (ran) => {
        let random = ran;
        let total = Number(ran.a) + Number(ran.b) + Number(ran.c);
        random.total = total;
        setran(random);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const countdown = document.getElementById("countdown");
            const now = new Date();
            let minutes = 5 - now.getMinutes() % 5;
            if (minutes === 5) {
                minutes = 0;
            }
            let seconds = 60 - now.getSeconds();
            if (seconds % 10 === 0) {
                fetchroundview();
            }
            let displayMinutes = minutes < 10 ? "0" + minutes : minutes;
            let displaySeconds = seconds < 10 ? "0" + seconds : seconds;
            countdown.innerHTML = displayMinutes + " : " + displaySeconds;
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const CHRandom = async () => {
        await api.put(ENDPOINTS.RAMDOMCH(ran.id), ran, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    };

    return (
        <Container maxWidth="lg">
            <Stack direction="row" justifyContent="center" spacing={2} sx={{ marginY: 4 }}>
                <Box sx={{
                    padding: 2,
                    maxWidth: "40%",
                    backgroundColor: '#f5f5f5',
                    boxShadow: 2,
                    borderRadius: 1,
                    textAlign: "center"
                }}>
                    <Typography variant='h4'>Current Round &nbsp; {ran.roundno}</Typography>
                </Box>
                <Box sx={{
                    padding: 2,
                    backgroundColor: '#f5f5f5',
                    boxShadow: 2,
                    borderRadius: 1,
                    textAlign: "center"
                }}>
                    <Typography variant='h4' sx={{ marginTop: 1 }} id="countdown">0:00</Typography>
                </Box>
            </Stack>

            <Stack direction="row" justifyContent="center" spacing={2}>
                <Box sx={{
                    padding: 2,
                    backgroundColor: '#fff',
                    boxShadow: 2,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <TextField
                        id="outlined-number"
                        type="text"
                        size="small"
                        style={{ maxWidth: "50px" }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        name="a"
                        value={ran.a}
                        onChange={inputChanged}
                    />
                    <AddIcon sx={{ marginX: 1 }} />
                    <TextField
                        id="outlined-number"
                        type="text"
                        size="small"
                        style={{ maxWidth: "50px" }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        name="b"
                        value={ran.b}
                        onChange={inputChanged}
                    />
                    <AddIcon sx={{ marginX: 1 }} />
                    <TextField
                        id="outlined-number"
                        type="text"
                        size="small"
                        style={{ maxWidth: "50px" }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        name="c"
                        value={ran.c}
                        onChange={inputChanged}
                    />
                    <DensityLargeIcon sx={{ marginX: 1 }} />
                    <TextField
                        id="outlined-number"
                        type="text"
                        size="small"
                        style={{ maxWidth: "50px" }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        name="total"
                        value={ran.total}
                    />
                    <Button variant="contained" sx={{ marginLeft: 2 }} onClick={CHRandom}>
                        Save
                    </Button>
                </Box>
            </Stack>

            <Grid container spacing={4} sx={{ marginTop: 4 }}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h3" sx={{ textAlign: "center", marginBottom: 2 }}>NEW MEMBER</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 2 }}>All User</Typography>
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
                                <Grid item xs={12} sx={{ marginTop: 4 }}>
                                    <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 2 }}>Current Winner</Typography>
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
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h3" sx={{ textAlign: "center", marginBottom: 2 }}>INTERMEDIATE</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 2 }}>All User</Typography>
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
                                <Grid item xs={12} sx={{ marginTop: 4 }}>
                                    <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 2 }}>Current Winner</Typography>
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
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={4} sx={{ marginTop: 4 }}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h3" sx={{ textAlign: "center", marginBottom: 2 }}>ADVANCED</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 2 }}>All User</Typography>
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
                                                {data.rm3 && data.rm3.map((row) => (
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
                                <Grid item xs={12} sx={{ marginTop: 4 }}>
                                    <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 2 }}>Current Winner</Typography>
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
                                                {data.rm3cw && data.rm3cw.map((row) => (
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
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h3" sx={{ textAlign: "center", marginBottom: 2 }}>VIP ROOM</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 2 }}>All User</Typography>
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
                                                {data.rm4 && data.rm4.map((row) => (
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
                                <Grid item xs={12} sx={{ marginTop: 4 }}>
                                    <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 2 }}>Current Winner</Typography>
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
                                                {data.rm4cw && data.rm4cw.map((row) => (
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
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Roundview;
