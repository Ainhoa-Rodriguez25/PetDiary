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

function WalkCard({ walk, onDelete }) {
    return (
        <div className="bg-white rounded-xl border border-border p-5 flex flex-col gap-4 hover:border-border-dark transition-colors">

            {/* CABECERA */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary-bg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🏃</span>
                    </div>
                    <div>
                        <p className="font-semibold text-text-dark">
                            {formatDateTime(walk.walkedAt)}
                        </p>
                        <p className="text-sm text-text-medium">
                            {walk.walkedByUserName || 'Usuario desconocido'}
                        </p>
                    </div>
                </div>

                {/* Duración */}
                {walk.duration && (
                    <div className="flex flex-col items-end flex-shrink-0">
                        <span className="text-2xl font-bold text-primary">
                            {walk.duration}
                        </span>
                        <span className="text-xs text-text-light">min</span>
                    </div>
                )}
            </div>

            {/* BADGES pipí y caca */}
            {(walk.hadPee || walk.hadPoop) && (
                <div className="flex gap-2">
                    {walk.hadPee && (
                        <span className="flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-500">
                            💧 Pipí
                        </span>
                    )}
                    {walk.hadPoop && (
                        <span className="flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-amber-50 text-amber-600">
                            💩 Caca
                        </span>
                    )}
                </div>
            )}

            {/* NOTAS */}
            {walk.notes && (
                <p className="text-sm text-text-medium bg-page-bg rounded-lg px-3 py-2">
                    {walk.notes}
                </p>
            )}

            {/* ELIMINAR */}
            <div className="pt-1 border-t border-border">
                <button
                    onClick={() => {
                        if (window.confirm('¿Eliminar este paseo?')) {
                            onDelete(walk.id);
                        }
                    }}
                    className="w-full text-center text-sm text-red-400 hover:text-red-600 font-medium py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                >
                    Eliminar
                </button>
            </div>

        </div>
    );
}

export default WalkCard;