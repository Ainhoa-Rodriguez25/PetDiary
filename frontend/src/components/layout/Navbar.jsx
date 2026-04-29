import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function Navbar() {
    // Se obtiene todo la informacion necesaria del contexto
    const { user, logout, isAthenticated } = useAuth();

    // useNavigate devuelve una función que se almacena en "navigate"
    const navigate = useNavigate();

    // Función que se ejecuta cuando el usuario cierra sesión
    const handleLogout = () => {
        logout();   // Borra token de localStorage
        navigate('/login'); // Redirige a página de login
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Lado izquierdo del navbar */}
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-2xl">🐾</span>
                        <span className="text-xl font-bold text-indigo-600">CarePet</span>
                    </Link>

                    {/* Lado derecho del navbar */}
                    <div className="flex items-center gap-4">
                        {isAthenticated ? (
                            <>
                                <span className="text-sm text-gray-600">
                                    Hola, {' '}
                                    <span className="font-medium text-gray-800">{user?.name}</span>
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">Cerrar sesión</button>
                            </>
                        ) : (
                            <div className="flex gap-2">
                                <Link to="/login" className="text-sm text-indigo-600 hover:text-indigo-800 px-3 py-2">Iniciar sesión</Link>
                                <Link to="/register" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">Registrarse</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;