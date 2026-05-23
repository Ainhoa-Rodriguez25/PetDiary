import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import petService from "../../services/petService.js";
import householdService from "../../services/householdService.js";
import PetsPage from "./PetsPage.jsx";

const SPECIES_OPTIONS = [
    { value: 'dog',     label: '🐶 Perro'   },
    { value: 'cat',     label: '🐱 Gato'    },
    { value: 'bird',    label: '🐦 Pájaro'  },
    { value: 'rabbit',  label: '🐰 Conejo'  },
    { value: 'fish',    label: '🐟 Pez'     },
    { value: 'hamster', label: '🐹 Hámster' },
    { value: 'reptile', label: '🦎 Reptil'  },
    { value: 'other',   label: '🐾 Otro'    },
];

const GENDER_OPTIONS = [
    { value: 'male',   label: 'Macho'  },
    { value: 'female', label: 'Hembra' },
    { value: 'unknown', label: 'Desconocido' },
];

function PetFormPage() {
    const { id } = useParams();
    const isEditing = !!id;

    const navigate = useNavigate();
    const { user } = useAuth();

    // Estados del formulario
    const [formData, setFormData] = useState({
        householdId: '',
        name: '',
        species: '',
        breedId: '',
        customBreed: '',
        birthDate: '',
        weight: '',
        gender: '',
        allergies: '',
        medicalNotes: '',
    });

    // Lista de razas (se carga cuando usuario selecciona especie)
    const [breeds, setBreeds] = useState([]);

    // Primer hogar del usuario
    const [households, setHouseholds] = useState([]);
    const [household, setHousehold] = useState(null);

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [error, setError] = useState('');

    // Carga inicial
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoadingData(true);

                const householdsData = await householdService.getHouseholdByUser(user.id);

                if (householdsData && householdsData.length > 0) {
                    setHouseholds(householdsData);

                    // Si se está creando, ya es posible poner el householdId
                    if (!isEditing) {
                        // Por defecto el primer hogar
                        setHousehold(householdsData[0]);
                        setFormData((prev) => ({
                            ...prev,
                            householdId: householdsData[0].id,
                        }));
                    } else {
                        // En edición, se busca el hogar al que corresponde la mascota
                        const currentHousehold = householdsData.find((h) => h.id === formData.householdId);
                        setHousehold(currentHousehold || householdsData[0]);
                    }
                }

                // Si se está editando, se cargan los datos de la mascota
                if (isEditing) {
                    const pet = await petService.getPetById(id);
                    setFormData({
                        householdId: pet.householdId || '',
                        name: pet.name || '',
                        species: pet.species || '',
                        breedId: pet.breed?.id || '',
                        customBreed: pet.customBreed || '',
                        birthDate: pet.birthDate || '',
                        weight: pet.weight || '',
                        gender: pet.gender || '',
                        allergies: pet.allergies || '',
                        medicalNotes: pet.medicalNotes || '',
                    });

                    // Si tiene especio, se cargan las razas correspondiente
                    if (pet.species) {
                        const breedsData = await petService.getBreeds(pet.species);
                        setBreeds(breedsData);
                    }
                }
            } catch (err) {
                console.error('Error en loadInitialData:', err)
                setError('Error al cargar los datos: ' + (err.message || 'desconocido'));
            } finally {
                setLoadingData(false);
            }
        };

        if (user?.id) {
            loadInitialData();
        }
    }, [user?.id, id, isEditing]);


    // Manejador genérico de cambios
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Manejador de cambio de especie
    const handleSpeciesChange = async (e) => {
        const species = e.target.value;
        setFormData((prev) => ({ ...prev, species, breedId: '', customBreed: '' }));

        if (species) {
            try {
                const breedsData = await petService.getBreeds(species);
                setBreeds(breedsData);
            } catch (err) {
                console.error('Error al cargar las razas:', err);
            }
        } else {
            setBreeds([]);
        }
    };


    // Envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('household:', households);
        console.log('formData:', formData);

        // Validaciones básicas
        if (!formData.name.trim()) {
            setError('El nombre es obligatorio');
            return;
        }

        if (!formData.species) {
            setError('La especie es obligatoria');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const petData = {
                householdId: household?.id,
                name: formData.name.trim(),
                species: formData.species,
                breedId: formData.breedId && formData.breedId !== 'custom' ? parseInt(formData.breedId) : null,
                customBreed: formData.customBreed.trim() || null,
                birthDate: formData.birthDate || null,
                weight: formData.weight ? parseFloat(formData.weight) : null,
                gender: formData.gender || null,
                allergies: formData.allergies.trim() || null,
                medicalNotes: formData.medicalNotes.trim() || null,
            };

            if (isEditing) {
                await petService.updatePet(id, petData);
            } else {
                await petService.createPet(petData);
            }

            // Tras guardar, se vuelve a lista de mascotas
            navigate('/pets');
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data || 'Error al guardar la mascota.';
            setError(typeof msg === 'string' ? msg : 'Error al guardar la mascota.');
            console.error('Error completo:', err.response?.data);
        } finally {
            setLoading(false);
        }
    };


    // Estado de carga inicial
    if (loadingData) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <span className="text-4xl">🐾</span>
                    <p className="text-text-medium mt-3">Cargando...</p>
                </div>
            </div>
        );
    }


    // Renderizado del formulario
    return (
        <div className="max-w-2xl mx-auto">

            {/* CABECERA */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-text-dark">
                    {isEditing ? 'Editar mascota' : 'Añadir mascota'}
                </h1>
                <p className="text-text-medium mt-1">
                    {isEditing
                        ? 'Modifica los datos de tu mascota'
                        : 'Rellena los datos de tu nueva mascota'}
                </p>
            </div>

            <div className="bg-white rounded-xl border border-border p-6">

                {error && (
                    <div className="bg-primary-bg border border-border-dark text-primary px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/*Nombre*/}
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">
                            Nombre <span className="text-primary">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark placeholder:text-text-light"
                            placeholder="Nombre de tu mascota"
                            disabled={loading}
                        />
                    </div>

                    {/*Especie y género*/}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1">
                                Especie <span className="text-primary">*</span>
                            </label>
                            {/*Select controlado (tiene propio manejador
                                porque también carga las razas)*/}
                            <select
                                name="species"
                                value={formData.species}
                                onChange={handleSpeciesChange}
                                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark"
                                disabled={loading}
                            >
                                <option value="">Selecciona...</option>
                                {SPECIES_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1">
                                Género
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark"
                                disabled={loading}
                            >
                                <option value="">Selecciona...</option>
                                {GENDER_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/*Raza (solo aparece si hay especie seleccionada)*/}
                    {formData.species && (
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1">
                                Raza
                            </label>
                            {breeds.length > 0 ? (
                                <select
                                    name="breedId"
                                    value={formData.breedId}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark"
                                    disabled={loading}
                                >
                                    <option value="">Sin raza específica</option>
                                    {breeds.map((breed) => (
                                        <option key={breed.id} value={breed.id}>
                                            {breed.name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                // Si no hay razas en BD para esa especie,
                                // permitimos entrada libre
                                <input
                                    type="text"
                                    name="customBreed"
                                    value={formData.customBreed}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark placeholder:text-text-light"
                                    placeholder="Escribe la raza"
                                    disabled={loading}
                                />
                            )}
                        </div>
                    )}

                    {/*Fecha de nacimiento y Peso*/}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1">
                                Fecha de nacimiento
                            </label>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1">
                                Peso (kg)
                            </label>
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark placeholder:text-text-light"
                                placeholder="0.0"
                                step="0.1"
                                min="0"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* HOGAR */}
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">
                            Hogar <span className="text-primary">*</span>
                        </label>
                        <select
                            name="householdId"
                            value={formData.householdId}
                            onChange={(e) => {
                                // Actualizamos householdId en formData Y el hogar activo
                                const selected = households.find(
                                    (h) => h.id === parseInt(e.target.value)
                                );
                                setHousehold(selected || null);
                                setFormData((prev) => ({
                                    ...prev,
                                    householdId: parseInt(e.target.value),
                                }));
                            }}
                            className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark"
                            disabled={loading}
                        >
                            <option value="">Selecciona un hogar...</option>
                            {households.map((h) => (
                                <option key={h.id} value={h.id}>
                                    🏠 {h.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/*Alergias*/}
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">
                            Alergias
                        </label>
                        <input
                            type="text"
                            name="allergies"
                            value={formData.allergies}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark placeholder:text-text-light"
                            placeholder="Ej: Polen, alimentos específicos..."
                            disabled={loading}
                        />
                    </div>

                    {/*Notas médicas*/}
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">
                            Notas médicas
                        </label>
                        {/* textarea para texto largo */}
                        <textarea
                            name="medicalNotes"
                            value={formData.medicalNotes}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark placeholder:text-text-light resize-none"
                            placeholder="Observaciones médicas relevantes..."
                            rows={3}
                            disabled={loading}
                        />
                    </div>

                    {/*Botones*/}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? 'Guardando...'
                                : isEditing ? 'Guardar cambios' : 'Añadir mascota'}
                        </button>

                        {/*Botón cancelar*/}
                        <button
                            type="button"
                            onClick={() => navigate('/pets')}
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

export default PetFormPage;