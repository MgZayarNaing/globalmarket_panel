import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { api, ENDPOINTS } from '../../api/api';
import { Container, CircularProgress, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Snackbar, Alert, Select, InputLabel, FormControl } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useLocation } from 'react-router-dom';

const WithdrawList = () => {
    const [withdraws, setWithdraws] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedWithdraw, setSelectedWithdraw] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [formValues, setFormValues] = useState({
        id: '',
        quantity: '',
        customer: '',
        coin_type: '',
        network_type: '',
        user_link_address: '',
        status: 0,
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
    const [dataLoaded, setDataLoaded] = useState(false);

    const location = useLocation();

    const fetchWithdraws = async (searchQuery = '', page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            const response = await api.get(`${ENDPOINTS.WITHDRAWS}?search=${searchQuery}&page=${page}&page_size=${pageSize}`);
            const withdrawsData = response.data.results || [];

            const enrichedWithdraws = await Promise.all(
                withdrawsData.map(async (withdraw) => {
                    const customerResponse = await api.get(ENDPOINTS.USER_DETAIL(withdraw.customer));
                    const coinTypeResponse = await api.get(ENDPOINTS.COINTYPE_DETAIL(withdraw.coin_type));
                    const networkTypeResponse = await api.get(ENDPOINTS.NETWORK_DETAIL(withdraw.network_type));
                    return {
                        ...withdraw,
                        customer_name: customerResponse.data.uuid,
                        coin_type_name: coinTypeResponse.data.id,
                        network_type_name: networkTypeResponse.data.id,
                    };
                })
            );

            setWithdraws(enrichedWithdraws);
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
        fetchWithdraws(searchQuery, page, pageSize);
        fetchCustomers();
        fetchCoinTypes();
        fetchNetworkTypes().then(() => setDataLoaded(true));
    }, [location.search, page, pageSize]);

    useEffect(() => {
        if (selectedWithdraw) {
            setFormValues({
                id: selectedWithdraw.id,
                quantity: selectedWithdraw.quantity,
                customer: selectedWithdraw.customer_name,
                coin_type: selectedWithdraw.coin_type_name,
                network_type: selectedWithdraw.network_type_name,
                user_link_address: selectedWithdraw.user_link_address || '',
                status: selectedWithdraw.status,
            });
        }
    }, [selectedWithdraw, coinTypes, networkTypes]);

    if (loading) {
        return <Container><CircularProgress /></Container>;
    }

    if (error) {
        return <Container>Error: {error.message}</Container>;
    }

    const handleMenuClick = (event, withdraw) => {
        setAnchorEl(event.currentTarget);
        setSelectedWithdraw(withdraw);
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

    const handleUpdateWithdraw = async () => {
        try {
            await api.put(ENDPOINTS.WITHDRAW_UPDATE(formValues.id), formValues);
            setOpenModal(false);
            fetchWithdraws();
            setSnackbar({ open: true, message: 'Withdraw updated successfully', severity: 'success' });
        } catch (error) {
            console.error('Update Withdraw error:', error);
            setSnackbar({ open: true, message: 'Failed to update Withdraw', severity: 'error' });
        }
    };

    const handleDeleteWithdraw = async (id) => {
        try {
            await api.delete(ENDPOINTS.WITHDRAW_DELETE(id));
            setOpenModal(false);
            fetchWithdraws();
            setSnackbar({ open: true, message: 'Withdraw deleted successfully', severity: 'success' });
        } catch (error) {
            console.error('Delete Withdraw error:', error);
            setSnackbar({ open: true, message: 'Failed to delete Withdraw', severity: 'error' });
        }
    };

    const handleCreateWithdraw = async () => {
        try {
            await api.post(ENDPOINTS.WITHDRAW_CREATE, formValues);
            setOpenModal(false);
            fetchWithdraws();
            setSnackbar({ open: true, message: 'Withdraw created successfully', severity: 'success' });
        } catch (error) {
            console.error('Create Withdraw error:', error);
            setSnackbar({ open: true, message: 'Failed to create Withdraw', severity: 'error' });
        }
    };

    const handleOpenCreateModal = () => {
        setFormValues({
            id: '',
            quantity: '',
            customer: '',
            coin_type: '',
            network_type: '',
            user_link_address: '',
            status: 0,
        });
        setIsCreate(true);
        setOpenModal(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleBulkDelete = async () => {
        try {
            await Promise.all(selectionModel.map(id => handleDeleteWithdraw(id)));
            setSnackbar({ open: true, message: 'Selected Withdraws deleted successfully', severity: 'success' });
            setSelectionModel([]);  // Clear selection model after deletion
        } catch (error) {
            console.error('Bulk delete error:', error);
            setSnackbar({ open: true, message: 'Failed to delete selected Withdraws', severity: 'error' });
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
        { field: 'customer_name', headerName: 'Customer', width: 200 },
        { field: 'coin_type_name', headerName: 'Coin Type', width: 200 },
        { field: 'network_type_name', headerName: 'Network Type', width: 200 },
        { field: 'user_link_address', headerName: 'User Link Address', width: 200 },
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
                        <MenuItem onClick={() => handleDeleteWithdraw(params.row.id)}>Delete</MenuItem>
                    </Menu>
                </div>
            ),
        },
    ];

    const rows = withdraws.map((withdraw) => ({
        id: withdraw.id,
        quantity: withdraw.quantity,
        customer_name: withdraw.customer_name,
        coin_type_name: withdraw.coin_type_name,
        network_type_name: withdraw.network_type_name,
        user_link_address: withdraw.user_link_address,
        status: withdraw.status,
        time: withdraw.time,
    }));

    return (
        <Container>
            <h2>Withdraw List</h2>
            <Button variant="contained" color="primary" onClick={handleOpenCreateModal}>Create Withdraw</Button>
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
                <DialogTitle>{isCreate ? 'Create Withdraw' : 'Withdraw Details'}</DialogTitle>
                {dataLoaded ? (
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
                                    value={formValues.coin_type || ''}
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
                                    value={formValues.network_type || ''}
                                    onChange={handleSelectChange}
                                >
                                    {networkTypes.map((networkType) => (
                                        <MenuItem key={networkType.id} value={networkType.id}>
                                            {networkType.type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                margin="dense"
                                label="User Link Address"
                                fullWidth
                                variant="outlined"
                                name="user_link_address"
                                value={formValues.user_link_address}
                                onChange={handleInputChange}
                            />
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
                ) : (
                    <DialogContent>
                        <CircularProgress />
                    </DialogContent>
                )}
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">Close</Button>
                    {isCreate ? (
                        <Button onClick={handleCreateWithdraw} color="primary">Create</Button>
                    ) : (
                        <>
                            <Button onClick={handleUpdateWithdraw} color="primary">Update</Button>
                            <Button onClick={() => handleDeleteWithdraw(formValues.id)} color="secondary">Delete</Button>
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

export default WithdrawList;
