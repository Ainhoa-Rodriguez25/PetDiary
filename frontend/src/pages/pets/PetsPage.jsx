import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import petService from '../../services/petService';
import householdService from '../../services/householdService';
import PetCard from '../../components/pets/PetCard';

function PetsPage() {
    const { user } = useAuth();

    const [pets, setPets]           = useState([]);
    const [households, setHouseholds] = useState([]);
    const [household, setHousehold] = useState(null);
    const [loading, setLoading]     = useState(true);
    const [loadingPets, setLoadingPets] = useState(false);
    const [error, setError]         = useState('');

    const loadPets = async (householdId) => {
        try {
            setLoadingPets(true);
            const petsData = await petService.getPetsByHousehold(householdId);
            setPets(petsData || []);
        } catch (err) {
            setError('Error al cargar las mascotas.');
            console.error(err);
        } finally {
            setLoadingPets(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError('');

                const householdsData = await householdService.getHouseholdByUser(user.id);

                if (!householdsData || householdsData.length === 0) {
                    setLoading(false);
                    return;
                }

                setHouseholds(householdsData);

                // Seleccionamos el primer hogar por defecto
                const activeHousehold = householdsData[0];
                setHousehold(activeHousehold);
                await loadPets(activeHousehold.id);

            } catch (err) {
                setError('Error al cargar los datos.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) loadData();
    }, [user?.id]);

    const handleDelete = async (petId) => {
        try {
            await petService.deletePet(petId);
            setPets((prev) => prev.filter((p) => p.id !== petId));
        } catch (err) {
            setError('Error al eliminar la mascota.');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <span className="text-4xl">🐾</span>
                    <p className="text-text-medium mt-3">Cargando mascotas...</p>
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

    if (households.length === 0) {
        return (
            <div className="text-center py-20">
                <span className="text-5xl">🏠</span>
                <h2 className="text-xl font-semibold text-text-dark mt-4 mb-2">
                    Necesitas un hogar primero
                </h2>
                <p className="text-text-medium mb-6">
                    Las mascotas pertenecen a un hogar. Crea uno para empezar.
                </p>
                <Link
                    to="/households/new"
                    className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-hover transition-colors font-medium"
                >
                    Crear hogar
                </Link>
            </div>
        );
    }

    return (
        <div>

            {/* CABECERA */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-dark">
                        Mis mascotas
                    </h1>
                    <p className="text-text-medium mt-1">
                        Gestiona las mascotas de tus hogares
                    </p>
                </div>
                <Link
                    to="/pets/new"
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium"
                >
                    + Añadir mascota
                </Link>
            </div>

            {/* SELECTOR DE HOGAR */}
            {households.length > 1 && (
                <div className="bg-white rounded-xl border border-border p-4 mb-6">
                    <label className="block text-sm font-medium text-text-dark mb-2">
                        Ver mascotas de:
                    </label>
                    <div className="flex gap-2 flex-wrap">
                        {households.map(h => (
                            <button
                                key={h.id}
                                onClick={() => {
                                    setHousehold(h);
                                    loadPets(h.id);
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    household?.id === h.id
                                        ? 'bg-primary text-white'
                                        : 'bg-page-bg text-text-medium hover:bg-border'
                                }`}
                            >
                                <span>🏠</span>
                                <span>{h.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* LISTA DE MASCOTAS */}
            {loadingPets ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(n => (
                        <div
                            key={n}
                            className="bg-white rounded-xl border border-border p-5 h-40 animate-pulse"
                        />
                    ))}
                </div>
            ) : pets.length === 0 ? (
                <div className="text-center py-20">
                    <span className="text-5xl">🐾</span>
                    <h2 className="text-xl font-semibold text-text-dark mt-4 mb-2">
                        {household?.name} no tiene mascotas
                    </h2>
                    <p className="text-text-medium mb-6">
                        Añade tu primera mascota para empezar a gestionarla.
                    </p>
                    <Link
                        to="/pets/new"
                        className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-hover transition-colors font-medium"
                    >
                        Añadir mascota
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pets.map((pet) => (
                        <PetCard
                            key={pet.id}
                            pet={pet}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

        </div>
    );
}

export default PetsPage;