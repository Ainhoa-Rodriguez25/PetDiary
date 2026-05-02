import {useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import petService from "../../services/petService";
import householdService from "../../services/householdService";
import PetCard from "../../components/pets/PetCard";

function PetsPage() {
    const { user } = useAuth();

    // Lista de mascotas obtenida del backend
    const [pets, setPets] = useState([]);

    // Hogar activo
    const [household, setHousehold] = useState(null);

    // Estados de UI
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError('');

                // 1. Se obtienen los hogares del usuario
                const households = await householdService.getHouseholdByUser(user.id);

                // Si no tiene hogares, no es posible cargar mascotas
                if (!households || !households.length === 0) {
                    setLoading(false);
                    return;
                }

                // Se usa el primer hogar como activo
                const activeHousehold = households[0];
                setHousehold(activeHousehold);

                // 2. Se obtienen las mascotas del hogar
                const petsData = await petService.getPetsByHousehold(activeHousehold.id);
                setPets(petsData);
            } catch (err) {
                setError('Error al cargar las mascotas. Inténtelo de nuevo.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        // Solo se carga si hay usuario con id
        if (user?.id) {
            loadData();
        }
    }, [user?.id]);

    // Función para eliminar una mascota
    const handleDelete = async (petId) => {
        try {
            await petService.deletePet(petId);
            setPets((prev) => prev.filter((p) => p.id !== petId));
        } catch (err) {
            setError('Error al eliminar la mascota. Inténtelo de nuevo.');
            console.error(err);
        }
    };

    // Estados de carga
    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <span className="text-4xl">🐾</span>
                    <p className="text-text-medium mt-3">Cargando mascotas...</p>
                </div>
            </div>
        );
    }

    // Si hay error se muestra mensaje
    if (error) {
        return (
            <div className="bg-primary-bg border border-border-dark text-primary px-4 py-3 rounded-lg">
                {error}
            </div>
        );
    }

    // Si no hay hogares, no se pueden tener mascotas
    if (!household) {
        return (
            <div className="text-center py-20">
                <span className="text-5xl">🏠</span>
                <h2 className="text-xl font-semibold text-text-dark mt-4 mb-2">
                    Necesitas un hogar primero
                </h2>
                <p className="text-text-medium mb-6">
                    Las mascotas pertenecen a un hogar. Crea uno para empezar.
                </p>
                <Link
                    to="/households/new"
                    className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-hover transition-colors font-medium"
                >
                    Crear hogar
                </Link>
            </div>
        );
    }

    // Renderizado principal
    return (
        <div>

            {/*Cabecera*/}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-dark">
                        Mis mascotas
                    </h1>
                    {/*Nombre del hogar activo*/}
                    <p className="text-text-medium mt-1">
                        Hogar: <span className="font-medium">{household.name}</span>
                    </p>
                </div>

                {/*Botón para añadir mascota nueva*/}
                <Link
                    to="/pets/new"
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium"
                >
                    + Añadir mascota
                </Link>
            </div>

            {/*Lista mascotas o mensaje vacío*/}
            {pets.length === 0 ? (

                // Estado vacío: no hay mascotas aún
                <div className="text-center py-20">
                    <span className="text-5xl">🐾</span>
                    <h2 className="text-xl font-semibold text-text-dark mt-4 mb-2">
                        Aún no tienes mascotas
                    </h2>
                    <p className="text-text-medium mb-6">
                        Añade tu primera mascota para empezar a gestionarla.
                    </p>
                    <Link
                        to="/pets/new"
                        className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-hover transition-colors font-medium"
                    >
                        Añadir mascota
                    </Link>
                </div>

            ) : (

                // Grid de tarjetas — 1 columna en móvil, 2 en tablet, 3 en escritorio
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pets.map((pet) => (
                        <PetCard
                            key={pet.id}
                            pet={pet}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>

            )}
        </div>
    );
}

export default PetsPage;