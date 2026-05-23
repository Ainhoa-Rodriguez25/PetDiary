import { NavLink } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth.js";

const menuItems = [
    { to: '/dashboard',   icon: '🏠', label: 'Inicio'     },
    { to: '/households',  icon: '🏡', label: 'Hogares'    },
    { to: '/pets',        icon: '🐾', label: 'Mascotas'   },
    { to: '/meals',       icon: '🍽️', label: 'Comidas'    },
    { to: '/medications', icon: '💊', label: 'Medicación' },
    { to: '/walks',       icon: '🏃', label: 'Paseos'     },
];

function Sidebar() {
    const { user } = useAuth();

    const initials = user?.name
        ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase()
        : '?';

    return (
        <aside className="w-16 lg:w-64 bg-white border-r border-border flex flex-col h-full transition-all duration-200">

            {/* ENCABEZADO completo — solo en escritorio (lg+) */}
            <div className="px-6 py-5 border-b border-border flex-shrink-0 hidden lg:block">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">🐾</span>
                    <span className="text-lg font-bold text-primary">CarePet</span>
                </div>
                <p className="text-xs text-text-light">v1.0 · 2026</p>
            </div>

            {/* ENCABEZADO compacto — solo en tablet (md a lg) */}
            <div className="py-5 border-b border-border flex-shrink-0 flex justify-center lg:hidden">
                <span className="text-2xl">🐾</span>
            </div>

            {/* MENÚ */}
            <nav className="flex-1 overflow-y-auto px-2 py-6 space-y-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-2 lg:px-4 py-2.5 rounded-lg text-sm font-medium transition-colors justify-center lg:justify-start ${
                                isActive
                                    ? 'bg-primary-bg text-primary'
                                    : 'text-text-medium hover:bg-page-bg hover:text-text-dark'
                            }`
                        }
                        title={item.label}
                    >
                        <span className="text-xl flex-shrink-0">{item.icon}</span>
                        <span className="hidden lg:block">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* PIE — perfil */}
            <div className="flex-shrink-0 border-t border-border p-2 lg:p-3">
                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-2 lg:px-3 py-2.5 rounded-lg transition-colors justify-center lg:justify-start ${
                            isActive ? 'bg-primary-bg' : 'hover:bg-page-bg'
                        }`
                    }
                    title={user?.name}
                >
                    <div className="w-9 h-9 rounded-full bg-primary-bg border border-border-dark flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-primary">
                            {initials}
                        </span>
                    </div>
                    <div className="min-w-0 flex-1 hidden lg:block">
                        <p className="text-sm font-medium text-text-dark truncate">
                            {user?.name}
                        </p>
                        <p className="text-xs text-text-light truncate">
                            Ver perfil
                        </p>
                    </div>
                </NavLink>
            </div>

        </aside>
    );
}

export default Sidebar;