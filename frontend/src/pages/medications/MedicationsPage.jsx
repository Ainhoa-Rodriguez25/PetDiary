import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import medicationService from '../../services/medicationService';
import householdService from '../../services/householdService';
import petService from '../../services/petService';
import MedicationCard from '../../components/medications/MedicationCard';

function MedicationsPage() {
    const { user } = useAuth();

    const [medications, setMedications] = useState([]);
    const [pets, setPets] = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingMeds, setLoadingMeds] = useState(false);
    const [error, setError] = useState('');

    // Carga las medicaciones de una mascota concreta
    const loadMedications = async (petId) => {
        try {
            setLoadingMeds(true);
            const data = await medicationService.getMedicationsByPet(petId);
            setMedications(data || []);
        } catch (err) {
            setError('Error al cargar las medicaciones.');
            console.error(err);
        } finally {
            setLoadingMeds(false);
        }
    };

    // Cargamos las mascotas del usuario al montar
    useEffect(() => {
        const loadPets = async () => {
            try {
                setLoading(true);
                setError('');

                const householdsData = await householdService.getHouseholdByUser(user.id);

                if (!householdsData || householdsData.length === 0) {
                    setLoading(false);
                    return;
                }

                // Cargamos mascotas del primer hogar
                const petsData = await petService.getPetsByHousehold(householdsData[0].id);
                setPets(petsData || []);

                // Si hay mascotas, seleccionamos la primera por defecto
                if (petsData && petsData.length > 0) {
                    setSelectedPet(petsData[0]);
                    await loadMedications(petsData[0].id);
                }

            } catch (err) {
                setError('Error al cargar los datos.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) loadPets();
    }, [user?.id]);

    const handleDelete = async (medicationId) => {
        try {
            await medicationService.deleteMedication(medicationId);
            setMedications(prev => prev.filter(m => m.id !== medicationId));
        } catch (err) {
            setError('Error al eliminar la medicación.');
            console.error(err);
        }
    };

    const getSpeciesEmoji = (species) => {
        const emojis = {
            'dog': '🐶', 'cat': '🐱', 'bird': '🐦',
            'rabbit': '🐰', 'fish': '🐟', 'hamster': '🐹',
            'reptile': '🦎', 'other': '🐾',
        };
        return emojis[species] || '🐾';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <span className="text-4xl">💊</span>
                    <p className="text-text-medium mt-3">Cargando medicaciones...</p>
                </div>
            </div>
        );
    }

    // Si no tiene mascotas no puede tener medicaciones
    if (pets.length === 0) {
        return (
            <div className="text-center py-20">
                <span className="text-5xl">🐾</span>
                <h2 className="text-xl font-semibold text-text-dark mt-4 mb-2">
                    Necesitas mascotas primero
                </h2>
                <p className="text-text-medium mb-6">
                    Añade una mascota antes de gestionar su medicación.
                </p>
                <Link
                    to="/pets/new"
                    className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-hover transition-colors font-medium"
                >
                    Añadir mascota
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
                        Medicación
                    </h1>
                    <p className="text-text-medium mt-1">
                        Control de medicamentos de tus mascotas
                    </p>
                </div>
                {selectedPet && (
                    <Link
                        to={`/medications/new?petId=${selectedPet.id}`}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium"
                    >
                        + Añadir medicación
                    </Link>
                )}
            </div>

            {/* ERROR */}
            {error && (
                <div className="bg-primary-bg border border-border-dark text-primary px-4 py-3 rounded-lg mb-6 text-sm">
                    {error}
                </div>
            )}

            {/* SELECTOR DE MASCOTA */}
            <div className="bg-white rounded-xl border border-border p-4 mb-6">
                <label className="block text-sm font-medium text-text-dark mb-2">
                    Ver medicación de:
                </label>
                <div className="flex gap-2 flex-wrap">
                    {pets.map(pet => (
                        <button
                            key={pet.id}
                            onClick={() => {
                                setSelectedPet(pet);
                                loadMedications(pet.id);
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedPet?.id === pet.id
                                    ? 'bg-primary text-white'
                                    : 'bg-page-bg text-text-medium hover:bg-border'
                            }`}
                        >
                            <span>{getSpeciesEmoji(pet.species)}</span>
                            <span>{pet.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* LISTA DE MEDICACIONES */}
            {loadingMeds ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(n => (
                        <div
                            key={n}
                            className="bg-white rounded-xl border border-border p-5 h-40 animate-pulse"
                        />
                    ))}
                </div>
            ) : medications.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-border">
                    <span className="text-4xl">💊</span>
                    <h2 className="text-xl font-semibold text-text-dark mt-4 mb-2">
                        {selectedPet?.name} no tiene medicaciones
                    </h2>
                    <p className="text-text-medium mb-6">
                        Añade un medicamento para empezar el seguimiento.
                    </p>
                    <Link
                        to={`/medications/new?petId=${selectedPet?.id}`}
                        className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-hover transition-colors font-medium"
                    >
                        Añadir medicación
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {medications.map(medication => (
                        <MedicationCard
                            key={medication.id}
                            medication={medication}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

        </div>
    );
}

export default MedicationsPage;