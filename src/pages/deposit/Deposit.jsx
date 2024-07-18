import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { api, ENDPOINTS } from '../../api/api';
import { Container, CircularProgress, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Snackbar, Alert, Select, InputLabel, FormControl } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useLocation } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const DepositList = () => {
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedDeposit, setSelectedDeposit] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [formValues, setFormValues] = useState({
        id: '',
        quantity: '',
        customer: '',
        coin_type: '',
        network_type: '',
        status: 0,
        screenshot: null
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

    const fetchDeposits = async (searchQuery = '', page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            const response = await api.get(`${ENDPOINTS.DEPOSITS}?search=${searchQuery}&page=${page}&page_size=${pageSize}`);
            setDeposits(response.data.results || []);
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
            setCustomers(response.data.results || []);
        } catch (error) {
            console.error('Fetch customers error:', error);
        }
    };

    const fetchCoinTypes = async () => {
        try {
            const response = await api.get(ENDPOINTS.COINTYPES);
            setCoinTypes(response.data.results || []);
        } catch (error) {
            console.error('Fetch coin types error:', error);
        }
    };

    const fetchNetworkTypes = async () => {
        try {
            const response = await api.get(ENDPOINTS.NETWORKS);
            setNetworkTypes(response.data.results || []);
        } catch (error) {
            console.error('Fetch network types error:', error);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get('search') || '';
        fetchDeposits(searchQuery, page, pageSize);
        fetchCustomers();
        fetchCoinTypes();
        fetchNetworkTypes();
    }, [location.search, page, pageSize]);

    useEffect(() => {
        if (selectedDeposit) {
            setFormValues({
                id: selectedDeposit.id,
                quantity: selectedDeposit.quantity,
                customer: selectedDeposit.customer.uuid || '',
                coin_type: selectedDeposit.coin_type.id || '',
                network_type: selectedDeposit.network_type.id || '',
                status: selectedDeposit.status,
                screenshot: selectedDeposit.screenshot
            });
        }
    }, [selectedDeposit, customers, coinTypes, networkTypes]);

    if (loading) {
        return <Container><CircularProgress /></Container>;
    }

    if (error) {
        return <Container>Error: {error.message}</Container>;
    }

    const handleMenuClick = (event, deposit) => {
        setAnchorEl(event.currentTarget);
        setSelectedDeposit(deposit);
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

    const handleSelectChange = (event) => {
        const { name, value } = event.target;
        setFormValues((prevFormValues) => ({
            ...prevFormValues,
            [name]: value,
        }));
    };

    const handleUpdateDeposit = async () => {
        try {
            await api.put(ENDPOINTS.DEPOSIT_UPDATE(formValues.id), formValues);
            setOpenModal(false);
            fetchDeposits();
            setSnackbar({ open: true, message: 'Deposit updated successfully', severity: 'success' });
        } catch (error) {
            console.error('Update Deposit error:', error);
            setSnackbar({ open: true, message: 'Failed to update Deposit', severity: 'error' });
        }
    };

    const handleDeleteDeposit = async (id) => {
        try {
            await api.delete(ENDPOINTS.DEPOSIT_DELETE(id));
            setOpenModal(false);
            fetchDeposits();
            setSnackbar({ open: true, message: 'Deposit deleted successfully', severity: 'success' });
        } catch (error) {
            console.error('Delete Deposit error:', error);
            setSnackbar({ open: true, message: 'Failed to delete Deposit', severity: 'error' });
        }
    };

    const handleCreateDeposit = async () => {
        try {
            await api.post(ENDPOINTS.DEPOSIT_CREATE, formValues);
            setOpenModal(false);
            fetchDeposits();
            setSnackbar({ open: true, message: 'Deposit created successfully', severity: 'success' });
        } catch (error) {
            console.error('Create Deposit error:', error);
            setSnackbar({ open: true, message: 'Failed to create Deposit', severity: 'error' });
        }
    };

    const handleOpenCreateModal = () => {
        setFormValues({
            id: '',
            quantity: '',
            customer: '',
            coin_type: '',
            network_type: '',
            status: 0,
            screenshot: null
        });
        setIsCreate(true);
        setOpenModal(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleBulkDelete = async () => {
        try {
            await Promise.all(selectionModel.map(id => handleDeleteDeposit(id)));
            setSnackbar({ open: true, message: 'Selected Deposits deleted successfully', severity: 'success' });
            setSelectionModel([]);  // Clear selection model after deletion
        } catch (error) {
            console.error('Bulk delete error:', error);
            setSnackbar({ open: true, message: 'Failed to delete selected Deposits', severity: 'error' });
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 0:
                return <span style={{ color: 'grey' }}>Pending</span>;
            case 1:
                return <span style={{ color: 'green' }}>Successful</span>;
            case 2:
                return <span style={{ color: 'red' }}>Failed</span>;
            default:
                return '';
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'quantity', headerName: 'Quantity', width: 200 },
        { field: 'customer', headerName: 'Customer', width: 200 },
        { field: 'coin_type', headerName: 'Coin Type', width: 200 },
        { field: 'network_type', headerName: 'Network Type', width: 200 },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => getStatusText(params.value),
        },
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
                        <MenuItem onClick={() => handleDeleteDeposit(params.row.id)}>Delete</MenuItem>
                    </Menu>
                </div>
            ),
        },
    ];

    const rows = deposits.map((deposit) => ({
        id: deposit.id,
        quantity: deposit.quantity,
        customer: customers.find(customer => customer.uuid === deposit.customer)?.name || '',
        coin_type: coinTypes.find(coinType => coinType.id === deposit.coin_type)?.type || '',
        network_type: networkTypes.find(networkType => networkType.id === deposit.network_type)?.type || '',
        status: deposit.status,
        time: deposit.time,
    }));

    return (
        <Container>
            <h2>Deposit List</h2>
            <Button variant="contained" color="primary" onClick={handleOpenCreateModal}>Create Deposit</Button>
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
                <DialogTitle>{isCreate ? 'Create Deposit' : 'Deposit Details'}</DialogTitle>
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
                                value={formValues.customer}
                                onChange={handleSelectChange}
                            >
                                {customers.map((customer) => (
                                    <MenuItem key={customer.uuid} value={customer.uuid}>
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
                                value={formValues.coin_type}
                                onChange={handleSelectChange}
                            >
                                {coinTypes.map((coinType) => (
                                    <MenuItem key={coinType.id} value={coinType.id}>
                                        {coinType.type}
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
                                value={formValues.network_type}
                                onChange={handleSelectChange}
                            >
                                {networkTypes.map((networkType) => (
                                    <MenuItem key={networkType.id} value={networkType.id}>
                                        {networkType.type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="dense" variant="outlined">
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                                labelId="status-label"
                                label="Status"
                                name="status"
                                value={formValues.status}
                                onChange={handleSelectChange}
                            >
                                <MenuItem value={0}>Pending</MenuItem>
                                <MenuItem value={1}>Successful</MenuItem>
                                <MenuItem value={2}>Failed</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">Close</Button>
                    {isCreate ? (
                        <Button onClick={handleCreateDeposit} color="primary">Create</Button>
                    ) : (
                        <>
                            <Button onClick={handleUpdateDeposit} color="primary">Update</Button>
                            <Button onClick={() => handleDeleteDeposit(formValues.id)} color="secondary">Delete</Button>
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

export default DepositList;
