import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { DataGrid } from '@mui/x-data-grid';
import { api, ENDPOINTS,API } from '../../api/api';
import { Container, CircularProgress, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Snackbar, Alert } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useLocation } from 'react-router-dom';

const NetworkList = () => {
    const [networks, setNetworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedNetwork, setSelectedNetwork] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [formValues, setFormValues] = useState({
        id: '',
        type: '',
        qrcode: null,
        link_name: '',
        link_address: '',
    });
    const [qrcodePreview, setQrcodePreview] = useState(null);
    const [isCreate, setIsCreate] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [selectionModel, setSelectionModel] = useState([]);

    const location = useLocation();

    const fetchNetworks = async (searchQuery = '', page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            const response = await api.get(`${ENDPOINTS.NETWORKS}?search=${searchQuery}&page=${page}&page_size=${pageSize}`);
            setNetworks(response.data || []);
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
        fetchNetworks(searchQuery, page, pageSize);
    }, [location.search, page, pageSize]);

    useEffect(() => {
        if (selectedNetwork) {
            setFormValues({
                id: selectedNetwork.id,
                type: selectedNetwork.type,
                qrcode: selectedNetwork.qrcode,
                link_name: selectedNetwork.link_name,
                link_address: selectedNetwork.link_address,
            });
            setQrcodePreview(selectedNetwork.qrcode);
        }
    }, [selectedNetwork]);

    const handleMenuClick = (event, network) => {
        setAnchorEl(event.currentTarget);
        setSelectedNetwork(network);
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
        setQrcodePreview(null);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleFileChange = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setFormValues({ ...formValues, qrcode: file });
        setQrcodePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('type', formValues.type);
        formData.append('qrcode', formValues.qrcode);
        formData.append('link_name', formValues.link_name);
        formData.append('link_address', formValues.link_address);

        try {
            if (isCreate) {
                await api.post(ENDPOINTS.NETWORK_CREATE, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setSnackbar({ open: true, message: 'Network created successfully', severity: 'success' });
            } else {
                await api.put(ENDPOINTS.NETWORK_UPDATE(formValues.id), formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setSnackbar({ open: true, message: 'Network updated successfully', severity: 'success' });
            }
            setOpenModal(false);
            fetchNetworks();
        } catch (error) {
            console.error(`${isCreate ? 'Create' : 'Update'} Network error:`, error);
            setSnackbar({ open: true, message: `Failed to ${isCreate ? 'create' : 'update'} Network`, severity: 'error' });
        }
    };

    const handleDeleteNetwork = async (id) => {
        try {
            await api.delete(ENDPOINTS.NETWORK_DELETE(id));
            fetchNetworks();
            setSnackbar({ open: true, message: 'Network deleted successfully', severity: 'success' });
        } catch (error) {
            console.error('Delete Network error:', error);
            setSnackbar({ open: true, message: 'Failed to delete Network', severity: 'error' });
        }
    };

    const handleOpenCreateModal = () => {
        setFormValues({
            id: '',
            type: '',
            qrcode: null,
            link_name: '',
            link_address: '',
        });
        setIsCreate(true);
        setOpenModal(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleBulkDelete = async () => {
        try {
            await Promise.all(selectionModel.map(id => handleDeleteNetwork(id)));
            setSnackbar({ open: true, message: 'Selected Networks deleted successfully', severity: 'success' });
            setSelectionModel([]);  // Clear selection model after deletion
        } catch (error) {
            console.error('Bulk delete error:', error);
            setSnackbar({ open: true, message: 'Failed to delete selected Networks', severity: 'error' });
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'type', headerName: 'Type', width: 200 },
        { field: 'qrcode', headerName: 'QR Code', width: 200 },
        { field: 'link_name', headerName: 'Link Name', width: 200 },
        { field: 'link_address', headerName: 'Link Address', width: 300 },
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
                        <MenuItem onClick={() => handleDeleteNetwork(params.row.id)}>Delete</MenuItem>
                    </Menu>
                </div>
            ),
        },
    ];

    const rows = networks.map((network) => ({
        id: network.id,
        type: network.type,
        qrcode: `${API}${network.qrcode}`,
        link_name: network.link_name,
        link_address: network.link_address,
        created_at: network.created_at,
    }));

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleFileChange,
        accept: 'image/*',
    });

    return (
        <Container>
            <h2>Network List</h2>
            <Button variant="contained" color="primary" onClick={handleOpenCreateModal}>Create Network</Button>
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
                <DialogTitle>{isCreate ? 'Create Network' : 'Network Details'}</DialogTitle>
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
                        <div {...getRootProps()} style={{ border: '1px dashed #ccc', padding: '20px', marginTop: '10px' }}>
                            <input {...getInputProps()} />
                            {qrcodePreview ? (
                                <img src={qrcodePreview} alt="QR Code Preview" style={{ width: '100%', maxHeight: '200px' }} />
                            ) : (
                                <p>Drag 'n' drop a QR Code image here, or click to select a file</p>
                            )}
                        </div>
                        <TextField
                            margin="dense"
                            label="Link Name"
                            fullWidth
                            variant="outlined"
                            name="link_name"
                            value={formValues.link_name}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            label="Link Address"
                            fullWidth
                            variant="outlined"
                            name="link_address"
                            value={formValues.link_address}
                            onChange={handleInputChange}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">Close</Button>
                    <Button onClick={handleSubmit} color="primary">{isCreate ? 'Create' : 'Update'}</Button>
                    {!isCreate && <Button onClick={() => handleDeleteNetwork(formValues.id)} color="secondary">Delete</Button>}
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

export default NetworkList;
