import { NavLink } from 'react-router-dom';

const menuItems = [
    { to: '/dashboard', icon: '🏠', label: 'Inicio'    },
    { to: '/pets',      icon: '🐾', label: 'Mascotas'  },
    { to: '/meals',     icon: '🍽️', label: 'Comidas'   },
    { to: '/meds',      icon: '💊', label: 'Medicación'},
    { to: '/walks',     icon: '🏃', label: 'Paseos'    },
];

function BottomNav() {
    return (
        // Barra fija en la parte inferior de la pantalla
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border flex z-50">
            {menuItems.map((item) => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                        `flex-1 flex flex-col items-center justify-center py-2 text-xs transition-colors ${
                            isActive
                                ? 'text-primary'
                                : 'text-text-light'
                        }`
                    }
                >
                    <span className="text-xl mb-0.5">{item.icon}</span>
                    <span>{item.label}</span>
                </NavLink>
            ))}
        </nav>
    );
}

export default BottomNav;