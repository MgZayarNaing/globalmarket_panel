import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { api, ENDPOINTS, updateUser, deleteUser, createUser } from '../../api/api';
import { Container, CircularProgress, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, Snackbar, Alert, FormControlLabel, Checkbox, InputAdornment } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [formValues, setFormValues] = useState({
    uuid: '',
    usercode: '',
    username: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirm_password: '',
    created_at: '',
    is_active: false,
    is_admin: false,
    is_approved: false,
  });
  const [isCreate, setIsCreate] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search');

    const fetchUsers = async () => {
      try {
        const response = await api.get(`${ENDPOINTS.USERS}?search=${searchQuery}`);
        setUsers(response.data.results || []);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [location.search]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get(ENDPOINTS.USERS);
        setUsers(response.data.results);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchUsers();


  }, []);

  useEffect(() => {
    if (selectedUser) {
      setFormValues({
        uuid: selectedUser.uuid,
        usercode: selectedUser.usercode,
        username: selectedUser.username,
        name: selectedUser.name,
        email: selectedUser.email,
        phone: selectedUser.phone,
        address: selectedUser.address,
        password: '',
        confirm_password: '',
        created_at: selectedUser.created_at,
        is_active: selectedUser.is_active,
        is_admin: selectedUser.is_admin,
        is_approved: selectedUser.is_approved,
      });
    }
  }, [selectedUser]);

  if (loading) {
    return <Container><CircularProgress /></Container>;
  }

  if (error) {
    return <Container>Error: {error.message}</Container>;
  }

  const handleMenuClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
    setIsCreate(false);
    console.log('User selected:', user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDetailClick = () => {
    console.log('Opening modal for user:', selectedUser);
    setOpenModal(true);
    handleMenuClose();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsCreate(false);
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormValues({ ...formValues, [name]: type === 'checkbox' ? checked : value });
  };

  const handleUpdateUser = async () => {
    try {
      await updateUser(formValues.uuid, {
        usercode: formValues.usercode,
        username: formValues.username,
        name: formValues.name,
        email: formValues.email,
        phone: formValues.phone,
        address: formValues.address,
        is_active: formValues.is_active,
        is_admin: formValues.is_admin,
        is_approved: formValues.is_approved,
      });
      setOpenModal(false);
      // Fetch updated users list
      const response = await api.get(ENDPOINTS.USERS);
      setUsers(response.data.results);
      setSnackbar({ open: true, message: 'User updated successfully', severity: 'success' });
    } catch (error) {
      console.error('Update user error:', error);
      setSnackbar({ open: true, message: 'Failed to update user', severity: 'error' });
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(formValues.uuid);
      setOpenModal(false);
      // Fetch updated users list
      const response = await api.get(ENDPOINTS.USERS);
      setUsers(response.data.results);
      setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
    } catch (error) {
      console.error('Delete user error:', error);
      setSnackbar({ open: true, message: 'Failed to delete user', severity: 'error' });
    }
  };

  const handleCreateUser = async () => {
    try {
      await createUser({
        username: formValues.username,
        name: formValues.name,
        email: formValues.email,
        phone: formValues.phone,
        address: formValues.address,
        password: formValues.password,
        confirm_password: formValues.confirm_password,
        is_active: formValues.is_active,
        is_admin: formValues.is_admin,
        is_approved: formValues.is_approved,
      });
      setOpenModal(false);
      // Fetch updated users list
      const response = await api.get(ENDPOINTS.USERS);
      setUsers(response.data.results);
      setSnackbar({ open: true, message: 'User created successfully', severity: 'success' });
    } catch (error) {
      console.error('Create user error:', error);
      setSnackbar({ open: true, message: 'Failed to create user', severity: 'error' });
    }
  };

  const handleOpenCreateModal = () => {
    setFormValues({
      uuid: '',
      usercode: '',
      username: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      confirm_password: '',
      created_at: '',
      is_active: false,
      is_admin: false,
      is_approved: false,
    });
    setIsCreate(true);
    setOpenModal(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const columns = [
    { field: 'uuid', headerName: 'UUID', width: 250 },
    { field: 'usercode', headerName: 'User Code', width: 150 },
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'address', headerName: 'Address', width: 200 },
    { field: 'created_at', headerName: 'Created At', width: 200 },
    { field: 'is_active', headerName: 'Active', width: 100, type: 'boolean' },
    { field: 'is_admin', headerName: 'Admin', width: 100, type: 'boolean' },
    { field: 'is_approved', headerName: 'Approved', width: 100, type: 'boolean' },
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
            <MenuItem onClick={handleDeleteUser}>Delete</MenuItem>
          </Menu>
        </div>
      ),
    },
  ];

  const rows = users.map((user, index) => ({
    id: index,
    ...user
  }));

  return (
    <Container>
      <h2>User List</h2>
      <Button variant="contained" color="primary" onClick={handleOpenCreateModal}>Create User</Button>
      <div style={{ height: 600, width: '100%' }}>
        {rows.length > 0 ? (<DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
        />) : ("No Date Found")}

      </div>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>{isCreate ? 'Create User' : 'User Details'}</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate autoComplete="off">
            {!isCreate && (
              <TextField
                margin="dense"
                label="UUID"
                fullWidth
                variant="outlined"
                value={formValues.uuid}
                disabled
              />
            )}
            {!isCreate && (
              <TextField
                margin="dense"
                label="User Code"
                fullWidth
                variant="outlined"
                name="usercode"
                value={formValues.usercode}
                onChange={handleInputChange}
              />
            )}
            <TextField
              margin="dense"
              label="Username"
              fullWidth
              variant="outlined"
              name="username"
              value={formValues.username}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Name"
              fullWidth
              variant="outlined"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Email"
              fullWidth
              variant="outlined"
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Phone"
              fullWidth
              variant="outlined"
              name="phone"
              value={formValues.phone}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Address"
              fullWidth
              variant="outlined"
              name="address"
              value={formValues.address}
              onChange={handleInputChange}
            />
            {isCreate && (
              <>
                <TextField
                  margin="dense"
                  label="Password"
                  fullWidth
                  variant="outlined"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formValues.password}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={toggleShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  margin="dense"
                  label="Confirm Password"
                  fullWidth
                  variant="outlined"
                  name="confirm_password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formValues.confirm_password}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={toggleShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            )}
            {!isCreate && (
              <TextField
                margin="dense"
                label="Created At"
                fullWidth
                variant="outlined"
                name="created_at"
                value={formValues.created_at}
                disabled
              />
            )}
            <FormControlLabel
              control={<Checkbox checked={formValues.is_active} onChange={handleInputChange} name="is_active" />}
              label="Active"
            />
            <FormControlLabel
              control={<Checkbox checked={formValues.is_admin} onChange={handleInputChange} name="is_admin" />}
              label="Admin"
            />
            <FormControlLabel
              control={<Checkbox checked={formValues.is_approved} onChange={handleInputChange} name="is_approved" />}
              label="Approved"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">Close</Button>
          {isCreate ? (
            <Button onClick={handleCreateUser} color="primary">Create</Button>
          ) : (
            <>
              <Button onClick={handleUpdateUser} color="primary">Update</Button>
              <Button onClick={handleDeleteUser} color="secondary">Delete</Button>
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

export default UserList;
