import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import walkService from '../../services/walkService';
import householdService from '../../services/householdService';
import petService from '../../services/petService';
import WalkCard from '../../components/walks/WalkCard';

function WalksPage() {
    const { user } = useAuth();

    const [walks, setWalks]             = useState([]);
    const [pets, setPets]               = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);
    const [loading, setLoading]         = useState(true);
    const [loadingWalks, setLoadingWalks] = useState(false);
    const [error, setError]             = useState('');

    // Estado del modal
    const [showModal, setShowModal]   = useState(false);
    const [walkForm, setWalkForm]     = useState({
        duration: '',
        hadPee:   false,
        hadPoop:  false,
        notes:    '',
    });
    const [walkLoading, setWalkLoading] = useState(false);
    const [walkError, setWalkError]     = useState('');

    const loadWalks = async (petId) => {
        try {
            setLoadingWalks(true);
            const data = await walkService.getWalksByPet(petId);
            setWalks(data || []);
        } catch (err) {
            setError('Error al cargar los paseos.');
            console.error(err);
        } finally {
            setLoadingWalks(false);
        }
    };

    useEffect(() => {
        const loadPets = async () => {
            try {
                setLoading(true);
                setError('');

                const householdsData = await householdService.getHouseholdByUser(user.id);

                if (!householdsData || householdsData.length === 0) {
                    setLoading(false);
                    return;
                }

                const petsArrays = await Promise.all(
                    householdsData.map(h => petService.getPetsByHousehold(h.id))
                );
                const allPets = petsArrays.flat();
                setPets(allPets);

                if (allPets.length > 0) {
                    setSelectedPet(allPets[0]);
                    await loadWalks(allPets[0].id);
                }

            } catch (err) {
                setError('Error al cargar los datos.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) loadPets();
    }, [user?.id]);

    const handleDelete = async (walkId) => {
        try {
            await walkService.deleteWalk(walkId);
            setWalks(prev => prev.filter(w => w.id !== walkId));
        } catch (err) {
            setError('Error al eliminar el paseo.');
            console.error(err);
        }
    };

    const handleWalkSubmit = async (e) => {
        e.preventDefault();
        try {
            setWalkLoading(true);
            setWalkError('');

            const newWalk = await walkService.createWalk({
                petId:    selectedPet.id,
                duration: walkForm.duration || null,
                hadPee:   walkForm.hadPee,
                hadPoop:  walkForm.hadPoop,
                notes:    walkForm.notes.trim() || null,
            });

            const walkWithUser = {
                ...newWalk,
                walkedByUserName: newWalk.walkedByUserName || user.name,
                walkedByUserId:   newWalk.walkedByUserId   || user.id,
            };

            setWalks(prev => [walkWithUser, ...prev]);
            setWalkForm({ duration: '', hadPee: false, hadPoop: false, notes: '' });
            setShowModal(false);

        } catch (err) {
            setWalkError('Error al registrar el paseo.');
            console.error(err);
        } finally {
            setWalkLoading(false);
        }
    };

    const getSpeciesEmoji = (species) => {
        const emojis = {
            'dog': '🐶', 'cat': '🐱', 'bird': '🐦',
            'rabbit': '🐰', 'fish': '🐟', 'hamster': '🐹',
            'reptile': '🦎', 'other': '🐾',
        };
        return emojis[species] || '🐾';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <span className="text-4xl">🏃</span>
                    <p className="text-text-medium mt-3">Cargando paseos...</p>
                </div>
            </div>
        );
    }

    if (pets.length === 0) {
        return (
            <div className="text-center py-20">
                <span className="text-5xl">🐾</span>
                <h2 className="text-xl font-semibold text-text-dark mt-4 mb-2">
                    Necesitas mascotas primero
                </h2>
                <p className="text-text-medium">
                    Añade una mascota antes de registrar paseos.
                </p>
            </div>
        );
    }

    return (
        <div>

            {/* MODAL DE REGISTRO DE PASEO */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl border border-border p-6 w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-text-dark">
                                Registrar paseo — {selectedPet?.name}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-text-light hover:text-text-dark transition-colors text-xl leading-none"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleWalkSubmit} className="space-y-4">
                            {walkError && (
                                <div className="bg-primary-bg border border-border-dark text-primary px-4 py-3 rounded-lg text-sm">
                                    {walkError}
                                </div>
                            )}

                            {/* DURACIÓN */}
                            <div>
                                <label className="block text-sm font-medium text-text-dark mb-1">
                                    Duración (minutos)
                                    <span className="text-text-light font-normal ml-1">(opcional)</span>
                                </label>
                                <input
                                    type="number"
                                    value={walkForm.duration}
                                    onChange={(e) => setWalkForm(prev => ({ ...prev, duration: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark placeholder:text-text-light"
                                    placeholder="Ej: 30"
                                    min="1"
                                    disabled={walkLoading}
                                />
                            </div>

                            {/* CHECKBOXES — pipi y caca */}
                            <div className="bg-page-bg rounded-lg p-4 space-y-3">
                                <p className="text-sm font-medium text-text-dark mb-2">
                                    Durante el paseo:
                                </p>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={walkForm.hadPee}
                                        onChange={(e) => setWalkForm(prev => ({ ...prev, hadPee: e.target.checked }))}
                                        className="w-4 h-4 accent-primary"
                                        disabled={walkLoading}
                                    />
                                    <span className="text-sm text-text-dark">
                                        💧 Hizo pipí
                                    </span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={walkForm.hadPoop}
                                        onChange={(e) => setWalkForm(prev => ({ ...prev, hadPoop: e.target.checked }))}
                                        className="w-4 h-4 accent-primary"
                                        disabled={walkLoading}
                                    />
                                    <span className="text-sm text-text-dark">
                                        💩 Hizo caca
                                    </span>
                                </label>
                            </div>

                            {/* NOTAS */}
                            <div>
                                <label className="block text-sm font-medium text-text-dark mb-1">
                                    Notas
                                    <span className="text-text-light font-normal ml-1">(opcional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={walkForm.notes}
                                    onChange={(e) => setWalkForm(prev => ({ ...prev, notes: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark placeholder:text-text-light"
                                    placeholder="Observaciones del paseo..."
                                    disabled={walkLoading}
                                />
                            </div>

                            <p className="text-xs text-text-light">
                                Se registrará con la fecha y hora actual
                            </p>

                            <button
                                type="submit"
                                disabled={walkLoading}
                                className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {walkLoading ? 'Registrando...' : 'Registrar paseo'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* CABECERA */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-dark">Paseos</h1>
                    <p className="text-text-medium mt-1">
                        Registro de paseos de tus mascotas
                    </p>
                </div>
                {selectedPet && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium"
                    >
                        + Registrar paseo
                    </button>
                )}
            </div>

            {/* ERROR */}
            {error && (
                <div className="bg-primary-bg border border-border-dark text-primary px-4 py-3 rounded-lg mb-6 text-sm">
                    {error}
                </div>
            )}

            {/* SELECTOR DE MASCOTA */}
            <div className="bg-white rounded-xl border border-border p-4 mb-6">
                <label className="block text-sm font-medium text-text-dark mb-2">
                    Ver paseos de:
                </label>
                <div className="flex gap-2 flex-wrap">
                    {pets.map(pet => (
                        <button
                            key={pet.id}
                            onClick={() => {
                                setSelectedPet(pet);
                                loadWalks(pet.id);
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedPet?.id === pet.id
                                    ? 'bg-primary text-white'
                                    : 'bg-page-bg text-text-medium hover:bg-border'
                            }`}
                        >
                            <span>{getSpeciesEmoji(pet.species)}</span>
                            <span>{pet.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* LISTA DE PASEOS */}
            {loadingWalks ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(n => (
                        <div
                            key={n}
                            className="bg-white rounded-xl border border-border p-5 h-32 animate-pulse"
                        />
                    ))}
                </div>
            ) : walks.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-border">
                    <span className="text-4xl">🏃</span>
                    <h2 className="text-xl font-semibold text-text-dark mt-4 mb-2">
                        {selectedPet?.name} no tiene paseos registrados
                    </h2>
                    <p className="text-text-medium mb-6">
                        Registra el primer paseo pulsando el botón de arriba.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {walks.map(walk => (
                        <WalkCard
                            key={walk.id}
                            walk={walk}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

        </div>
    );
}

export default WalksPage;