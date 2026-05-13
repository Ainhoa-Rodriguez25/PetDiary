import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import petService from '../services/petService';
import householdService from '../services/householdService';
import PetCard from '../components/pets/PetCard';
import invitationService from "../services/invitationService.js";

const getTodayFormatted = () => {
    return new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

function DashboardPage() {
    // Objeto usuario con toda la información relacionada
    const { user } = useAuth();

    const [pets, setPets] = useState([]);
    const [households, setHouseholds] = useState([]);
    const [pendingInvitations, setPendingInvitations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Se cargan los hogares y las mascotas a la vez con Promise.all
                const householdsData = await householdService.getHouseholdByUser(user.id);
                setHouseholds(householdsData || []);

                // Solo se cargan mascotas si hay al menos un hogar
                if (householdsData && householdsData.length > 0) {
                    const petsData = await petService.getPetsByHousehold(householdsData[0].id);
                    setPets(petsData || []);
                }
            } catch (err) {
                console.error('Error cargando dashboard:', err);
            }

            try {
                // Se cargan las invitaciones pendientes usando el email del usuario
                const invitationsData = await invitationService.getPendingInvitations(user.email);
                setPendingInvitations(invitationsData || []);
            } catch (err) {
                console.error('Error cargando invitaciones:', err);
            }

            setLoading(false);
        };

        if (user?.id) loadData();
    }, [user?.id]);

    // Función para eliminar mascota desde dashboard
    const handleDeletePet = async (petId) => {
        try {
            await petService.deletePet(petId);
            setPets((prev) => prev.filter((p) => p.id !== petId));
        } catch (err) {
            console.error('Error eliminando mascota:', err);
        }
    };

    return (
        <div>

            {/* CABECERA */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-text-dark">
                    Bienvenida, {user?.name} 👋
                </h1>
                <p className="text-text-medium mt-1 capitalize">
                    {getTodayFormatted()}
                </p>
            </div>

            {/*BANNER DE INVITACIONES PENDIENTES*/}
            {pendingInvitations.length > 0 && (
                <div className="bg-accent-bg border border-accent rounded-xl p-4 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">📩</span>
                        <div>
                            <p className="font-medium text-text-dark">
                                {pendingInvitations.length === 1
                                    ? 'Tienes 1 invitación pendiente'
                                    : `Tienes ${pendingInvitations.length} invitaciones pendientes`}
                            </p>
                            <p className="text-sm text-text-medium">
                                Alguien te ha invitado a unirte a un hogar
                            </p>
                        </div>
                    </div>
                    <Link
                        to="/invitations"
                        className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex-shrink-0"
                    >
                        Ver invitaciones
                    </Link>
                </div>
            )}

            {/*Tarjetas resumen*/}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">

                {/*Tarjeta mascotas*/}
                <Link
                    to="/pets"
                    className="bg-white rounded-xl border border-border p-5 hover:border-border-dark transition-colors"
                >
                    <div className="text-3xl mb-2">🐾</div>
                    {loading ? (
                        <div className="h-7 w-8 bg-page-bg rounded animate-pulse mb-1" />
                    ) : (
                        <p className="text-2xl font-bold text-text-dark">{pets.length}</p>
                    )}
                    <p className="text-sm text-text-medium">
                        {pets.length === 1 ? 'Mascota' : 'Mascotas'}
                    </p>
                </Link>

                {/*Tarjeta hogares*/}
                <div className="bg-white rounded-xl border border-border p-5">
                    <div className="text-3xl mb-2">🏠</div>
                    {loading ? (
                        <div className="h-7 w-8 bg-page-bg rounded animate-pulse mb-1" />
                    ) : (
                        <p className="text-2xl font-bold text-text-dark">{households.length}</p>
                    )}
                    <p className="text-sm text-text-medium">
                        {households.length === 1 ? 'Hogar' : 'Hogares'}
                    </p>
                </div>

                {/*Tarjeta acceso rápido*/}
                <Link
                    to="/pets/new"
                    className="bg-primary-bg rounded-xl border border-border p-5 hover:border-border-dark transition-colors flex flex-col justify-center items-center text-center col-span-2 sm:col-span-1"
                >
                    <div className="text-3xl mb-2">➕</div>
                    <p className="text-sm font-medium text-primary">
                        Añadir mascota
                    </p>
                </Link>

            </div>

            {/*Sección mascotas*/}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-text-dark">
                        Mis mascotas
                    </h2>
                    {pets.length > 0 && (
                        <Link
                            to="/pets"
                            className="text-sm text-primary hover:text-primary-hover font-medium"
                        >
                            Ver todas →
                        </Link>
                    )}
                </div>

                {loading ? (
                    // Skeleton de carga — 3 tarjetas grises animadas
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((n) => (
                            <div
                                key={n}
                                className="bg-white rounded-xl border border-border p-5 h-40 animate-pulse"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-page-bg" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-24 bg-page-bg rounded" />
                                        <div className="h-3 w-16 bg-page-bg rounded" />
                                    </div>
                                </div>
                                <div className="h-3 w-full bg-page-bg rounded" />
                            </div>
                        ))}
                    </div>

                ) : pets.length === 0 ? (

                    // Estado vacío
                    <div className="text-center py-12 bg-white rounded-xl border border-border">
                        <span className="text-4xl">🐾</span>
                        <p className="text-text-medium mt-3 mb-4">
                            Aún no tienes mascotas registradas
                        </p>
                        <Link
                            to="/pets/new"
                            className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium"
                        >
                            Añadir primera mascota
                        </Link>
                    </div>

                ) : (

                    // Mostramos máximo 3 mascotas en el dashboard
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pets.slice(0, 3).map((pet) => (
                            <PetCard
                                key={pet.id}
                                pet={pet}
                                onDelete={handleDeletePet}
                            />
                        ))}
                    </div>

                )}
            </div>

        </div>
    );
}

export default DashboardPage;