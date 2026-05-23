import api from './api';

const userService = {

    // Obtener perfil del usuario actual
    getProfile: async () => {
        const response = await api.get('/users/me');
        return response.data;
    },

    // Actualizar nombre
    updateProfile: async (data) => {
        const response = await api.put('/users/me', data);
        return response.data;
    },

    // Cambiar contraseña
    changePassword: async (data) => {
        const response = await api.put('/users/me/password', data);
        return response.data;
    },
};

export default userService;