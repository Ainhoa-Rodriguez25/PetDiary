import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import petService from '../../services/petService';

const getSpeciesEmoji = (species) => {
    const emojis = {
        'dog': '🐶', 'cat': '🐱', 'bird': '🐦',
        'rabbit': '🐰', 'fish': '🐟', 'hamster': '🐹',
        'reptile': '🦎', 'other': '🐾',
    };
    return emojis[species] || '🐾';
};

const genderLabel = {
    'male': 'Macho',
    'female': 'Hembra',
    'unknown': 'Desconocido',
};

const speciesLabel = {
    'dog':     'Perro',
    'cat':     'Gato',
    'bird':    'Pájaro',
    'rabbit':  'Conejo',
    'fish':    'Pez',
    'hamster': 'Hámster',
    'reptile': 'Reptil',
    'other':   'Otro',
}

const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    if (months < 0) { years--; months += 12; }
    if (years === 0) return `${months} ${months === 1 ? 'mes' : 'meses'}`;
    return `${years} ${years === 1 ? 'año' : 'años'}`;
};

// Formatea una fecha "2020-03-15" a "15 de marzo de 2020"
const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};


function PetDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadPet = async () => {
            try {
                setLoading(true);
                const data = await petService.getPetById(id);
                setPet(data);
            } catch (err) {
                setError('No se pudo cargar la mascota.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) loadPet();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm(`¿Eliminar a ${pet.name}? Esta acción no se puede deshacer.`)) {
            try {
                await petService.deletePet(id);
                navigate('/pets');
            } catch (err) {
                setError('Error al eliminar la mascota.');
                console.error(err);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <span className="text-4xl">🐾</span>
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

    if (!pet) return null;

    return (
        <div className="max-w-2xl mx-auto">

            {/*Botón volver*/}
            <button
                onClick={() => navigate('/pets')}
                className="flex items-center gap-2 text-text-medium hover:text-text-dark text-sm mb-6 transition-colors"
            >
                ← Volver a mascotas
            </button>

            {/*Cabecera*/}
            <div className="bg-white rounded-xl border border-border p-6 mb-4">
                <div className="flex items-start justify-between">

                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary-bg flex items-center justify-center flex-shrink-0">
                            <span className="text-3xl">
                                {getSpeciesEmoji(pet.species)}
                            </span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-text-dark">
                                {pet.name}
                            </h1>
                            <p className="text-text-medium mt-0.5">
                                {pet.breed?.name || pet.customBreed || speciesLabel[pet.species] || pet.species}
                            </p>
                        </div>
                    </div>

                    {/*Botones editar y eliminar*/}
                    <div className="flex gap-2">
                        <Link
                            to={`/pets/${pet.id}/edit`}
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

            {/*Datos principales*/}
            <div className="bg-white rounded-xl border border-border p-6 mb-4">
                <h2 className="text-sm font-semibold text-text-light uppercase tracking-wide mb-4">
                    Información general
                </h2>

                <div className="space-y-3">
                    <InfoRow label="Especie"   value={speciesLabel[pet.species] || pet.species}  />
                    <InfoRow label="Género"    value={pet.gender && pet.gender !== 'unknown' ? genderLabel[pet.gender] : null} />
                    <InfoRow label="Fecha de nacimiento" value={formatDate(pet.birthDate)} />
                    <InfoRow label="Edad"      value={calculateAge(pet.birthDate)} />
                    <InfoRow label="Peso"      value={pet.weight ? `${pet.weight} kg` : null} />
                </div>
            </div>

            {/*Datos médicos (solo si hay contenido)*/}
            {(pet.allergies || pet.medicalNotes) && (
                <div className="bg-white rounded-xl border border-border p-6">
                    <h2 className="text-sm font-semibold text-text-light uppercase tracking-wide mb-4">
                        Información médica
                    </h2>
                    <div className="space-y-3">
                        <InfoRow label="Alergias"      value={pet.allergies}    />
                        <InfoRow label="Notas médicas" value={pet.medicalNotes} />
                    </div>
                </div>
            )}

        </div>
    );
}

function InfoRow({ label, value }) {
    if (!value) return null;

    return (
        <div className="flex justify-between items-start py-2 border-b border-border last:border-0">
            {/* "last:border-0" elimina el borde de la última fila */}
            <span className="text-sm text-text-medium">{label}</span>
            <span className="text-sm font-medium text-text-dark text-right max-w-xs">
                {value}
            </span>
        </div>
    );
}

export default PetDetailPage;