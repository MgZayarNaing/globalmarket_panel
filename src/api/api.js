import axios from 'axios';

const API_BASE_URL = 'https://globalmarket.kanpetletfreedomfund.site/api';
const API = 'https://globalmarket.kanpetletfreedomfund.site';

// const API_BASE_URL = 'http://localhost:8000/api';
// const API = 'http://localhost:8000'

export const ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/login/`,
    USERS: `${API_BASE_URL}/users/`,
    USER_DETAIL: (uuid) => `${API_BASE_URL}/users/${uuid}/`,
    TOKEN_REFRESH: `${API_BASE_URL}/token/refresh/`,
    USER_UPDATE: (uuid) => `${API_BASE_URL}/users/${uuid}/update/`,
    USER_DELETE: (uuid) => `${API_BASE_URL}/users/${uuid}/delete/`,
    USER_CREATE: `${API_BASE_URL}/users/create/`,

    IMAGE_SLIDER: `${API_BASE_URL}/imageslider/`,
    IMAGE_SLIDER_DETAIL: (pk) => `${API_BASE_URL}/imageslider/${pk}/`,
    IMAGE_SLIDER_UPDATE: (pk) => `${API_BASE_URL}/imageslider/${pk}/update/`,
    IMAGE_SLIDER_DELETE: (pk) => `${API_BASE_URL}/imageslider/${pk}/delete/`,
    IMAGE_SLIDER_CREATE: `${API_BASE_URL}/imageslider/create/`,

    FUTURES: `${API_BASE_URL}/futures/`,
    FUTURE_DETAIL: (pk) => `${API_BASE_URL}/futures/${pk}/`,
    FUTURE_UPDATE: (pk) => `${API_BASE_URL}/futures/${pk}/update/`,
    FUTURE_DELETE: (pk) => `${API_BASE_URL}/futures/${pk}/delete/`,
    FUTURE_CREATE: `${API_BASE_URL}/futures/create/`,

    COINTYPES: `${API_BASE_URL}/cointypes/`,
    COINTYPE_DETAIL: (pk) => `${API_BASE_URL}/cointypes/${pk}/`,
    COINTYPE_UPDATE: (pk) => `${API_BASE_URL}/cointypes/${pk}/update/`,
    COINTYPE_DELETE: (pk) => `${API_BASE_URL}/cointypes/${pk}/delete/`,
    COINTYPE_CREATE: `${API_BASE_URL}/cointypes/create/`,
};

export const login = async (credentials) => {
    try {
        const response = await axios.post(ENDPOINTS.LOGIN, credentials);
        const { access, refresh, user_id } = response.data;
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        localStorage.setItem('userId', user_id);
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const updateUser = async (uuid, data) => {
    try {
        const response = await api.put(ENDPOINTS.USER_UPDATE(uuid), data);
        return response.data;
    } catch (error) {
        console.error('Update user error:', error);
        throw error;
    }
};

export const deleteUser = async (uuid) => {
    try {
        const response = await api.delete(ENDPOINTS.USER_DELETE(uuid));
        return response.data;
    } catch (error) {
        console.error('Delete user error:', error);
        throw error;
    }
};

export const createUser = async (data) => {
    try {
        const response = await api.post(ENDPOINTS.USER_CREATE, data);
        return response.data;
    } catch (error) {
        console.error('Create user error:', error);
        throw error;
    }
};

export const searchUsers = async (params) => {
    try {
        const response = await api.get(ENDPOINTS.USERS, { params });
        return response.data;
    } catch (error) {
        console.error('Search users error:', error);
        throw error;
    }
};

export const createCoinType = async (data) => {
    try {
        const response = await api.post(ENDPOINTS.COINTYPE_CREATE, data);
        return response.data;
    } catch (error) {
        console.error('Create cointype error:', error);
        throw error;
    }
};

export const updateCoinType = async (pk, data) => {
    try {
        const response = await api.put(ENDPOINTS.COINTYPE_UPDATE(pk), data);
        return response.data;
    } catch (error) {
        console.error('Update cointype error:', error);
        throw error;
    }
};

export const deleteCoinType = async (pk) => {
    try {
        const response = await api.delete(ENDPOINTS.COINTYPE_DELETE(pk));
        return response.data;
    } catch (error) {
        console.error('Delete cointype error:', error);
        throw error;
    }
};

export const getCoinTypeDetail = async (pk) => {
    try {
        const response = await api.get(ENDPOINTS.COINTYPE_DETAIL(pk));
        return response.data;
    } catch (error) {
        console.error('Get cointype detail error:', error);
        throw error;
    }
};

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await axios.post(ENDPOINTS.TOKEN_REFRESH, { refresh: refreshToken });
                    localStorage.setItem('accessToken', response.data.access);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                    originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
                    return axios(originalRequest);
                }
            } catch (refreshError) {
                console.error('Refresh token error:', refreshError);
                handleLogout();
            }
        }
        return Promise.reject(error);
    }
);

const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    window.location.href = '/login';
};

export { api, API_BASE_URL, API };
