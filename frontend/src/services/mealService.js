import api from './api';

const mealService = {

    getMealsByPet: async (petId) => {
        const response = await api.get('/meals', {
            params: { petId }
        });
        return response.data;
    },

    getMealById: async (id) => {
        const response = await api.get(`/meals/${id}`);
        return response.data;
    },

    createMeal: async (data) => {
        const response = await api.post('/meals', data);
        return response.data;
    },

    updateMeal: async (id, data) => {
        const response = await api.put(`/meals/${id}`, data);
        return response.data;
    },

    deleteMeal: async (id) => {
        const response = await api.delete(`/meals/${id}`);
        return response.data;
    },

    // Registrar que se dio una comida
    logMeal: async (mealId, data) => {
        const response = await api.post(`/meals/${mealId}/log`, data);
        return response.data;
    },

    getMealHistory: async (mealId) => {
        const response = await api.get(`/meals/${mealId}/history`);
        return response.data;
    },
};

export default mealService;