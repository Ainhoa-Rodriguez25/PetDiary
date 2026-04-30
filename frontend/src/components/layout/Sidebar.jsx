import { NavLink } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth.js";

// Los items del menú se definen como un array de objetos
const menuItems = [
    { to: '/dashboard', icon: '🏠', label: 'Inicio'      },
    { to: '/pets',      icon: '🐾', label: 'Mascotas'    },
    { to: '/meals',     icon: '🍽️', label: 'Comidas'     },
    { to: '/meds',      icon: '💊', label: 'Medicación'  },
    { to: '/walks',     icon: '🏃', label: 'Paseos'      },
];

function Sidebar() {
    const { user } = useAuth();

    const initials = user?.name ? user?.name.split(' ').map((n) => n[0]).join('').toUpperCase() : '?';

    return (
        // Sidebar ocupa todo alto de la página
        <aside className="w-64 min-h-screen bg-white border-r border-border flex flex-col">
            {/*Encabezado - logo + info de la app*/}
            <div className="px-6 py-5 border-b border-border">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">🐾</span>
                    <span className="text-lg font-bold text-primary">CarePet</span>
                </div>
                <p className="text-xs text-text-light">v1.0 · TFG 2026</p>
            </div>

            {/*Menú de navegación*/}
            <nav className="flex-1 px-3 py-6 space-y-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                                // Activo: fondo suave terracota + texto primario
                                ? 'bg-primary-bg text-primary'
                                // Inactivo: sin fondo + texto gris
                                : 'text-text-medium hover:bg-page-bg hover:text-text-dark'
                        }`}
                    >
                        {/*Icono del item*/}
                        <span className="text-lg">{item.icon}</span>
                        {/*Etiqueta del item*/}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/*Pie del sidebar*/}
            {/*Información de la app*/}
            <div className="border-t border-border p-3">
                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                            isActive
                                ? 'bg-primary-bg'
                                : 'hover:bg-page-bg'
                        }`}
                >
                    <div className="w-9 h-9 rounded-full bg-primary-bg border border-border-dark flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-primary">
                            {initials}
                        </span>
                    </div>

                    {/* DATOS DEL USUARIO */}
                    <div className="min-w-0 flex-1">
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