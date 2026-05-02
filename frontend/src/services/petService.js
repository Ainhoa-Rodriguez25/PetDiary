import api from './api';

const petService = {
    // Obtener todas las mascotas de un hogar
    getPetsByHousehold: async (householdId) => {
        const response = await api.get('/pets', {
            params: { householdId }
        });
        return response.data;
    },

    // Obtener mascota concreta por ID
    getPetById: async (id) => {
        const response = await api.get(`/pets/${id}`);
        return response.data;
    },

    // Crear nueva mascota
    createPet: async (data) => {
        const response = await api.post('/pets', data);
        return response.data;
    },

    // Actualizar mascota existente
    updatePet: async (id, data) => {
        const response = await api.put(`/pets/${id}`, data);
        return response.data;
    },

    // Eliminar mascota
    deletePet: async (id) => {
        const response = await api.delete(`/pets/${id}`);
        return response.data;
    },

    // Obtener razas filtradas por especie
    getBreeds: async (species = null) => {
        const response = await api.get('/breeds', {
            params: species ? { species } : {}
        });
        return response.data;
    },
};

export default petService;