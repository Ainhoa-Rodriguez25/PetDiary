import api from "./api";

const invitationService = {
    // Invitar a un usuario al hogar
    inviteUser: async (householdId, userId, data) => {
        const response = await api.post(`/households/${householdId}/invite`, data, { params: { userId } });

        return response.data;
    },

    // Obtener invitaciones pendientes del usuario actual
    getPendingInvitations: async (email) => {
        const response = await api.get(`/households/invitations/pending`, { params: { email } });
        return response.data;
    },

    // Aceptar o rechazar invitación
    respondToInvitation: async (invitationId, userId, accept) => {
        const response = await api.post(`/households/invitations/${invitationId}/accept`, { accept }, { params: { userId } });
        return response.data;
    },

    // Obtener todas las invitaciones de un hogar concreto
    getInvitationsByHousehold: async (householdId) => {
        const response = await api.get(`/households/${householdId}/invitations`);
        return response.data;
    },
};

export default invitationService;