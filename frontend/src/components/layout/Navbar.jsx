import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function Navbar() {
    // Se obtiene todo la informacion necesaria del contexto
    const { user, logout, isAuthenticated } = useAuth();

    // useNavigate devuelve una función que se almacena en "navigate"
    const navigate = useNavigate();

    // Función que se ejecuta cuando el usuario cierra sesión
    const handleLogout = () => {
        logout();   // Borra token de localStorage
        navigate('/login'); // Redirige a página de login
    };

    return (
        <nav className="bg-white border-b border-border">
            <div className="px-4 md:px-8">
                <div className="flex justify-end items-center h-14">
                    {isAuthenticated && (
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-text-medium">
                                Hola,{' '}
                                <span className="font-medium text-text-dark">{user?.name}</span>
                            </span>
                            <button
                                onClick={handleLogout}
                                className="text-sm bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-hover transition-colors"
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;