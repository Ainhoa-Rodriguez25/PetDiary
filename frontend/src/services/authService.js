import api from "./api";

// Definición de las claves las cuales guardan los datos en localStorage
const TOKEN_KEY = 'carepet_token';
const USER_KEY = 'carepet_user';

const authService = {
    // Registrar usuario
    register: async (name, email, password) => {
        const response = await api.post('/auth/register', {
            name,
            email,
            password,
        });
        const data = response.data;

        // Token guardado en texto plano
        localStorage.setItem(TOKEN_KEY, data.token);

        // Se guarda el objeto usuario completo
        localStorage.setItem(USER_KEY, JSON.stringify(data));

        return data;
    },

    // Iniciar sesión
    login: async (email, password) => {
        const response = await api.post('/auth/login', {
            email,
            password,
        });
        const data = response.data;

        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data));

        return data;
    },

    // Cerrar sesión
    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    // Verificar si hay un token guardado
    isAuthenticated: () => {
        return !!localStorage.getItem(TOKEN_KEY);
    },

    // Obtener usuario actual
    getCurrentUser: () => {
        const userStr = localStorage.getItem(USER_KEY);

        // Si no hay nada guardado, devolvemos null
        if (!userStr) return null;

        try {
            return JSON.parse(userStr); // Se convierte el texto de vuelta al objeto
        } catch {
            return null;
        }
    },

    // Obtener solo el token
    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },
};

export default authService;