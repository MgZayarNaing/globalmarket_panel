import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { api, ENDPOINTS } from '../../api/api';
import { Container, CircularProgress, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Snackbar, Alert, Select, InputLabel, FormControl } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useLocation } from 'react-router-dom';

const CoinList = () => {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCoin, setSelectedCoin] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [formValues, setFormValues] = useState({
        id: '',
        quantity: '',
        customer: '',
        coin_type: '',
        network_type: '',
    });
    const [customers, setCustomers] = useState([]);
    const [coinTypes, setCoinTypes] = useState([]);
    const [networkTypes, setNetworkTypes] = useState([]);
    const [isCreate, setIsCreate] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [selectionModel, setSelectionModel] = useState([]);

    const location = useLocation();

    const fetchCoins = async (searchQuery = '', page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            const response = await api.get(`${ENDPOINTS.COINS}?search=${searchQuery}&page=${page}&page_size=${pageSize}`);
            setCoins(response.data.results || []);
            setTotalCount(response.data.count || 0);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await api.get(ENDPOINTS.USERS);
            console.log('Fetched Customers:', response.data.results);
            setCustomers(response.data.results || []);
        } catch (error) {
            console.error('Fetch customers error:', error);
        }
    };

    const fetchCoinTypes = async () => {
        try {
            const response = await api.get(ENDPOINTS.COINTYPES);
            console.log('Fetched Coin Types:', response.data.results);
            setCoinTypes(response.data.results || []);
        } catch (error) {
            console.error('Fetch coin types error:', error);
        }
    };

    const fetchNetworkTypes = async () => {
        try {
            const response = await api.get(ENDPOINTS.NETWORKS);
            console.log('Fetched Network Types:', response.data.results);
            setNetworkTypes(response.data.results || []);
        } catch (error) {
            console.error('Fetch network types error:', error);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get('search') || '';
        fetchCoins(searchQuery, page, pageSize);
        fetchCustomers();
        fetchCoinTypes();
        fetchNetworkTypes();
    }, [location.search, page, pageSize]);

    useEffect(() => {
        if (selectedCoin) {
            setFormValues({
                id: selectedCoin.id,
                quantity: selectedCoin.quantity,
                customer: selectedCoin.customer || '',
                coin_type: selectedCoin.coin_type || '',
                network_type: selectedCoin.network_type || '',
            });
        }
    }, [selectedCoin]);

    if (loading) {
        return <Container><CircularProgress /></Container>;
    }

    if (error) {
        return <Container>Error: {error.message}</Container>;
    }

    const handleMenuClick = (event, coin) => {
        setAnchorEl(event.currentTarget);
        setSelectedCoin(coin);
        setIsCreate(false);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDetailClick = () => {
        setOpenModal(true);
        handleMenuClose();
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setIsCreate(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleUpdateCoin = async () => {
        try {
            await api.put(ENDPOINTS.COIN_UPDATE(formValues.id), formValues);
            setOpenModal(false);
            fetchCoins();
            setSnackbar({ open: true, message: 'Coin updated successfully', severity: 'success' });
        } catch (error) {
            console.error('Update Coin error:', error);
            setSnackbar({ open: true, message: 'Failed to update Coin', severity: 'error' });
        }
    };

    const handleDeleteCoin = async (id) => {
        try {
            await api.delete(ENDPOINTS.COIN_DELETE(id));
            setOpenModal(false);
            fetchCoins();
            setSnackbar({ open: true, message: 'Coin deleted successfully', severity: 'success' });
        } catch (error) {
            console.error('Delete Coin error:', error);
            setSnackbar({ open: true, message: 'Failed to delete Coin', severity: 'error' });
        }
    };

    const handleCreateCoin = async () => {
        try {
            await api.post(ENDPOINTS.COIN_CREATE, formValues);
            setOpenModal(false);
            fetchCoins();
            setSnackbar({ open: true, message: 'Coin created successfully', severity: 'success' });
        } catch (error) {
            console.error('Create Coin error:', error);
            setSnackbar({ open: true, message: 'Failed to create Coin', severity: 'error' });
        }
    };

    const handleOpenCreateModal = () => {
        setFormValues({
            id: '',
            quantity: '',
            customer: '',
            coin_type: '',
            network_type: '',
        });
        setIsCreate(true);
        setOpenModal(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleBulkDelete = async () => {
        try {
            await Promise.all(selectionModel.map(id => handleDeleteCoin(id)));
            setSnackbar({ open: true, message: 'Selected Coins deleted successfully', severity: 'success' });
            setSelectionModel([]);  // Clear selection model after deletion
        } catch (error) {
            console.error('Bulk delete error:', error);
            setSnackbar({ open: true, message: 'Failed to delete selected Coins', severity: 'error' });
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'quantity', headerName: 'Quantity', width: 200 },
        { field: 'customer', headerName: 'Customer', width: 200 },
        { field: 'coin_type', headerName: 'Coin Type', width: 200 },
        { field: 'network_type', headerName: 'Network Type', width: 200 },
        { field: 'time', headerName: 'Time', width: 200 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            renderCell: (params) => (
                <div>
                    <IconButton onClick={(event) => handleMenuClick(event, params.row)}>
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleDetailClick}>Detail</MenuItem>
                        <MenuItem onClick={() => handleDeleteCoin(params.row.id)}>Delete</MenuItem>
                    </Menu>
                </div>
            ),
        },
    ];

    const rows = coins.map((coin) => ({
        id: coin.id,
        quantity: coin.quantity,
        customer: coin.customer,
        coin_type: coin.coin_type,
        network_type: coin.network_type,
        time: coin.time,
    }));

    return (
        <Container>
            <h2>Coin List</h2>
            <Button variant="contained" color="primary" onClick={handleOpenCreateModal}>Create Coin</Button>
            <Button variant="contained" color="secondary" onClick={handleBulkDelete} style={{ marginLeft: 16 }} disabled={selectionModel.length === 0}>Delete Selected</Button>

            <div style={{ height: 600, width: '100%', marginTop: 16 }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={pageSize}
                    rowsPerPageOptions={[5, 10, 20, 25, 50, 100]}
                    rowCount={totalCount}
                    pagination
                    paginationMode="server"
                    checkboxSelection
                    onSelectionModelChange={(newSelectionModel) => setSelectionModel(newSelectionModel)}
                    onPageChange={(params) => setPage(params.page + 1)}
                    onPageSizeChange={(params) => setPageSize(params.pageSize)}
                />
            </div>

            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>{isCreate ? 'Create Coin' : 'Coin Details'}</DialogTitle>
                <DialogContent>
                    <Box component="form" noValidate autoComplete="off">
                        {!isCreate && (
                            <TextField
                                margin="dense"
                                label="ID"
                                fullWidth
                                variant="outlined"
                                value={formValues.id}
                                disabled
                            />
                        )}
                        <TextField
                            margin="dense"
                            label="Quantity"
                            fullWidth
                            variant="outlined"
                            name="quantity"
                            value={formValues.quantity}
                            onChange={handleInputChange}
                        />
                        <FormControl fullWidth margin="dense" variant="outlined">
                            <InputLabel id="customer-label">Customer</InputLabel>
                            <Select
                                labelId="customer-label"
                                label="Customer"
                                name="customer"
                                value={formValues.customer || ''}
                                onChange={handleInputChange}
                            >
                                {customers.map((customer) => (
                                    <MenuItem key={customer.id} value={customer.id}>
                                        {customer.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="dense" variant="outlined">
                            <InputLabel id="coin-type-label">Coin Type</InputLabel>
                            <Select
                                labelId="coin-type-label"
                                label="Coin Type"
                                name="coin_type"
                                value={formValues.coin_type || ''}
                                onChange={handleInputChange}
                            >
                                {coinTypes.map((coinType) => (
                                    <MenuItem key={coinType.id} value={coinType.id}>
                                        {coinType.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="dense" variant="outlined">
                            <InputLabel id="network-type-label">Network Type</InputLabel>
                            <Select
                                labelId="network-type-label"
                                label="Network Type"
                                name="network_type"
                                value={formValues.network_type || ''}
                                onChange={handleInputChange}
                            >
                                {networkTypes.map((networkType) => (
                                    <MenuItem key={networkType.id} value={networkType.id}>
                                        {networkType.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">Close</Button>
                    {isCreate ? (
                        <Button onClick={handleCreateCoin} color="primary">Create</Button>
                    ) : (
                        <>
                            <Button onClick={handleUpdateCoin} color="primary">Update</Button>
                            <Button onClick={() => handleDeleteCoin(formValues.id)} color="secondary">Delete</Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default CoinList;
