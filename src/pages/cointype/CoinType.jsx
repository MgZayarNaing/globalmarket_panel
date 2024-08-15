import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { api, ENDPOINTS } from '../../api/api';
import { Container, CircularProgress, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Snackbar, Alert } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useLocation } from 'react-router-dom';

const CoinTypeList = () => {
    const [cointypes, setCointypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCoinType, setSelectedCoinType] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [formValues, setFormValues] = useState({
        id: '',
        type: '',
    });
    const [isCreate, setIsCreate] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [selectionModel, setSelectionModel] = useState([]);

    const location = useLocation();

    const fetchCoinTypes = async (searchQuery = '', page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            const response = await api.get(`${ENDPOINTS.COINTYPES}?search=${searchQuery}&page=${page}&page_size=${pageSize}`);
            setCointypes(response.data || []);
            setTotalCount(response.data.count || 0);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get('search') || '';
        fetchCoinTypes(searchQuery, page, pageSize);
    }, [location.search, page, pageSize]);

    useEffect(() => {
        if (selectedCoinType) {
            setFormValues({
                id: selectedCoinType.id,
                type: selectedCoinType.type,
            });
        }
    }, [selectedCoinType]);

    if (loading) {
        return <Container><CircularProgress /></Container>;
    }

    if (error) {
        return <Container>Error: {error.message}</Container>;
    }

    const handleMenuClick = (event, cointype) => {
        setAnchorEl(event.currentTarget);
        setSelectedCoinType(cointype);
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

    const handleUpdateCoinType = async () => {
        try {
            await api.put(ENDPOINTS.COINTYPE_UPDATE(formValues.id), formValues);
            setOpenModal(false);
            fetchCoinTypes();
            setSnackbar({ open: true, message: 'CoinType updated successfully', severity: 'success' });
        } catch (error) {
            console.error('Update CoinType error:', error);
            setSnackbar({ open: true, message: 'Failed to update CoinType', severity: 'error' });
        }
    };

    const handleDeleteCoinType = async (id) => {
        try {
            await api.delete(ENDPOINTS.COINTYPE_DELETE(id));
            setOpenModal(false);
            fetchCoinTypes();
            setSnackbar({ open: true, message: 'CoinType deleted successfully', severity: 'success' });
        } catch (error) {
            console.error('Delete CoinType error:', error);
            setSnackbar({ open: true, message: 'Failed to delete CoinType', severity: 'error' });
        }
    };

    const handleCreateCoinType = async () => {
        try {
            await api.post(ENDPOINTS.COINTYPE_CREATE, formValues);
            setOpenModal(false);
            fetchCoinTypes();
            setSnackbar({ open: true, message: 'CoinType created successfully', severity: 'success' });
        } catch (error) {
            console.error('Create CoinType error:', error);
            setSnackbar({ open: true, message: 'Failed to create CoinType', severity: 'error' });
        }
    };

    const handleOpenCreateModal = () => {
        setFormValues({
            id: '',
            type: '',
        });
        setIsCreate(true);
        setOpenModal(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleBulkDelete = async () => {
        try {
            await Promise.all(selectionModel.map(id => handleDeleteCoinType(id)));
            setSnackbar({ open: true, message: 'Selected CoinTypes deleted successfully', severity: 'success' });
            setSelectionModel([]);  // Clear selection model after deletion
        } catch (error) {
            console.error('Bulk delete error:', error);
            setSnackbar({ open: true, message: 'Failed to delete selected CoinTypes', severity: 'error' });
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'type', headerName: 'Type', width: 200 },
        { field: 'created_at', headerName: 'Created At', width: 300 },
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
                        <MenuItem onClick={() => handleDeleteCoinType(params.row.id)}>Delete</MenuItem>
                    </Menu>
                </div>
            ),
        },
    ];

    const rows = cointypes.map((cointype,index) => ({
        id: index+1,
        type: cointype.type,
        created_at: cointype.created_at,
    }));

    return (
        <Container>
            <h2>CoinType List</h2>
            <Button variant="contained" color="primary" onClick={handleOpenCreateModal}>Create CoinType</Button>
            <div style={{ height: 600, width: '100%', marginTop: 16 }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 20]}
                />
            </div>

            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>{isCreate ? 'Create CoinType' : 'CoinType Details'}</DialogTitle>
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
                            label="Type"
                            fullWidth
                            variant="outlined"
                            name="type"
                            value={formValues.type}
                            onChange={handleInputChange}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">Close</Button>
                    {isCreate ? (
                        <Button onClick={handleCreateCoinType} color="primary">Create</Button>
                    ) : (
                        <>
                            <Button onClick={handleUpdateCoinType} color="primary">Update</Button>
                            <Button onClick={() => handleDeleteCoinType(formValues.id)} color="secondary">Delete</Button>
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

export default CoinTypeList;
