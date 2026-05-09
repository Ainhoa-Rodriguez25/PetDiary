import {useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth} from "../../hooks/useAuth.js";
import householdService from "../../services/householdService.js";
import HouseholdCard from "../../components/households/HouseholdCard.jsx";

function HouseholdsPage() {
    const { user } = useAuth();

    const [households, setHouseholds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadHouseholds = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await householdService.getHouseholdByUser(user.id);
                setHouseholds(data || []);
            } catch (err) {
                setError('Error al cargar los hogares. Inténtelo de nuevo.');
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) loadHouseholds();
    }, [user?.id]);

    const handleDelete = async (householdId) => {
        try {
            await householdService.deleteHousehold(user.id);
            setHouseholds((prev) => prev.filter((h) => h.id !== householdId));
        } catch (err) {
            setError('Error al eliminar el hogar. Inténtelo de nuevo.');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <span className="text-4xl">🏠</span>
                    <p className="text-text-medium mt-3">Cargando hogares...</p>
                </div>
            </div>
        );
    }

    return (
        <div>

            {/* CABECERA */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-dark">
                        Mis hogares
                    </h1>
                    <p className="text-text-medium mt-1">
                        Gestiona los hogares y sus miembros
                    </p>
                </div>
                <Link
                    to="/households/new"
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium"
                >
                    + Crear hogar
                </Link>
            </div>

            {/* ERROR */}
            {error && (
                <div className="bg-primary-bg border border-border-dark text-primary px-4 py-3 rounded-lg mb-6 text-sm">
                    {error}
                </div>
            )}

            {/* LISTA O ESTADO VACÍO */}
            {households.length === 0 ? (
                <div className="text-center py-20">
                    <span className="text-5xl">🏠</span>
                    <h2 className="text-xl font-semibold text-text-dark mt-4 mb-2">
                        Aún no tienes hogares
                    </h2>
                    <p className="text-text-medium mb-6">
                        Crea un hogar para empezar a gestionar tus mascotas.
                    </p>
                    <Link
                        to="/households/new"
                        className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-hover transition-colors font-medium"
                    >
                        Crear primer hogar
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {households.map((household) => (
                        <HouseholdCard
                            key={household.id}
                            household={household}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

        </div>
    );
}

export default HouseholdsPage;