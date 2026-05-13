import { Link } from 'react-router-dom';

function HouseholdCard({ household, onDelete }) {
    return (
        <div className="bg-white rounded-xl border border-border p-5 flex flex-col gap-4 hover:border-border-dark transition-colors">

        {/* CABECERA */}
        <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-bg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🏠</span>
            </div>
            <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-text-dark text-lg leading-tight truncate">
                    {household.name}
                </h3>
                {/* Descripción opcional (solo se muestra si existe) */}
                {household.description && (
                    <p className="text-sm text-text-medium mt-0.5 truncate">
                        {household.description}
                    </p>
                )}
            </div>
        </div>

        {/* FECHA DE CREACIÓN */}
        <div className="flex flex-col">
            <span className="text-xs text-text-light">Creado el</span>
            <span className="text-sm font-medium text-text-dark">
                    {new Date(household.createdAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    })}
                </span>
        </div>

        {/* ACCIONES */}
        <div className="flex gap-2 pt-1 border-t border-border">
            <Link
                to={`/households/${household.id}`}
                className="flex-1 text-center text-sm text-primary hover:text-primary-hover font-medium py-1.5 rounded-lg hover:bg-primary-bg transition-colors"
            >
                Ver detalle
            </Link>
            <Link
                to={`/households/${household.id}/edit`}
                className="flex-1 text-center text-sm text-text-medium hover:text-text-dark font-medium py-1.5 rounded-lg hover:bg-page-bg transition-colors"
            >
                Editar
            </Link>
            <button
                onClick={() => {
                    if (window.confirm(`¿Eliminar el hogar "${household.name}"? Esta acción eliminará también todas las mascotas asociadas.`)) {
                        onDelete(household.id);
                    }
                }}
                className="flex-1 text-center text-sm text-red-400 hover:text-red-600 font-medium py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
                Eliminar
            </button>
        </div>

    </div>);
}

export default HouseholdCard;