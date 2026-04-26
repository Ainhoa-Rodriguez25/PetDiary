import api from "./api";

export const authService = {
    // Registrar usuario
    register: async (name, email, password) => {
        const response = await api.post('/auth/register', {
            name,
            email,
            password,
        });
        return response.data;
    },

    // Iniciar sesión
    login: async (email, password) => {
        const response = await api.post('/auth/login', {
            email,
            password,
        });
        return response.data;
    },

    // Cerrar sesión
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
    },

    // Verificar si está autenticado
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Obtener usuario actual
    getCurrentUser: () => {
        return {
            id: localStorage.getItem('userId'),
            name: localStorage.getItem('userName'),
        };
    },
};