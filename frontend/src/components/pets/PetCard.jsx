import { Link } from 'react-router-dom';

// Funcion auxiliar que devuelve la especie
const getSpeciesEmoji = (species) => {
    const emojis = {
        'DOG': '🐶',
        'CAT': '🐱',
        'BIRD': '🐦',
        'RABBIT': '🐰',
        'FISH': '🐟',
        'HAMSTER': '🐹',
        'REPTILE': '🦎',
        'OTHER': '🐾',
    };
    // Si especie no está, se devuelve emoji por defecto
    return emojis[species] || '🐾';
}

// Funcion auxiliar para calcular edad del animal a partir de fecha de nacimiento
const calculateAge = (birthDate) => {
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    const today = new Date();

    // Cálculo de diferencia en años
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();

    // Se ajusta si aún no se ha llegado a la fecha de cumpleaños del año en curso
    if (months < 0) {
        years--;
        months += 12;
    }

    if (years === 0) {
        return `${months} ${months === 1 ? 'mes' : 'meses'}`;
    }
    return `${years} ${years === 1 ? 'año' : 'años'}`;
};

// Función principal que recibe la mascota completa y una función onDelete
function PetCard({ pet, onDelete }) {
    return (
        <div className="bg-white rounded-xl border border-border p-5 flex flex-col gap-4 hover:border-border-dark transition-colors">

            {/*Cabecera (emoji + nombre + especie)*/}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary-bg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">
                            {getSpeciesEmoji(pet.species)}
                        </span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-text-dark text-lg leading-tight">
                            {pet.name}
                        </h3>
                        {/* Se muestra la raza si existe, si no la especie */}
                        <p className="text-sm text-text-medium">
                            {pet.breed?.name || pet.customBreed || pet.species}
                        </p>
                    </div>
                </div>
            </div>

            {/*Datos: edad y peso*/}
            <div className="flex gap-4">
                {pet.birthDate && (
                    <div className="flex flex-col">
                        <span className="text-xs text-text-light">Edad</span>
                        <span className="text-sm font-medium text-text-dark">
                            {calculateAge(pet.birthDate)}
                        </span>
                    </div>
                )}
                {pet.weight && (
                    <div className="flex flex-col">
                        <span className="text-xs text-text-light">Peso</span>
                        <span className="text-sm font-medium text-text-dark">
                            {pet.weight} kg
                        </span>
                    </div>
                )}
                {pet.gender && (
                    <div className="flex flex-col">
                        <span className="text-xs text-text-light">Género</span>
                        <span className="text-sm font-medium text-text-dark">
                            {pet.gender === 'MALE' ? 'Macho' : 'Hembra'}
                        </span>
                    </div>
                )}
            </div>

            {/*Acciones*/}
            <div className="flex gap-2 pt-1 border-t border-border">

                {/*Ver detalle (lleva a /pets/:id)*/}
                <Link
                    to={`/pets/${pet.id}`}
                    className="flex-1 text-center text-sm text-primary hover:text-primary-hover font-medium py-1.5 rounded-lg hover:bg-primary-bg transition-colors"
                >
                    Ver detalle
                </Link>

                {/*Editar (lleva a /pets/:id/edit)*/}
                <Link
                    to={`/pets/${pet.id}/edit`}
                    className="flex-1 text-center text-sm text-text-medium hover:text-text-dark font-medium py-1.5 rounded-lg hover:bg-page-bg transition-colors"
                >
                    Editar
                </Link>

                {/*Eliminar (llama a onDelete con confirmación)*/}
                <button
                    onClick={() => {
                        // window.confirm muestra un diálogo nativo del navegador.
                        // Si el usuario pulsa "Aceptar" devuelve true → se elimina.
                        // Si pulsa "Cancelar" devuelve false → no se hace nada.
                        if (window.confirm(`¿Eliminar a ${pet.name}?`)) {
                            onDelete(pet.id);
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

export default PetCard;