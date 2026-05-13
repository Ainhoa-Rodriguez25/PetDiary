import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import medicationService from '../../services/medicationService';
import householdService from '../../services/householdService';
import petService from '../../services/petService';

const FREQUENCY_OPTIONS = [
    { value: 'daily',       label: 'Una vez al día'    },
    { value: 'every_12h', label: 'Dos veces al día'  },
    { value: 'every_8h', label: 'Tres veces al día' },
    { value: 'weekly',      label: 'Semanal'           },
    { value: 'as_needed',   label: 'Según necesidad'   },
];

// Cuántas horas mostrar según la frecuencia
const timesForFrequency = {
    'daily':       1,
    'every_12h': 2,
    'every_8h': 3,
    'weekly':      1,
    'as_needed':   0,
};

function MedicationFormPage() {
    const { id } = useParams();
    const isEditing = !!id;

    // useSearchParams lee los parámetros de la URL
    // /medications/new?petId=5 → searchParams.get('petId') = "5"
    const [searchParams] = useSearchParams();

    const navigate  = useNavigate();
    const { user }  = useAuth();

    const [formData, setFormData] = useState({
        petId:      '',
        name:       '',
        dosage:     '',
        frequency:  '',
        timeOfDay:  '',
        secondTime: '',
        thirdTime:  '',
        startDate:  '',
        endDate:    '',
        notes:      '',
    });

    const [pets, setPets]           = useState([]);
    const [loading, setLoading]     = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [error, setError]         = useState('');

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoadingData(true);

                // Cargamos mascotas para el selector
                const householdsData = await householdService.getHouseholdByUser(user.id);
                if (householdsData && householdsData.length > 0) {
                    const petsData = await petService.getPetsByHousehold(householdsData[0].id);
                    setPets(petsData || []);

                    // Si viene petId en la URL lo preseleccionamos
                    const petIdFromUrl = searchParams.get('petId');
                    if (petIdFromUrl && !isEditing) {
                        setFormData(prev => ({ ...prev, petId: parseInt(petIdFromUrl) }));
                    } else if (!isEditing && petsData?.length > 0) {
                        setFormData(prev => ({ ...prev, petId: petsData[0].id }));
                    }
                }

                // Si estamos editando cargamos los datos del medicamento
                if (isEditing) {
                    const med = await medicationService.getMedicationById(id);
                    setFormData({
                        petId:      med.petId      || '',
                        name:       med.name       || '',
                        dosage:     med.dosage     || '',
                        frequency:  med.frequency  || '',
                        timeOfDay:  med.timeOfDay  || '',
                        secondTime: med.secondTime || '',
                        thirdTime:  med.thirdTime  || '',
                        startDate:  med.startDate  || '',
                        endDate:    med.endDate    || '',
                        notes:      med.notes      || '',
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

    // Cuando cambia la frecuencia limpiamos los horarios
    const handleFrequencyChange = (e) => {
        const frequency = e.target.value;
        setFormData(prev => ({
            ...prev,
            frequency,
            timeOfDay:  '',
            secondTime: '',
            thirdTime:  '',
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.petId) {
            setError('Selecciona una mascota');
            return;
        }
        if (!formData.name.trim()) {
            setError('El nombre del medicamento es obligatorio');
            return;
        }
        if (!formData.dosage.trim()) {
            setError('La dosis es obligatoria');
            return;
        }
        if (!formData.frequency) {
            setError('La frecuencia es obligatoria');
            return;
        }
        if (formData.frequency !== 'AS_NEEDED' && !formData.timeOfDay) {
            setError('La hora de la primera toma es obligatoria');
            return;
        }
        if (!formData.startDate) {
            setError('La fecha de inicio es obligatoria');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const medData = {
                petId:      parseInt(formData.petId),
                name:       formData.name.trim(),
                dosage:     formData.dosage.trim(),
                frequency:  formData.frequency,
                timeOfDay:  formData.timeOfDay  || null,
                secondTime: formData.secondTime || null,
                thirdTime:  formData.thirdTime  || null,
                startDate:  formData.startDate,
                endDate:    formData.endDate    || null,
                notes:      formData.notes.trim() || null,
            };

            if (isEditing) {
                await medicationService.updateMedication(id, medData);
            } else {
                await medicationService.createMedication(medData);
            }

            navigate('/medications');

        } catch (err) {
            const msg = err.response?.data?.message
                || err.response?.data
                || 'Error al guardar la medicación.';
            setError(typeof msg === 'string' ? msg : 'Error al guardar la medicación.');
            console.error('Error completo:', err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    // Cuántos campos de hora mostrar según la frecuencia seleccionada
    const numTimes = timesForFrequency[formData.frequency] ?? 0;

    if (loadingData) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <span className="text-4xl">💊</span>
                    <p className="text-text-medium mt-3">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-text-dark">
                    {isEditing ? 'Editar medicación' : 'Añadir medicación'}
                </h1>
                <p className="text-text-medium mt-1">
                    {isEditing
                        ? 'Modifica los datos del medicamento'
                        : 'Registra un nuevo medicamento'}
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
                        {/* En edición no se puede cambiar la mascota */}
                        {isEditing && (
                            <p className="text-xs text-text-light mt-1">
                                No se puede cambiar la mascota de un medicamento existente
                            </p>
                        )}
                    </div>

                    {/* NOMBRE */}
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">
                            Nombre del medicamento <span className="text-primary">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark placeholder:text-text-light"
                            placeholder="Ej: Apoquel, Amoxicilina..."
                            disabled={loading}
                        />
                    </div>

                    {/* DOSIS */}
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">
                            Dosis <span className="text-primary">*</span>
                        </label>
                        <input
                            type="text"
                            name="dosage"
                            value={formData.dosage}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark placeholder:text-text-light"
                            placeholder="Ej: 1 comprimido, 5ml, 2 gotas..."
                            disabled={loading}
                        />
                    </div>

                    {/* FRECUENCIA */}
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">
                            Frecuencia <span className="text-primary">*</span>
                        </label>
                        <select
                            name="frequency"
                            value={formData.frequency}
                            onChange={handleFrequencyChange}
                            className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark"
                            disabled={loading}
                        >
                            <option value="">Selecciona frecuencia...</option>
                            {FREQUENCY_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* HORARIOS — aparecen dinámicamente según la frecuencia */}
                    {numTimes >= 1 && (
                        <div className={`grid gap-4 ${numTimes > 1 ? 'grid-cols-' + numTimes : 'grid-cols-1'}`}>
                            <div>
                                <label className="block text-sm font-medium text-text-dark mb-1">
                                    {numTimes === 1 ? 'Hora de la toma' : 'Primera toma'} <span className="text-primary">*</span>
                                </label>
                                <input
                                    type="time"
                                    name="timeOfDay"
                                    value={formData.timeOfDay}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark"
                                    disabled={loading}
                                />
                            </div>

                            {numTimes >= 2 && (
                                <div>
                                    <label className="block text-sm font-medium text-text-dark mb-1">
                                        Segunda toma
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

                            {numTimes >= 3 && (
                                <div>
                                    <label className="block text-sm font-medium text-text-dark mb-1">
                                        Tercera toma
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
                        </div>
                    )}

                    {/* FECHAS */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1">
                                Fecha de inicio <span className="text-primary">*</span>
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark"
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1">
                                Fecha de fin
                                <span className="text-text-light font-normal ml-1">(opcional)</span>
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark"
                                disabled={loading}
                            />
                        </div>
                    </div>

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
                            placeholder="Observaciones sobre el medicamento..."
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
                                : isEditing ? 'Guardar cambios' : 'Añadir medicación'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/medications')}
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

export default MedicationFormPage;