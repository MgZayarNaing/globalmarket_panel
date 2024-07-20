import axios from 'axios';

// const API_BASE_URL = 'https://globalmarket.kanpetletfreedomfund.site/api';
// const API = 'https://globalmarket.kanpetletfreedomfund.site';

const API_BASE_URL = 'http://localhost:8000/api';
const API = 'http://localhost:8000'

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

    NETWORKS: `${API_BASE_URL}/networks/`,
    NETWORK_DETAIL: (pk) => `${API_BASE_URL}/networks/${pk}/`,
    NETWORK_UPDATE: (pk) => `${API_BASE_URL}/networks/${pk}/update/`,
    NETWORK_DELETE: (pk) => `${API_BASE_URL}/networks/${pk}/delete/`,
    NETWORK_CREATE: `${API_BASE_URL}/networks/create/`,

    COINS: `${API_BASE_URL}/coins/`,
    COIN_DETAIL: (pk) => `${API_BASE_URL}/coins/${pk}/`,
    COIN_UPDATE: (pk) => `${API_BASE_URL}/coins/${pk}/update/`,
    COIN_DELETE: (pk) => `${API_BASE_URL}/coins/${pk}/delete/`,
    COIN_CREATE: `${API_BASE_URL}/coins/create/`,

    DEPOSITS: `${API_BASE_URL}/deposits/`,
    DEPOSIT_DETAIL: (pk) => `${API_BASE_URL}/deposits/${pk}/`,
    DEPOSIT_UPDATE: (pk) => `${API_BASE_URL}/deposits/${pk}/update/`,
    DEPOSIT_DELETE: (pk) => `${API_BASE_URL}/deposits/${pk}/delete/`,
    DEPOSIT_CREATE: `${API_BASE_URL}/deposits/create/`,

    WITHDRAWS: `${API_BASE_URL}/withdraws/`,
    WITHDRAW_DETAIL: (pk) => `${API_BASE_URL}/withdraws/${pk}/`,
    WITHDRAW_UPDATE: (pk) => `${API_BASE_URL}/withdraws/${pk}/update/`,
    WITHDRAW_DELETE: (pk) => `${API_BASE_URL}/withdraws/${pk}/delete/`,
    WITHDRAW_CREATE: `${API_BASE_URL}/withdraws/create/`,

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

export const createNetwork = async (data) => {
    try {
        const response = await api.post(ENDPOINTS.NETWORK_CREATE, data);
        return response.data;
    } catch (error) {
        console.error('Create network error:', error);
        throw error;
    }
};

export const updateNetwork = async (pk, data) => {
    try {
        const response = await api.put(ENDPOINTS.NETWORK_UPDATE(pk), data);
        return response.data;
    } catch (error) {
        console.error('Update network error:', error);
        throw error;
    }
};

export const deleteNetwork = async (pk) => {
    try {
        const response = await api.delete(ENDPOINTS.NETWORK_DELETE(pk));
        return response.data;
    } catch (error) {
        console.error('Delete network error:', error);
        throw error;
    }
};

export const getNetworkDetail = async (pk) => {
    try {
        const response = await api.get(ENDPOINTS.NETWORK_DETAIL(pk));
        return response.data;
    } catch (error) {
        console.error('Get network detail error:', error);
        throw error;
    }
};

export const createCoin = async (data) => {
    try {
        const response = await api.post(ENDPOINTS.COIN_CREATE, data);
        return response.data;
    } catch (error) {
        console.error('Create coin error:', error);
        throw error;
    }
};

export const updateCoin = async (pk, data) => {
    try {
        const response = await api.put(ENDPOINTS.COIN_UPDATE(pk), data);
        return response.data;
    } catch (error) {
        console.error('Update coin error:', error);
        throw error;
    }
};

export const deleteCoin = async (pk) => {
    try {
        const response = await api.delete(ENDPOINTS.COIN_DELETE(pk));
        return response.data;
    } catch (error) {
        console.error('Delete coin error:', error);
        throw error;
    }
};

export const getCoinDetail = async (pk) => {
    try {
        const response = await api.get(ENDPOINTS.COIN_DETAIL(pk));
        return response.data;
    } catch (error) {
        console.error('Get coin detail error:', error);
        throw error;
    }
};

export const createDeposit = async (data) => {
    try {
        const response = await api.post(ENDPOINTS.DEPOSIT_CREATE, data);
        return response.data;
    } catch (error) {
        console.error('Create deposit error:', error);
        throw error;
    }
};

export const updateDeposit = async (pk, data) => {
    try {
        const response = await api.put(ENDPOINTS.DEPOSIT_UPDATE(pk), data);
        return response.data;
    } catch (error) {
        console.error('Update deposit error:', error);
        throw error;
    }
};

export const deleteDeposit = async (pk) => {
    try {
        const response = await api.delete(ENDPOINTS.DEPOSIT_DELETE(pk));
        return response.data;
    } catch (error) {
        console.error('Delete deposit error:', error);
        throw error;
    }
};

export const getDepositDetail = async (pk) => {
    try {
        const response = await api.get(ENDPOINTS.DEPOSIT_DETAIL(pk));
        return response.data;
    } catch (error) {
        console.error('Get deposit detail error:', error);
        throw error;
    }
};

export const createWithdraw = async (data) => {
    try {
        const response = await api.post(ENDPOINTS.WITHDRAW_CREATE, data);
        return response.data;
    } catch (error) {
        console.error('Create withdraw error:', error);
        throw error;
    }
};

export const updateWithdraw = async (pk, data) => {
    try {
        const response = await api.put(ENDPOINTS.WITHDRAW_UPDATE(pk), data);
        return response.data;
    } catch (error) {
        console.error('Update withdraw error:', error);
        throw error;
    }
};

export const deleteWithdraw = async (pk) => {
    try {
        const response = await api.delete(ENDPOINTS.WITHDRAW_DELETE(pk));
        return response.data;
    } catch (error) {
        console.error('Delete withdraw error:', error);
        throw error;
    }
};

export const getWithdrawDetail = async (pk) => {
    try {
        const response = await api.get(ENDPOINTS.WITHDRAW_DETAIL(pk));
        return response.data;
    } catch (error) {
        console.error('Get withdraw detail error:', error);
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
                } else {
                    handleLogout();
                }
            } catch (refreshError) {
                console.error('Refresh token error:', refreshError);
                handleLogout();
            }
        } else if (!localStorage.getItem('accessToken')) {
            handleLogout();
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
