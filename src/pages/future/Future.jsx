import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { api, ENDPOINTS, API } from '../../api/api';
import { Container, CircularProgress, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Snackbar, Alert } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useLocation } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import styles

const FutureList = () => {
    const [futures, setFutures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedFuture, setSelectedFuture] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [formValues, setFormValues] = useState({
        id: '',
        title: '',
        content: '',
    });
    const [isCreate, setIsCreate] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [selectionModel, setSelectionModel] = useState([]);

    const location = useLocation();

    const fetchFutures = async (searchQuery = '', page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            const response = await api.get(`${ENDPOINTS.FUTURES}?search=${searchQuery}&page=${page}&page_size=${pageSize}`);
            setFutures(response.data.results || []);
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
        fetchFutures(searchQuery, page, pageSize);
    }, [location.search, page, pageSize]);

    useEffect(() => {
        if (selectedFuture) {
            setFormValues({
                id: selectedFuture.id,
                title: selectedFuture.title,
                content: selectedFuture.content,
            });
        }
    }, [selectedFuture]);

    if (loading) {
        return <Container><CircularProgress /></Container>;
    }

    if (error) {
        return <Container>Error: {error.message}</Container>;
    }

    const handleMenuClick = (event, future) => {
        setAnchorEl(event.currentTarget);
        setSelectedFuture(future);
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

    const handleContentChange = (content) => {
        setFormValues({ ...formValues, content });
    };

    const handleUpdateFuture = async () => {
        try {
            await api.put(ENDPOINTS.FUTURE_UPDATE(formValues.id), formValues);
            setOpenModal(false);
            fetchFutures();
            setSnackbar({ open: true, message: 'Future updated successfully', severity: 'success' });
        } catch (error) {
            console.error('Update Future error:', error);
            setSnackbar({ open: true, message: 'Failed to update Future', severity: 'error' });
        }
    };

    const handleDeleteFuture = async (id) => {
        try {
            await api.delete(ENDPOINTS.FUTURE_DELETE(id));
            setOpenModal(false);
            fetchFutures();
            setSnackbar({ open: true, message: 'Future deleted successfully', severity: 'success' });
        } catch (error) {
            console.error('Delete Future error:', error);
            setSnackbar({ open: true, message: 'Failed to delete Future', severity: 'error' });
        }
    };

    const handleCreateFuture = async () => {
        try {
            await api.post(ENDPOINTS.FUTURE_CREATE, formValues);
            setOpenModal(false);
            fetchFutures();
            setSnackbar({ open: true, message: 'Future created successfully', severity: 'success' });
        } catch (error) {
            console.error('Create Future error:', error);
            setSnackbar({ open: true, message: 'Failed to create Future', severity: 'error' });
        }
    };

    const handleOpenCreateModal = () => {
        setFormValues({
            id: '',
            title: '',
            content: '',
        });
        setIsCreate(true);
        setOpenModal(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleBulkDelete = async () => {
        try {
            await Promise.all(selectionModel.map(id => handleDeleteFuture(id)));
            setSnackbar({ open: true, message: 'Selected Futures deleted successfully', severity: 'success' });
            setSelectionModel([]);  // Clear selection model after deletion
        } catch (error) {
            console.error('Bulk delete error:', error);
            setSnackbar({ open: true, message: 'Failed to delete selected Futures', severity: 'error' });
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'title', headerName: 'Title', width: 200 },
        { field: 'content', headerName: 'Content', width: 300 },
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
                        <MenuItem onClick={() => handleDeleteFuture(params.row.id)}>Delete</MenuItem>
                    </Menu>
                </div>
            ),
        },
    ];

    const rows = futures.map((future) => ({
        id: future.id,
        title: future.title,
        content: future.content,
    }));

    return (
        <Container>
            <h2>Future List</h2>
            <Button variant="contained" color="primary" onClick={handleOpenCreateModal}>Create Future</Button>
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
                <DialogTitle>{isCreate ? 'Create Future' : 'Future Details'}</DialogTitle>
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
                            label="Title"
                            fullWidth
                            variant="outlined"
                            name="title"
                            value={formValues.title}
                            onChange={handleInputChange}
                        />
                        <ReactQuill
                            value={formValues.content}
                            onChange={handleContentChange}
                            style={{ height: '500px', width: '700px' }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">Close</Button>
                    {isCreate ? (
                        <Button onClick={handleCreateFuture} color="primary">Create</Button>
                    ) : (
                        <>
                            <Button onClick={handleUpdateFuture} color="primary">Update</Button>
                            <Button onClick={() => handleDeleteFuture(formValues.id)} color="secondary">Delete</Button>
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

export default FutureList;



