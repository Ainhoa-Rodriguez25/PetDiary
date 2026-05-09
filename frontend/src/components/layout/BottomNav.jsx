import { NavLink } from 'react-router-dom';

const menuItems = [
    { to: '/dashboard', icon: '🏠', label: 'Inicio'    },
    { to: '/households', icon: '🏡', label: 'Hogares'   },
    { to: '/pets',      icon: '🐾', label: 'Mascotas'  },
    { to: '/meals',     icon: '🍽️', label: 'Comidas'   },
    { to: '/meds',      icon: '💊', label: 'Medicación'},
];

function BottomNav() {
    return (
        // Barra fija en la parte inferior de la pantalla
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border flex z-50 pb-safe">
            {menuItems.map((item) => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                        `flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-xs transition-colors ${
                            isActive
                                ? 'text-primary'
                                : 'text-text-light'
                        }`
                    }
                >
                    <span className="text-xl">{item.icon}</span>
                    <span className="leading-none">{item.label}</span>
                </NavLink>
            ))}
        </nav>
    );
}

export default BottomNav;