import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const apiRequest = async (endpoint, options = {}) => {
    try {
        const response = await api(endpoint, options);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (login, senha) => {
    const response = await api.post('/auth/login', { login, senha });
    const { token, usuario } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    
    return response.data;
};

export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
};

export default api;