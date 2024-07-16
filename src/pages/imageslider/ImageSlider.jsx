import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { api, ENDPOINTS } from '../../api/api';
import { Container, CircularProgress, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Snackbar, Alert } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useLocation } from 'react-router-dom';

const ImageSliderList = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSlider, setSelectedSlider] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [formValues, setFormValues] = useState({
    id: '',
    name: '',
    image: null,
    imagePreview: '',
  });
  const [isCreate, setIsCreate] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectionModel, setSelectionModel] = useState([]);

  const location = useLocation();

  const fetchSliders = async (searchQuery = '', page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await api.get(`${ENDPOINTS.IMAGE_SLIDER}?search=${searchQuery}&page=${page}&page_size=${pageSize}`);
      setSliders(response.data.results || []);
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
    fetchSliders(searchQuery, page, pageSize);
  }, [location.search, page, pageSize]);

  useEffect(() => {
    if (selectedSlider) {
      setFormValues({
        id: selectedSlider.id,
        name: selectedSlider.name,
        image: selectedSlider.image,
        imagePreview: selectedSlider.image,
      });
    }
  }, [selectedSlider]);

  if (loading) {
    return <Container><CircularProgress /></Container>;
  }

  if (error) {
    return <Container>Error: {error.message}</Container>;
  }

  const handleMenuClick = (event, slider) => {
    setAnchorEl(event.currentTarget);
    setSelectedSlider(slider);
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
    const { name, value, type, files } = event.target;
    if (type === 'file') {
      setFormValues({ ...formValues, [name]: files[0], imagePreview: URL.createObjectURL(files[0]) });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleUpdateSlider = async () => {
    try {
      const formData = new FormData();
      formData.append('name', formValues.name);
      if (formValues.image) {
        formData.append('image', formValues.image);
      }

      await api.put(ENDPOINTS.IMAGE_SLIDER_UPDATE(formValues.id), formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setOpenModal(false);
      fetchSliders();
      setSnackbar({ open: true, message: 'ImageSlider updated successfully', severity: 'success' });
    } catch (error) {
      console.error('Update ImageSlider error:', error);
      setSnackbar({ open: true, message: 'Failed to update ImageSlider', severity: 'error' });
    }
  };

  const handleDeleteSlider = async (id) => {
    try {
      await api.delete(ENDPOINTS.IMAGE_SLIDER_DELETE(id));
      setOpenModal(false);
      fetchSliders();
      setSnackbar({ open: true, message: 'ImageSlider deleted successfully', severity: 'success' });
    } catch (error) {
      console.error('Delete ImageSlider error:', error);
      setSnackbar({ open: true, message: 'Failed to delete ImageSlider', severity: 'error' });
    }
  };

  const handleCreateSlider = async () => {
    try {
      const formData = new FormData();
      formData.append('name', formValues.name);
      if (formValues.image) {
        formData.append('image', formValues.image);
      }

      await api.post(ENDPOINTS.IMAGE_SLIDER_CREATE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setOpenModal(false);
      fetchSliders();
      setSnackbar({ open: true, message: 'ImageSlider created successfully', severity: 'success' });
    } catch (error) {
      console.error('Create ImageSlider error:', error);
      setSnackbar({ open: true, message: 'Failed to create ImageSlider', severity: 'error' });
    }
  };

  const handleOpenCreateModal = () => {
    setFormValues({
      id: '',
      name: '',
      image: null,
      imagePreview: '',
    });
    setIsCreate(true);
    setOpenModal(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectionModel.map(id => handleDeleteSlider(id)));
      setSnackbar({ open: true, message: 'Selected ImageSliders deleted successfully', severity: 'success' });
      setSelectionModel([]);  // Clear selection model after deletion
    } catch (error) {
      console.error('Bulk delete error:', error);
      setSnackbar({ open: true, message: 'Failed to delete selected ImageSliders', severity: 'error' });
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    {
      field: 'image',
      headerName: 'Image',
      width: 150,
      renderCell: (params) => (
        <img src={params.value} alt={params.row.name} style={{ width: '100%' }} />
      ),
    },
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
            <MenuItem onClick={() => handleDeleteSlider(params.row.id)}>Delete</MenuItem>
          </Menu>
        </div>
      ),
    },
  ];

  const rows = sliders.map((slider) => ({
    id: slider.id,
    name: slider.name,
    image: slider.image,
  }));

  return (
    <Container>
      <h2>Image Slider List</h2>
      <Button variant="contained" color="primary" onClick={handleOpenCreateModal}>Create Image Slider</Button>
      <Button variant="contained" color="secondary" onClick={handleBulkDelete} disabled={selectionModel.length === 0} style={{ marginLeft: 16 }}>Delete Selected</Button>
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
        <DialogTitle>{isCreate ? 'Create Image Slider' : 'Image Slider Details'}</DialogTitle>
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
              label="Name"
              fullWidth
              variant="outlined"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
            />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload"
              type="file"
              name="image"
              onChange={handleInputChange}
            />
            <label htmlFor="image-upload">
              <Button variant="contained" color="primary" component="span">
                Upload Image
              </Button>
            </label>
            {formValues.imagePreview && (
              <img src={formValues.imagePreview} alt="Preview" style={{ width: '100%', marginTop: '10px' }} />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">Close</Button>
          {isCreate ? (
            <Button onClick={handleCreateSlider} color="primary">Create</Button>
          ) : (
            <>
              <Button onClick={handleUpdateSlider} color="primary">Update</Button>
              <Button onClick={() => handleDeleteSlider(formValues.id)} color="secondary">Delete</Button>
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

export default ImageSliderList;
