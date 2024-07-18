import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { api, ENDPOINTS } from '../../api/api';
import { Container, CircularProgress, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Snackbar, Alert } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useLocation } from 'react-router-dom';

const DepositHistoryList = () => {
    const [depositHistories, setDepositHistories] = useState([]);
    const [deposits, setDeposits] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedDepositHistory, setSelectedDepositHistory] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [formValues, setFormValues] = useState({
        id: '',
        deposit: '',
        time: ''
    });
    const [isCreate, setIsCreate] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [selectionModel, setSelectionModel] = useState([]);

    const location = useLocation();

    const fetchDepositHistories = async (searchQuery = '', page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            const response = await api.get(`${ENDPOINTS.DEPOSIT_HISTORIES}?search=${searchQuery}&page=${page}&page_size=${pageSize}`);
            const histories = response.data.results || [];
            setDepositHistories(histories);
            setTotalCount(response.data.count || 0);
            const depositIds = histories.map(history => history.deposit);
            const depositDetails = await Promise.all(depositIds.map(id => api.get(ENDPOINTS.DEPOSIT_DETAIL(id))));
            const depositsMap = depositDetails.reduce((acc, depositDetail) => {
                acc[depositDetail.data.id] = depositDetail.data;
                return acc;
            }, {});
            setDeposits(depositsMap);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get('search') || '';
        fetchDepositHistories(searchQuery, page, pageSize);
    }, [location.search, page, pageSize]);

    useEffect(() => {
        if (selectedDepositHistory) {
            setFormValues({
                id: selectedDepositHistory.id,
                deposit: selectedDepositHistory.deposit,
                time: selectedDepositHistory.time,
            });
        }
    }, [selectedDepositHistory]);

    if (loading) {
        return <Container><CircularProgress /></Container>;
    }

    if (error) {
        return <Container>Error: {error.message}</Container>;
    }

    const handleMenuClick = (event, depositHistory) => {
        setAnchorEl(event.currentTarget);
        setSelectedDepositHistory(depositHistory);
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

    const handleUpdateDepositHistory = async () => {
        try {
            await api.put(ENDPOINTS.DEPOSIT_HISTORY_UPDATE(formValues.id), formValues);
            setOpenModal(false);
            fetchDepositHistories();
            setSnackbar({ open: true, message: 'Deposit History updated successfully', severity: 'success' });
        } catch (error) {
            console.error('Update Deposit History error:', error);
            setSnackbar({ open: true, message: 'Failed to update Deposit History', severity: 'error' });
        }
    };

    const handleDeleteDepositHistory = async (id) => {
        try {
            await api.delete(ENDPOINTS.DEPOSIT_HISTORY_DELETE(id));
            setOpenModal(false);
            fetchDepositHistories();
            setSnackbar({ open: true, message: 'Deposit History deleted successfully', severity: 'success' });
        } catch (error) {
            console.error('Delete Deposit History error:', error);
            setSnackbar({ open: true, message: 'Failed to delete Deposit History', severity: 'error' });
        }
    };

    const handleCreateDepositHistory = async () => {
        try {
            await api.post(ENDPOINTS.DEPOSIT_HISTORY_CREATE, formValues);
            setOpenModal(false);
            fetchDepositHistories();
            setSnackbar({ open: true, message: 'Deposit History created successfully', severity: 'success' });
        } catch (error) {
            console.error('Create Deposit History error:', error);
            setSnackbar({ open: true, message: 'Failed to create Deposit History', severity: 'error' });
        }
    };

    const handleOpenCreateModal = () => {
        setFormValues({
            id: '',
            deposit: '',
            time: '',
        });
        setIsCreate(true);
        setOpenModal(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleBulkDelete = async () => {
        try {
            await Promise.all(selectionModel.map(id => handleDeleteDepositHistory(id)));
            setSnackbar({ open: true, message: 'Selected Deposit Histories deleted successfully', severity: 'success' });
            setSelectionModel([]);  // Clear selection model after deletion
        } catch (error) {
            console.error('Bulk delete error:', error);
            setSnackbar({ open: true, message: 'Failed to delete selected Deposit Histories', severity: 'error' });
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { 
            field: 'deposit', 
            headerName: 'Deposit', 
            width: 200,
            valueGetter: (params) => deposits[params.value]?.name || 'Unknown',
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
                        <MenuItem onClick={() => handleDeleteDepositHistory(params.row.id)}>Delete</MenuItem>
                    </Menu>
                </div>
            ),
        },
    ];

    const rows = depositHistories.map((depositHistory) => ({
        id: depositHistory.id,
        deposit: depositHistory.deposit,
        time: depositHistory.time,
    }));

    return (
        <Container>
            <h2>Deposit History List</h2>
            <Button variant="contained" color="primary" onClick={handleOpenCreateModal}>Create Deposit History</Button>
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
                <DialogTitle>{isCreate ? 'Create Deposit History' : 'Deposit History Details'}</DialogTitle>
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
                            label="Deposit ID"
                            fullWidth
                            variant="outlined"
                            name="deposit"
                            value={formValues.deposit}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            label="Time"
                            fullWidth
                            variant="outlined"
                            name="time"
                            value={formValues.time}
                            onChange={handleInputChange}
                            disabled
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">Close</Button>
                    {isCreate ? (
                        <Button onClick={handleCreateDepositHistory} color="primary">Create</Button>
                    ) : (
                        <>
                            <Button onClick={handleUpdateDepositHistory} color="primary">Update</Button>
                            <Button onClick={() => handleDeleteDepositHistory(formValues.id)} color="secondary">Delete</Button>
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

export default DepositHistoryList;
