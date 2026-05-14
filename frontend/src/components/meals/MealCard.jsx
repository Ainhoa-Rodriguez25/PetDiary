import { Link } from 'react-router-dom';

// Traduce mealsPerDay a texto legible
const mealsPerDayLabel = {
    '1': 'Una vez al día',
    '2': 'Dos veces al día',
    '3': 'Tres veces al día',
    '4': 'Cuatro veces al día',
};

function MealCard({ meal, onDelete }) {
    const isActive = meal.active !== false;

    return (
        <div className={`bg-white rounded-xl border p-5 flex flex-col gap-4 transition-colors ${
            isActive
                ? 'border-border hover:border-border-dark'
                : 'border-border opacity-60'
        }`}>

            {/* CABECERA */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary-bg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🍽️</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-text-dark text-lg leading-tight">
                            {mealsPerDayLabel[meal.mealsPerDay] || `${meal.mealsPerDay} comidas al día`}
                        </h3>
                        {/* Horarios de comida */}
                        <p className="text-sm text-text-medium">
                            {[meal.firstTime, meal.secondTime, meal.thirdTime, meal.fourthTime]
                                .filter(Boolean)
                                .join(' · ')}
                        </p>
                    </div>
                </div>

                {/* Badge activo/inactivo */}
                <span className={`text-xs font-medium px-3 py-1 rounded-full flex-shrink-0 ${
                    isActive
                        ? 'bg-accent-bg text-accent'
                        : 'bg-page-bg text-text-light'
                }`}>
                    {isActive ? 'Activa' : 'Inactiva'}
                </span>
            </div>

            {/* NOTAS */}
            {meal.notes && (
                <p className="text-sm text-text-medium bg-page-bg rounded-lg px-3 py-2">
                    {meal.notes}
                </p>
            )}

            {/* ACCIONES */}
            <div className="flex gap-2 pt-1 border-t border-border">
                <Link
                    to={`/meals/${meal.id}`}
                    className="flex-1 text-center text-sm text-primary hover:text-primary-hover font-medium py-1.5 rounded-lg hover:bg-primary-bg transition-colors"
                >
                    Ver detalle
                </Link>
                <Link
                    to={`/meals/${meal.id}/edit`}
                    className="flex-1 text-center text-sm text-text-medium hover:text-text-dark font-medium py-1.5 rounded-lg hover:bg-page-bg transition-colors"
                >
                    Editar
                </Link>
                <button
                    onClick={() => {
                        if (window.confirm('¿Eliminar esta rutina de comidas?')) {
                            onDelete(meal.id);
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

export default MealCard;