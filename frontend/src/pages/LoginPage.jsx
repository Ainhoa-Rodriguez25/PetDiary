import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
    // Los campos del formulario se encuentran vacíos desde un inicio
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');

    const [loading, setLoading] = useState(false);

    // Se utiliza la función login
    const {login} = useAuth();
    const navigate = useNavigate();

    // Manejador del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de campos obligatorios
        if (!email || !password) {
            setError('Por favor completa todos los campos');
            return;
        }

        try {
            setLoading(true);
            setError('');

            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.message || 'Email o contraseña incorrectos';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-page-bg flex items-center justify-center px-4">
            <div className="max-w-md w-full">

                {/*Cabecera*/}
                <div className="text-center mb-8">
                    <span className="text-5xl">🐾</span>
                    <h1 className="text-3xl font-bold text-text-dark mt-4">CarePet</h1>
                    <p className="text-text-medium mt-2">Inicia sesión en tu cuenta</p>
                </div>

                {/*Tarjeta del formulario*/}
                <div className="bg-white rounded-2xl border border-border p-8">
                    {error && (
                        <div className="bg-primary-bg border border-border-dark text-primary px-4 py-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/*Campo email*/}
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark placeholder:text-text-light"
                                placeholder="tu@email.com"
                                disabled={loading}
                            />
                        </div>

                        {/*Campo contraseña*/}
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark placeholder:text-text-light"
                                placeholder="••••••••"
                                disabled={loading}
                            />
                        </div>

                        {/*Botón submit*/}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                        </button>
                    </form>

                    {/*Link a registro*/}
                    <p className="text-center text-sm text-text-medium mt-6">
                        ¿No tienes cuenta?{' '}
                        <Link to="/register" className="text-primary hover:text-primary-hover font-medium">
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;