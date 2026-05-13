import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import medicationService from '../../services/medicationService';

const frequencyLabel = {
    'daily':       'Una vez al día',
    'every_12h': 'Dos veces al día',
    'every_8h': 'Tres veces al día',
    'weekly':      'Semanal',
    'as_needed':   'Según necesidad',
};

const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

const formatDateTime = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

function MedicationDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [medication, setMedication] = useState(null);
    const [history, setHistory]       = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState('');

    // Estado del modal de registro de toma
    const [showLogForm, setShowLogForm] = useState(false);
    const [logNotes, setLogNotes]       = useState('');
    const [logLoading, setLogLoading]   = useState(false);
    const [logError, setLogError]       = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError('');

                const [medData, historyData] = await Promise.all([
                    medicationService.getMedicationById(id),
                    medicationService.getMedicationHistory(id),
                ]);

                setMedication(medData);
                setHistory(historyData || []);

            } catch (err) {
                setError('No se pudo cargar el medicamento.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) loadData();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm(`¿Eliminar el medicamento "${medication.name}"?`)) {
            try {
                await medicationService.deleteMedication(id);
                navigate('/medications');
            } catch (err) {
                setError('Error al eliminar el medicamento.');
                console.error(err);
            }
        }
    };

    const handleLogSubmit = async (e) => {
        e.preventDefault();
        try {
            setLogLoading(true);
            setLogError('');

            const newLog = await medicationService.logMedication(id, {
                notes: logNotes.trim() || null,
            });

            const logWithUser = {
                ...newLog,
                givenByUserName: newLog.givenByUserName || user.name,
                givenByUserId:   newLog.givenByUserId   || user.id,
            };

            // Añadimos la toma al inicio del historial sin recargar
            setHistory(prev => [logWithUser, ...prev]);
            setLogNotes('');
            setShowLogForm(false);

        } catch (err) {
            setLogError('Error al registrar la toma.');
            console.error(err);
        } finally {
            setLogLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <span className="text-4xl">💊</span>
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

    if (!medication) return null;

    const isActive = medication.active !== false;

    return (
        <div className="max-w-2xl mx-auto">

            {/* MODAL DE REGISTRO DE TOMA */}
            {showLogForm && (
                <div
                    className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4"
                    onClick={() => setShowLogForm(false)}
                >
                    <div
                        className="bg-white rounded-2xl border border-border p-6 w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-text-dark">
                                Registrar toma
                            </h2>
                            <button
                                onClick={() => setShowLogForm(false)}
                                className="text-text-light hover:text-text-dark transition-colors text-xl leading-none"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleLogSubmit} className="space-y-4">
                            {logError && (
                                <div className="bg-primary-bg border border-border-dark text-primary px-4 py-3 rounded-lg text-sm">
                                    {logError}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-text-dark mb-1">
                                    Notas
                                    <span className="text-text-light font-normal ml-1">(opcional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={logNotes}
                                    onChange={(e) => setLogNotes(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark placeholder:text-text-light"
                                    placeholder="Ej: Tomó la pastilla con comida..."
                                    disabled={logLoading}
                                />
                            </div>

                            <p className="text-xs text-text-light">
                                Se registrará con la fecha y hora actual
                            </p>

                            <button
                                type="submit"
                                disabled={logLoading}
                                className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {logLoading ? 'Registrando...' : 'Registrar toma'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* BOTÓN VOLVER */}
            <button
                onClick={() => navigate('/medications')}
                className="flex items-center gap-2 text-text-medium hover:text-text-dark text-sm mb-6 transition-colors"
            >
                ← Volver a medicaciones
            </button>

            {/* CABECERA */}
            <div className="bg-white rounded-xl border border-border p-6 mb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary-bg flex items-center justify-center flex-shrink-0">
                            <span className="text-3xl">💊</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold text-text-dark">
                                    {medication.name}
                                </h1>
                                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                                    isActive
                                        ? 'bg-accent-bg text-accent'
                                        : 'bg-page-bg text-text-light'
                                }`}>
                                    {isActive ? 'Activo' : 'Finalizado'}
                                </span>
                            </div>
                            <p className="text-text-medium mt-0.5">{medication.dosage}</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            to={`/medications/${medication.id}/edit`}
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

            {/* INFORMACIÓN */}
            <div className="bg-white rounded-xl border border-border p-6 mb-4">
                <h2 className="text-sm font-semibold text-text-light uppercase tracking-wide mb-4">
                    Información del medicamento
                </h2>
                <div className="space-y-3">
                    {medication.frequency && (
                        <div className="flex justify-between items-start py-2 border-b border-border">
                            <span className="text-sm text-text-medium">Frecuencia</span>
                            <span className="text-sm font-medium text-text-dark">
                                {frequencyLabel[medication.frequency] || medication.frequency}
                            </span>
                        </div>
                    )}
                    {medication.timeOfDay && (
                        <div className="flex justify-between items-start py-2 border-b border-border">
                            <span className="text-sm text-text-medium">Horario</span>
                            <span className="text-sm font-medium text-text-dark">
                                {medication.timeOfDay}
                                {medication.secondTime && ` · ${medication.secondTime}`}
                                {medication.thirdTime  && ` · ${medication.thirdTime}`}
                            </span>
                        </div>
                    )}
                    {medication.startDate && (
                        <div className="flex justify-between items-start py-2 border-b border-border">
                            <span className="text-sm text-text-medium">Inicio</span>
                            <span className="text-sm font-medium text-text-dark">
                                {formatDate(medication.startDate)}
                            </span>
                        </div>
                    )}
                    {medication.endDate && (
                        <div className="flex justify-between items-start py-2 border-b border-border">
                            <span className="text-sm text-text-medium">Fin</span>
                            <span className="text-sm font-medium text-text-dark">
                                {formatDate(medication.endDate)}
                            </span>
                        </div>
                    )}
                    {medication.notes && (
                        <div className="flex justify-between items-start py-2">
                            <span className="text-sm text-text-medium">Notas</span>
                            <span className="text-sm font-medium text-text-dark text-right max-w-xs">
                                {medication.notes}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* HISTORIAL DE TOMAS */}
            <div className="bg-white rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-text-light uppercase tracking-wide">
                        Historial de tomas
                    </h2>
                    {isActive && (
                        <button
                            onClick={() => setShowLogForm(true)}
                            className="text-sm text-primary hover:text-primary-hover font-medium"
                        >
                            + Registrar toma
                        </button>
                    )}
                </div>

                {history.length === 0 ? (
                    <div className="text-center py-8">
                        <span className="text-3xl">📋</span>
                        <p className="text-text-medium text-sm mt-2">
                            Aún no hay tomas registradas
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {history.map((log) => (
                            <div
                                key={log.id}
                                className="flex items-start justify-between py-2 border-b border-border last:border-0"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary-bg border border-border-dark flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-medium text-primary">
                                            {log.givenByUserName
                                                ? log.givenByUserName.split(' ').map(n => n[0]).join('').toUpperCase()
                                                : '?'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-text-dark">
                                            {log.givenByUserName}
                                            {log.givenByUserId === user.id && (
                                                <span className="text-text-light font-normal ml-1">(tú)</span>
                                            )}
                                        </p>
                                        {log.notes && (
                                            <p className="text-xs text-text-medium mt-0.5">
                                                {log.notes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <span className="text-xs text-text-light flex-shrink-0 mt-0.5">
                                    {formatDateTime(log.givenAt)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}

export default MedicationDetailPage;