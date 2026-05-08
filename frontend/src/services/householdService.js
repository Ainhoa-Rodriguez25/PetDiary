import api from './api';

const householdService = {
    // Obtener todos los hogares del usuario
    getHouseholdByUser: async (userId) => {
        const response = await api.get('/households', {
            params: { userId }
        });
        return response.data;
    },

    // Obtener hogar concreto
    getHouseholdById: async (id) => {
        const response = await api.get(`/households/${id}`);
        return response.data;
    },

    // Crear un nuevo hogar
    createHousehold: async (userId, data) => {
        const response = await api.post('/households', data, {
            params: { userId }
        });
        return response.data;
    },

    // Actualizar hogar existente
    updateHousehold: async (id, userId, data) => {
        const response = await api.put(`/households/${id}`, data, {
            params: { userId }
        });
        return response.data;
    },

    // Eliminar hogar
    deleteHousehold: async (id, userId) => {
        const response = await api.delete(`/households/${id}`, {
            params: { userId }
        });
        return response.data;
    },

    // Obtener miembros de un hogar
    getHouseholdMembers: async (id) => {
        const response = await api.get(`/households/${id}/members`);
        return response.data;
    },
};

export default householdService;