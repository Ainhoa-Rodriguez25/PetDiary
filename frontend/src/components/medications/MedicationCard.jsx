import { Link } from 'react-router-dom';

// Traduce la frecuencia del backend a texto legible
const frequencyLabel = {
    'daily':       'Una vez al día',
    'every_12h': 'Dos veces al día',
    'every_8h': 'Tres veces al día',
    'weekly':      'Semanal',
    'as_needed':   'Según necesidad',
};

// Formatea una fecha string a formato legible
const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

function MedicationCard({ medication, onDelete }) {

    // Determinamos si la medicación está activa o ha terminado
    const isActive = medication.active !== false;

    return (
        <div className={`bg-white rounded-xl border p-5 flex flex-col gap-4 transition-colors ${
            isActive
                ? 'border-border hover:border-border-dark'
                : 'border-border opacity-60'  // Medicaciones inactivas aparecen más apagadas
        }`}>

            {/* CABECERA */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-primary-bg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">💊</span>
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-semibold text-text-dark text-lg leading-tight truncate">
                            {medication.name}
                        </h3>
                        <p className="text-sm text-text-medium truncate">
                            {medication.dosage}
                        </p>
                    </div>
                </div>

                <span className={`text-xs font-medium px-3 py-1 rounded-full flex-shrink-0 ${
                    isActive
                        ? 'bg-accent-bg text-accent'
                        : 'bg-page-bg text-text-light'
                }`}>
                    {isActive ? 'Activo' : 'Finalizado'}
                </span>
            </div>

            {/* DATOS */}
            <div className="flex flex-wrap gap-4">
                {medication.frequency && (
                    <div className="flex flex-col">
                        <span className="text-xs text-text-light">Frecuencia</span>
                        <span className="text-sm font-medium text-text-dark">
                            {frequencyLabel[medication.frequency] || medication.frequency}
                        </span>
                    </div>
                )}
                {medication.startDate && (
                    <div className="flex flex-col">
                        <span className="text-xs text-text-light">Inicio</span>
                        <span className="text-sm font-medium text-text-dark">
                            {formatDate(medication.startDate)}
                        </span>
                    </div>
                )}
                {medication.endDate && (
                    <div className="flex flex-col">
                        <span className="text-xs text-text-light">Fin</span>
                        <span className="text-sm font-medium text-text-dark">
                            {formatDate(medication.endDate)}
                        </span>
                    </div>
                )}
            </div>

            {/* ACCIONES */}
            <div className="flex gap-2 pt-1 border-t border-border">
                <Link
                    to={`/medications/${medication.id}`}
                    className="flex-1 text-center text-sm text-primary hover:text-primary-hover font-medium py-1.5 rounded-lg hover:bg-primary-bg transition-colors"
                >
                    Ver detalle
                </Link>
                <Link
                    to={`/medications/${medication.id}/edit`}
                    className="flex-1 text-center text-sm text-text-medium hover:text-text-dark font-medium py-1.5 rounded-lg hover:bg-page-bg transition-colors"
                >
                    Editar
                </Link>
                <button
                    onClick={() => {
                        if (window.confirm(`¿Eliminar el medicamento "${medication.name}"?`)) {
                            onDelete(medication.id);
                        }
                    }}
                    className="flex-1 text-center text-sm text-red-400 hover:text-red-600 font-medium py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                >
                    Eliminar
                </button>
            </div>

        </div>
    );
}

export default MedicationCard;