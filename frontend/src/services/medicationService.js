import api from './api';

const medicationService = {

    // Obtener medicaciones de una mascota concreta
    getMedicationsByPet: async (petId) => {
        const response = await api.get('/medications', {
            params: { petId }
        });
        return response.data;
    },

    // Obtener una medicación por su ID
    getMedicationById: async (id) => {
        const response = await api.get(`/medications/${id}`);
        return response.data;
    },

    // Crear una nueva medicación
    createMedication: async (data) => {
        const response = await api.post('/medications', data);
        return response.data;
    },

    // Actualizar una medicación existente
    updateMedication: async (id, data) => {
        const response = await api.put(`/medications/${id}`, data);
        return response.data;
    },

    // Eliminar una medicación
    deleteMedication: async (id) => {
        const response = await api.delete(`/medications/${id}`);
        return response.data;
    },

    // Registrar que se administró una toma.
    // givenAt es opcional — si no se pasa, el backend usa la hora actual.
    // notes es opcional — observaciones sobre la toma.
    logMedication: async (medicationId, data) => {
        const response = await api.post(`/medications/${medicationId}/log`, data);
        return response.data;
    },

    // Obtener el historial de tomas de una medicación
    getMedicationHistory: async (medicationId) => {
        const response = await api.get(`/medications/${medicationId}/history`);
        return response.data;
    },
};

export default medicationService;