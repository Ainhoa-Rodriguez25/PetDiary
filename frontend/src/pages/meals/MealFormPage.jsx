import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import mealService from '../../services/mealService';
import householdService from '../../services/householdService';
import petService from '../../services/petService';

const MEALS_PER_DAY_OPTIONS = [
    { value: '1', label: 'Una vez al día'       },
    { value: '2', label: 'Dos veces al día'     },
    { value: '3', label: 'Tres veces al día'    },
    { value: '4', label: 'Cuatro veces al día'  },
];

function MealFormPage() {
    const { id } = useParams();
    const isEditing = !!id;

    const [searchParams] = useSearchParams();
    const navigate  = useNavigate();
    const { user }  = useAuth();

    const [formData, setFormData] = useState({
        petId:      '',
        mealsPerDay: '',
        firstTime:  '',
        secondTime: '',
        thirdTime:  '',
        fourthTime: '',
        notes:      '',
    });

    const [pets, setPets]               = useState([]);
    const [loading, setLoading]         = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [error, setError]             = useState('');

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoadingData(true);

                const householdsData = await householdService.getHouseholdByUser(user.id);
                if (householdsData && householdsData.length > 0) {
                    const petsArrays = await Promise.all(
                        householdsData.map(h => petService.getPetsByHousehold(h.id))
                    );
                    const allPets = petsArrays.flat();
                    setPets(allPets);

                    const petIdFromUrl = searchParams.get('petId');
                    if (petIdFromUrl && !isEditing) {
                        setFormData(prev => ({ ...prev, petId: parseInt(petIdFromUrl) }));
                    } else if (!isEditing && allPets.length > 0) {
                        setFormData(prev => ({ ...prev, petId: allPets[0].id }));
                    }
                }

                if (isEditing) {
                    const meal = await mealService.getMealById(id);
                    setFormData({
                        petId:       meal.petId       || '',
                        mealsPerDay: meal.mealsPerDay || '',
                        firstTime:   meal.firstTime   || '',
                        secondTime:  meal.secondTime  || '',
                        thirdTime:   meal.thirdTime   || '',
                        fourthTime:  meal.fourthTime  || '',
                        notes:       meal.notes       || '',
                    });
                }

            } catch (err) {
                setError('Error al cargar los datos.');
                console.error(err);
            } finally {
                setLoadingData(false);
            }
        };

        if (user?.id) loadInitialData();
    }, [user?.id, id, isEditing, searchParams]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Al cambiar mealsPerDay limpiamos los horarios extra
    const handleMealsPerDayChange = (e) => {
        const mealsPerDay = e.target.value;
        setFormData(prev => ({
            ...prev,
            mealsPerDay,
            secondTime: '',
            thirdTime:  '',
            fourthTime: '',
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.petId) {
            setError('Selecciona una mascota');
            return;
        }
        if (!formData.mealsPerDay) {
            setError('Selecciona el número de comidas por día');
            return;
        }
        if (!formData.firstTime) {
            setError('La hora de la primera comida es obligatoria');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const numMeals = parseInt(formData.mealsPerDay);

            const mealData = {
                petId:       parseInt(formData.petId),
                mealsPerDay: formData.mealsPerDay,
                firstTime:   formData.firstTime  || null,
                secondTime:  numMeals >= 2 ? formData.secondTime  || null : null,
                thirdTime:   numMeals >= 3 ? formData.thirdTime   || null : null,
                fourthTime:  numMeals >= 4 ? formData.fourthTime  || null : null,
                notes:       formData.notes.trim() || null,
            };

            if (isEditing) {
                await mealService.updateMeal(id, mealData);
            } else {
                await mealService.createMeal(mealData);
            }

            navigate('/meals');

        } catch (err) {
            const msg = err.response?.data?.message
                || err.response?.data
                || 'Error al guardar la rutina de comidas.';
            setError(typeof msg === 'string' ? msg : 'Error al guardar la rutina de comidas.');
            console.error('Error completo:', err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const numMeals = parseInt(formData.mealsPerDay) || 0;

    if (loadingData) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <span className="text-4xl">🍽️</span>
                    <p className="text-text-medium mt-3">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-text-dark">
                    {isEditing ? 'Editar rutina de comidas' : 'Añadir rutina de comidas'}
                </h1>
                <p className="text-text-medium mt-1">
                    {isEditing
                        ? 'Modifica la rutina de alimentación'
                        : 'Configura la rutina de alimentación'}
                </p>
            </div>

            <div className="bg-white rounded-xl border border-border p-6">

                {error && (
                    <div className="bg-primary-bg border border-border-dark text-primary px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* MASCOTA */}
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">
                            Mascota <span className="text-primary">*</span>
                        </label>
                        <select
                            name="petId"
                            value={formData.petId}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark"
                            disabled={loading || isEditing}
                        >
                            <option value="">Selecciona una mascota...</option>
                            {pets.map(pet => (
                                <option key={pet.id} value={pet.id}>
                                    {pet.name}
                                </option>
                            ))}
                        </select>
                        {isEditing && (
                            <p className="text-xs text-text-light mt-1">
                                No se puede cambiar la mascota de una rutina existente
                            </p>
                        )}
                    </div>

                    {/* COMIDAS POR DÍA */}
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">
                            Comidas por día <span className="text-primary">*</span>
                        </label>
                        <select
                            name="mealsPerDay"
                            value={formData.mealsPerDay}
                            onChange={handleMealsPerDayChange}
                            className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark"
                            disabled={loading}
                        >
                            <option value="">Selecciona...</option>
                            {MEALS_PER_DAY_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* HORARIOS — aparecen dinámicamente según mealsPerDay */}
                    {numMeals >= 1 && (
                        <div className={`grid gap-4 grid-cols-${Math.min(numMeals, 2)}`}>

                            <div>
                                <label className="block text-sm font-medium text-text-dark mb-1">
                                    {numMeals === 1 ? 'Hora de la comida' : 'Primera comida'}
                                    <span className="text-primary ml-1">*</span>
                                </label>
                                <input
                                    type="time"
                                    name="firstTime"
                                    value={formData.firstTime}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark"
                                    disabled={loading}
                                />
                            </div>

                            {numMeals >= 2 && (
                                <div>
                                    <label className="block text-sm font-medium text-text-dark mb-1">
                                        Segunda comida
                                    </label>
                                    <input
                                        type="time"
                                        name="secondTime"
                                        value={formData.secondTime}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark"
                                        disabled={loading}
                                    />
                                </div>
                            )}

                            {numMeals >= 3 && (
                                <div>
                                    <label className="block text-sm font-medium text-text-dark mb-1">
                                        Tercera comida
                                    </label>
                                    <input
                                        type="time"
                                        name="thirdTime"
                                        value={formData.thirdTime}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark"
                                        disabled={loading}
                                    />
                                </div>
                            )}

                            {numMeals >= 4 && (
                                <div>
                                    <label className="block text-sm font-medium text-text-dark mb-1">
                                        Cuarta comida
                                    </label>
                                    <input
                                        type="time"
                                        name="fourthTime"
                                        value={formData.fourthTime}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark"
                                        disabled={loading}
                                    />
                                </div>
                            )}

                        </div>
                    )}

                    {/* NOTAS */}
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">
                            Notas
                            <span className="text-text-light font-normal ml-1">(opcional)</span>
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark placeholder:text-text-light resize-none"
                            placeholder="Tipo de comida, cantidad, observaciones..."
                            rows={3}
                            disabled={loading}
                        />
                    </div>

                    {/* BOTONES */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? 'Guardando...'
                                : isEditing ? 'Guardar cambios' : 'Añadir rutina'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/meals')}
                            disabled={loading}
                            className="flex-1 bg-page-bg text-text-medium py-2.5 rounded-lg font-medium hover:bg-border transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default MealFormPage;