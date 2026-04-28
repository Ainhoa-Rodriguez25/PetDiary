import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

export function useAuth() {

    // Se obtiene el objeto value definido en AuthContext y se guarda en una constante
    const context = useContext(AuthContext);

    // Se lanza error si context es null
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }

    return context;
}