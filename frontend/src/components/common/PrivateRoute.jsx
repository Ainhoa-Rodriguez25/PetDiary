import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function PrivateRoute({ children }) {
    // Se obtiene si el usuario está autenticado o no
    const { isAuthenticated } = useAuth();

    // Si no lo está, la aplicación redigire al usuario a la página login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si usuario autenticado se muestra contenido
    return children;
}

export default PrivateRoute;