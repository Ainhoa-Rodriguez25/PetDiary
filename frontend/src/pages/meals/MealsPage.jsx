import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import mealService from '../../services/mealService';
import householdService from '../../services/householdService';
import petService from '../../services/petService';
import MealCard from '../../components/meals/MealCard';

function MealsPage() {
    const { user } = useAuth();

    const [meals, setMeals]             = useState([]);
    const [pets, setPets]               = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);
    const [loading, setLoading]         = useState(true);
    const [loadingMeals, setLoadingMeals] = useState(false);
    const [error, setError]             = useState('');

    const loadMeals = async (petId) => {
        try {
            setLoadingMeals(true);
            const data = await mealService.getMealsByPet(petId);
            setMeals(data || []);
        } catch (err) {
            setError('Error al cargar las comidas.');
            console.error(err);
        } finally {
            setLoadingMeals(false);
        }
    };

    useEffect(() => {
        const loadPets = async () => {
            try {
                setLoading(true);
                setError('');

                const householdsData = await householdService.getHouseholdsByUser(user.id);

                if (!householdsData || householdsData.length === 0) {
                    setLoading(false);
                    return;
                }

                // Cargamos mascotas de todos los hogares
                const petsArrays = await Promise.all(
                    householdsData.map(h => petService.getPetsByHousehold(h.id))
                );
                const allPets = petsArrays.flat();
                setPets(allPets);

                if (allPets.length > 0) {
                    setSelectedPet(allPets[0]);
                    await loadMeals(allPets[0].id);
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

    const handleDelete = async (mealId) => {
        try {
            await mealService.deleteMeal(mealId);
            setMeals(prev => prev.filter(m => m.id !== mealId));
        } catch (err) {
            setError('Error al eliminar la rutina de comidas.');
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
                    <span className="text-4xl">🍽️</span>
                    <p className="text-text-medium mt-3">Cargando comidas...</p>
                </div>
            </div>
        );
    }

    if (pets.length === 0) {
        return (
            <div className="text-center py-20">
                <span className="text-5xl">🐾</span>
                <h2 className="text-xl font-semibold text-text-dark mt-4 mb-2">
                    Necesitas mascotas primero
                </h2>
                <p className="text-text-medium mb-6">
                    Añade una mascota antes de gestionar su alimentación.
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
                        Comidas
                    </h1>
                    <p className="text-text-medium mt-1">
                        Rutinas de alimentación de tus mascotas
                    </p>
                </div>
                {selectedPet && (
                    <Link
                        to={`/meals/new?petId=${selectedPet.id}`}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium"
                    >
                        + Añadir rutina
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
                    Ver comidas de:
                </label>
                <div className="flex gap-2 flex-wrap">
                    {pets.map(pet => (
                        <button
                            key={pet.id}
                            onClick={() => {
                                setSelectedPet(pet);
                                loadMeals(pet.id);
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

            {/* LISTA DE COMIDAS */}
            {loadingMeals ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(n => (
                        <div
                            key={n}
                            className="bg-white rounded-xl border border-border p-5 h-40 animate-pulse"
                        />
                    ))}
                </div>
            ) : meals.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-border">
                    <span className="text-4xl">🍽️</span>
                    <h2 className="text-xl font-semibold text-text-dark mt-4 mb-2">
                        {selectedPet?.name} no tiene rutinas de comida
                    </h2>
                    <p className="text-text-medium mb-6">
                        Añade una rutina para empezar el seguimiento.
                    </p>
                    <Link
                        to={`/meals/new?petId=${selectedPet?.id}`}
                        className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-hover transition-colors font-medium"
                    >
                        Añadir rutina
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {meals.map(meal => (
                        <MealCard
                            key={meal.id}
                            meal={meal}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

        </div>
    );
}

export default MealsPage;