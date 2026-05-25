import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/api`
        : '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para añadir token JWT a cada petición
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('carepet_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('carepet_token');
            localStorage.removeItem('carepet_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;