import { createContext, useState } from 'react';
import authService from "../services/authService";

// Crear el contexto
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

// Crear el provider
export function AuthProvider({ children }) {
    // Estado del usuario
    const [user, setUser] = useState(() => authService.getCurrentUser());

    // Función login para que la LoginPage pueda utilizarla
    const login = async (email, password) => {
        // Se guarda el token del usuario logueado
        const userData = await authService.login(email, password);
        setUser(userData);
        return userData;
    };

    // Función para cerrar sesión
    const logout = () => {
        authService.logout(); // Borra localStorage
        setUser(null); // Limpia el estado
    };

    // Función para que un usuario se registre
    const register = async (name, email, password) => {
        const userData = await authService.register(name, email, password);
        setUser(userData);
        return userData;
    };

    // Valor del objeto que cualquier componente puede recibir
    const value = {
        user,
        login,
        logout,
        register,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
