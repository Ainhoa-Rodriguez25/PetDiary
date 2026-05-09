import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import householdService from '../../services/householdService';
import HouseholdsPage from "./HouseholdsPage.jsx";

function HouseholdFormPage() {
    const { id } = useParams();
    const isEditing = !!id;

    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [error, setError] = useState('');

    // Si se está en modo edición, se cargan los datos del hogar
    useEffect(() => {
        const loadHousehold = async () => {
            try {
                setLoadingData(true);
                const data = await householdService.getHouseholdById(id);
                setFormData({
                    name: data.name || '',
                    description: data.description || '',
                });
            } catch (err) {
                setError('Error al cargar el hogar');
                console.error(err);
            } finally {
                setLoadingData(false);
            }
        };

        if (isEditing) loadHousehold();
    }, [id, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setError('El nombre del hogar es obligatorio');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const householdData = {
                name: formData.name.trim(),
                description: formData.description.trim() || null,
            };

            if (isEditing) {
                await householdService.updateHousehold(id, user.id, householdData);
            } else {
                await householdService.createHousehold(user.id, householdData);
            }

            navigate('/households');
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data || 'Error al guardar el hogar.';
            setError(typeof msg === 'string' ? msg : 'Error al guardar el hogar');
            console.error('Error completo:', err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <span className="text-4xl">🏠</span>
                    <p className="text-text-medium mt-3">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">

            {/* CABECERA */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-text-dark">
                    {isEditing ? 'Editar hogar' : 'Crear hogar'}
                </h1>
                <p className="text-text-medium mt-1">
                    {isEditing
                        ? 'Modifica los datos de tu hogar'
                        : 'Crea un hogar para gestionar tus mascotas'}
                </p>
            </div>

            <div className="bg-white rounded-xl border border-border p-6">

                {error && (
                    <div className="bg-primary-bg border border-border-dark text-primary px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* NOMBRE */}
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
                            placeholder="Ej: Mi hogar, Casa de la playa..."
                            disabled={loading}
                        />
                    </div>

                    {/* DESCRIPCIÓN */}
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">
                            Descripción
                            <span className="text-text-light font-normal ml-1">(opcional)</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark placeholder:text-text-light resize-none"
                            placeholder="Descripción del hogar..."
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
                                : isEditing ? 'Guardar cambios' : 'Crear hogar'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/households')}
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

export default HouseholdFormPage;