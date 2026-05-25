import axios from 'axios';

// En producción apunta al backend de Railway
// En local el proxy de Vite redirige /api a localhost:8080
const isProduction = window.location.hostname !== 'localhost';
const BASE_URL = isProduction
    ? 'https://carepet-production.up.railway.app'
    : '';

const api = axios.create({
    baseURL: `${BASE_URL}/api`,
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