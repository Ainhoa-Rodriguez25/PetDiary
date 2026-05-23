import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const mainItems = [
    { to: '/dashboard',   icon: '🏠', label: 'Inicio'     },
    { to: '/households',  icon: '🏡', label: 'Hogares'    },
    { to: '/pets',        icon: '🐾', label: 'Mascotas'   },
    { to: '/medications', icon: '💊', label: 'Medicación' },
];

const moreItems = [
    { to: '/meals',   icon: '🍽️', label: 'Comidas'  },
    { to: '/walks',   icon: '🏃', label: 'Paseos'   },
];

function BottomNav() {
    const [showMore, setShowMore] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const initials = user?.name
        ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase()
        : '?';

    return (
        <>
            {/* MENÚ "MÁS" — aparece encima del BottomNav cuando se pulsa ··· */}
            {showMore && (
                <>
                    {/* Overlay para cerrar al tocar fuera */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowMore(false)}
                    />

                    {/* Panel con las opciones extra */}
                    <div className="fixed bottom-16 left-0 right-0 z-50 bg-white border-t border-border shadow-lg">
                        {moreItems.map((item) => (
                            <button
                                key={item.to}
                                onClick={() => {
                                    navigate(item.to);
                                    setShowMore(false);
                                }}
                                className="w-full flex items-center gap-4 px-6 py-4 text-text-medium hover:bg-page-bg transition-colors border-b border-border last:border-0"
                            >
                                <span className="text-2xl">{item.icon}</span>
                                <span className="text-sm font-medium">{item.label}</span>
                            </button>
                        ))}

                        {/* Perfil con avatar */}
                        <button
                            onClick={() => {
                                navigate('/profile');
                                setShowMore(false);
                            }}
                            className="w-full flex items-center gap-4 px-6 py-4 text-text-medium hover:bg-page-bg transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-primary-bg border border-border-dark flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-medium text-primary">
                                    {initials}
                                </span>
                            </div>
                            <span className="text-sm font-medium">Mi perfil</span>
                        </button>
                    </div>
                </>
            )}

            {/* BARRA INFERIOR */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border flex z-50">

                {/* Items principales */}
                {mainItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-xs transition-colors ${
                                isActive ? 'text-primary' : 'text-text-light'
                            }`
                        }
                        onClick={() => setShowMore(false)}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="leading-none">{item.label}</span>
                    </NavLink>
                ))}

                {/* Botón "Más" */}
                <button
                    onClick={() => setShowMore(!showMore)}
                    className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-xs transition-colors ${
                        showMore ? 'text-primary' : 'text-text-light'
                    }`}
                >
                    <span className="text-xl">···</span>
                    <span className="leading-none">Más</span>
                </button>

            </nav>
        </>
    );
}

export default BottomNav;