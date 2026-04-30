import { Link, useNavigate } from 'react-router-dom';
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Lado izquierdo del navbar */}
                    <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
                        <span className="text-2xl">🐾</span>
                        <span className="text-xl font-bold text-primary">CarePet</span>
                    </Link>

                    {/* Lado derecho del navbar */}
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <span className="text-sm text-text-medium">
                                    Hola, {' '}
                                    <span className="font-medium text-text-dark">{user?.name}</span>
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors">Cerrar sesión</button>
                            </>
                        ) : (
                            <div className="flex gap-2">
                                <Link to="/login" className="text-sm text-primary hover:text-primary-hover px-3 py-2">Iniciar sesión</Link>
                                <Link to="/register" className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors">Registrarse</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;