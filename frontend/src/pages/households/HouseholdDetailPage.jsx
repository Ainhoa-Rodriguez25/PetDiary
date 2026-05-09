import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import householdService from '../../services/householdService';
import petService from "../../services/petService.js";
import invitationService from "../../services/invitationService.js";
import InviteForm from "../../components/households/InviteForm.jsx";

// Roles
const roleLabel = {
    'OWNER': 'Propietario',
    'ADMIN': 'Administrador',
    'MEMBER': 'Miembro',
};

const roleBadgeClass = {
    'OWNER':  'bg-primary-bg text-primary',
    'ADMIN':  'bg-accent-bg text-accent',
    'MEMBER': 'bg-page-bg text-text-medium',
};

const getSpeciesEmoji = (species) => {
    const emojis = {
        'dog': '🐶', 'cat': '🐱', 'bird': '🐦',
        'rabbit': '🐰', 'fish': '🐟', 'hamster': '🐹',
        'reptile': '🦎', 'other': '🐾',
    };
    return emojis[species] || '🐾';
};

function HouseholdDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [household, setHousehold] = useState(null);
    const [members, setMembers] = useState([]);
    const [pets, setPets] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showInviteModal, setShowInviteModal] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError('');

                // Se cargan hogar y miembros en paralelo
                const [householdData, membersData, petsData, invitationsData] = await Promise.all([
                    householdService.getHouseholdById(id),
                    householdService.getHouseholdMembers(id),
                    petService.getPetsByHousehold(id),
                    invitationService.getInvitationsByHousehold(id),
                ]);

                setHousehold(householdData);
                setMembers(membersData || []);
                setPets(petsData || []);
                setInvitations(invitationsData || []);
            } catch (err) {
                setError('No se pudo cargar el hogar.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) loadData();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm(`¿Eliminar el hogar "${household.name}"? Esta acción no se puede deshacer.`)) {
            try {
                await householdService.deleteHousehold(id, user.id);
                navigate('/households');
            } catch (err) {
                setError('Error al eliminar el hogar.');
                console.error(err);
            }
        }
    };

    const handleInviteSent = async () => {
        try {
            const invitationsData = await invitationService.getInvitationsByHousehold(id);
            setInvitations(invitationsData || []);
        } catch (err) {
            console.error(err);
        }
        setShowInviteModal(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <span className="text-4xl">🏠</span>
                    <p className="text-text-medium mt-3">Cargando...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-primary-bg border border-border-dark text-primary px-4 py-3 rounded-lg">
                {error}
            </div>
        );
    }

    if (!household) return null;

    return (
        <div className="max-w-2xl mx-auto">

            {/* MODAL DE INVITACIÓN */}
            {showInviteModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4"
                    onClick={() => setShowInviteModal(false)}
                >
                    {/* e.stopPropagation() evita que el clic dentro del modal
                        se propague al overlay y lo cierre */}
                    <div
                        className="bg-white rounded-2xl border border-border p-6 w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Cabecera del modal */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-text-dark">
                                Invitar usuario
                            </h2>
                            {/* Botón cerrar */}
                            <button
                                onClick={() => setShowInviteModal(false)}
                                className="text-text-light hover:text-text-dark transition-colors text-xl leading-none"
                            >
                                ✕
                            </button>
                        </div>

                        {/* El formulario de invitación */}
                        <InviteForm
                            householdId={id}
                            onInviteSent={handleInviteSent}
                        />
                    </div>
                </div>
            )}

            {/* BOTÓN VOLVER */}
            <button
                onClick={() => navigate('/households')}
                className="flex items-center gap-2 text-text-medium hover:text-text-dark text-sm mb-6 transition-colors"
            >
                ← Volver a hogares
            </button>

            {/* CABECERA DEL HOGAR */}
            <div className="bg-white rounded-xl border border-border p-6 mb-4">
                <div className="flex items-start justify-between">

                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary-bg flex items-center justify-center flex-shrink-0">
                            <span className="text-3xl">🏠</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-text-dark">
                                {household.name}
                            </h1>
                            {household.description && (
                                <p className="text-text-medium mt-0.5">
                                    {household.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            to={`/households/${household.id}/edit`}
                            className="text-sm bg-page-bg text-text-medium px-4 py-2 rounded-lg hover:bg-border transition-colors font-medium"
                        >
                            Editar
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="text-sm bg-red-50 text-red-400 px-4 py-2 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors font-medium"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>

            {/* INFORMACIÓN GENERAL */}
            <div className="bg-white rounded-xl border border-border p-6 mb-4">
                <h2 className="text-sm font-semibold text-text-light uppercase tracking-wide mb-4">
                    Información general
                </h2>
                <div className="space-y-3">
                    <div className="flex justify-between items-start py-2 border-b border-border">
                        <span className="text-sm text-text-medium">Creado el</span>
                        <span className="text-sm font-medium text-text-dark">
                            {new Date(household.createdAt).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </span>
                    </div>
                    <div className="flex justify-between items-start py-2">
                        <span className="text-sm text-text-medium">Miembros</span>
                        <span className="text-sm font-medium text-text-dark">
                            {members.length} {members.length === 1 ? 'persona' : 'personas'}
                        </span>
                    </div>
                </div>
            </div>

            {/* LISTA DE MIEMBROS */}
            <div className="bg-white rounded-xl border border-border p-6">
                <h2 className="text-sm font-semibold text-text-light uppercase tracking-wide mb-4">
                    Miembros del hogar
                </h2>

                {members.length === 0 ? (
                    <p className="text-text-medium text-sm text-center py-4">
                        No hay miembros en este hogar
                    </p>
                ) : (
                    <div className="space-y-3">
                        {members.map((member) => (
                            <div
                                key={member.userId}
                                className="flex items-center justify-between py-2 border-b border-border last:border-0"
                            >
                                <div className="flex items-center gap-3">
                                    {/* Avatar con iniciales */}
                                    <div className="w-9 h-9 rounded-full bg-primary-bg border border-border-dark flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-medium text-primary">
                                            {member.userName
                                                ? member.userName.split(' ').map((n) => n[0]).join('').toUpperCase()
                                                : '?'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-text-dark">
                                            {member.userName}
                                            {/* Indicamos si es el usuario actual */}
                                            {member.userId === user.id && (
                                                <span className="text-text-light font-normal ml-1">(tú)</span>
                                            )}
                                        </p>
                                        <p className="text-xs text-text-light">
                                            {member.userEmail}
                                        </p>
                                    </div>
                                </div>

                                {/* Badge de rol */}
                                <span className={`text-xs font-medium px-3 py-1 rounded-full ${roleBadgeClass[member.role] || 'bg-page-bg text-text-medium'}`}>
                                    {roleLabel[member.role] || member.role}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* INVITACIONES PENDIENTES */}
            {invitations.filter(inv => inv.status === 'PENDING').length > 0 && (
                <div className="bg-white rounded-xl border border-border p-6 mb-4">
                    <h2 className="text-sm font-semibold text-text-light uppercase tracking-wide mb-4">
                        Invitaciones pendientes
                    </h2>
                    <div className="space-y-3">
                        {invitations
                            .filter(inv => inv.status === 'PENDING')
                            .map((inv) => (
                                <div
                                    key={inv.id}
                                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-text-dark">
                                            {inv.invitedUserEmail}
                                        </p>
                                        <p className="text-xs text-text-light">
                                            {roleLabel[inv.roleOffered] || inv.roleOffered}
                                        </p>
                                    </div>
                                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-page-bg text-text-medium">
                                        Pendiente
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* MASCOTAS DEL HOGAR */}
            <div className="bg-white rounded-xl border border-border p-6 mt-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-text-light uppercase tracking-wide">
                        Mascotas del hogar
                    </h2>
                    <Link
                        to="/pets/new"
                        className="text-sm text-primary hover:text-primary-hover font-medium"
                    >
                        + Añadir mascota
                    </Link>
                </div>

                {pets.length === 0 ? (
                    <div className="text-center py-8">
                        <span className="text-3xl">🐾</span>
                        <p className="text-text-medium text-sm mt-2">
                            No hay mascotas en este hogar
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {pets.map((pet) => (
                            <div
                                key={pet.id}
                                className="flex items-center justify-between py-2 border-b border-border last:border-0"
                            >
                                <div className="flex items-center gap-3">
                                    {/* Avatar con emoji de especie */}
                                    <div className="w-9 h-9 rounded-full bg-primary-bg border border-border-dark flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">
                                {getSpeciesEmoji(pet.species)}
                            </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-text-dark">
                                            {pet.name}
                                        </p>
                                        <p className="text-xs text-text-light">
                                            {pet.breed?.name || pet.customBreed || pet.species}
                                        </p>
                                    </div>
                                </div>

                                {/* Link al detalle de la mascota */}
                                <Link
                                    to={`/pets/${pet.id}`}
                                    className="text-sm text-primary hover:text-primary-hover font-medium"
                                >
                                    Ver →
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}

export default HouseholdDetailPage;