import api from './api';

const walkService = {

    // Obtener paseos de una mascota
    getWalksByPet: async (petId) => {
        const response = await api.get('/walks', {
            params: { petId }
        });
        return response.data;
    },

    // Obtener un paseo por ID
    getWalkById: async (id) => {
        const response = await api.get(`/walks/${id}`);
        return response.data;
    },

    // Registrar un nuevo paseo
    createWalk: async (data) => {
        const response = await api.post('/walks', data);
        return response.data;
    },

    // Eliminar un paseo
    deleteWalk: async (id) => {
        const response = await api.delete(`/walks/${id}`);
        return response.data;
    },

    // Obtener historial de paseos en un rango de fechas
    getWalkHistory: async (petId, startDate, endDate) => {
        const response = await api.get('/walks/history', {
            params: {
                petId,
                // El backend espera formato ISO: 2026-05-01T00:00:00
                startDate: startDate.toISOString().slice(0, 19),
                endDate:   endDate.toISOString().slice(0, 19),
            }
        });
        return response.data;
    },
};

export default walkService;