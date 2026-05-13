import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import invitationService from '../../services/invitationService';

// Mapa de roles para mostrarlos en español
const roleLabel = {
    'OWNER':  'Propietario',
    'ADMIN':  'Administrador',
    'MEMBER': 'Miembro',
};

function InvitationsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState('');

    useEffect(() => {
        const loadInvitations = async () => {
            try {
                setLoading(true);
                setError('');
                // El backend busca invitaciones por email
                const data = await invitationService.getPendingInvitations(user.email);
                setInvitations(data || []);
            } catch (err) {
                setError('Error al cargar las invitaciones.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.email) loadInvitations();
    }, [user?.email]);

    // Aceptar o rechazar una invitación
    const handleRespond = async (invitationId, accept) => {
        try {
            await invitationService.respondToInvitation(invitationId, user.id, accept);

            // Eliminamos la invitación respondida de la lista local
            setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));

            // Si aceptó, redirigimos a hogares para ver el nuevo hogar
            if (accept) {
                navigate('/households');
            }
        } catch (err) {
            setError('Error al responder la invitación.');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <span className="text-4xl">📩</span>
                    <p className="text-text-medium mt-3">Cargando invitaciones...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">

            {/*Cabecera*/}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-text-dark">
                    Invitaciones
                </h1>
                <p className="text-text-medium mt-1">
                    Gestiona las invitaciones que has recibido
                </p>
            </div>

            {/*Error*/}
            {error && (
                <div className="bg-primary-bg border border-border-dark text-primary px-4 py-3 rounded-lg mb-6 text-sm">
                    {error}
                </div>
            )}

            {/*Lista de invitaciones o lista vacía*/}
            {invitations.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-border">
                    <span className="text-5xl">📩</span>
                    <h2 className="text-xl font-semibold text-text-dark mt-4 mb-2">
                        No tienes invitaciones pendientes
                    </h2>
                    <p className="text-text-medium">
                        Cuando alguien te invite a un hogar aparecerá aquí.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {invitations.map((inv) => (
                        <div
                            key={inv.id}
                            className="bg-white rounded-xl border border-border p-5"
                        >
                            {/*Cabecera de la invitación*/}
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-primary-bg flex items-center justify-center flex-shrink-0">
                                    <span className="text-xl">🏠</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-text-dark">
                                        {inv.householdName}
                                    </p>
                                    <p className="text-sm text-text-medium">
                                        Invitado por <span className="font-medium">{inv.invitedByUserName}</span>
                                    </p>
                                </div>
                            </div>

                            {/*Detalle*/}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-text-light">Rol ofrecido:</span>
                                    <span className="text-xs font-medium bg-primary-bg text-primary px-2 py-0.5 rounded-full">
                                        {roleLabel[inv.roleOffered] || inv.roleOffered}
                                    </span>
                                </div>
                                {/*Mensaje personalizado (si hay)*/}
                                {inv.message && (
                                    <div className="bg-page-bg rounded-lg px-3 py-2">
                                        <p className="text-sm text-text-medium italic">
                                            "{inv.message}"
                                        </p>
                                    </div>
                                )}
                                <p className="text-xs text-text-light">
                                    Recibida el {new Date(inv.createdAt).toLocaleDateString('es-ES', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                                </p>
                            </div>

                            {/*Botones aceptar/rechazar*/}
                            <div className="flex gap-3 pt-3 border-t border-border">
                                <button
                                    onClick={() => handleRespond(inv.id, true)}
                                    className="flex-1 bg-accent text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                                >
                                    ✓ Aceptar
                                </button>
                                <button
                                    onClick={() => handleRespond(inv.id, false)}
                                    className="flex-1 bg-page-bg text-text-medium py-2 rounded-lg text-sm font-medium hover:bg-border transition-colors"
                                >
                                    ✕ Rechazar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}

export default InvitationsPage;