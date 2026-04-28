import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function RegisterPage() {
    // Campos del formulario
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Se hace uso de la función "register"
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de campos
        if (!name || !email || !password || !confirmPass) {
            setEmail('Por favor complete todos los campos');
            return;
        }

        // Validación para comprobar que password y confirmPass coinciden
        if (password !== confirmPass) {
            setConfirmPass('Las constraseñas no coinciden');
            return;
        }

        // Validar longitud de password
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            setLoading(true);
            setError('');

            // Función register llama a backend y guarda token del usuario tras registrarse
            await register(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al registrarse. Inténtelo de nuevo';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
            <div className="max-w-md w-full">

                <div className="text-center mb-8">
                    <span className="text-5xl">🐾</span>
                    <h1 className="text-3xl font-bold text-gray-900 mt-4">CarePet</h1>
                    <p className="text-gray-600 mt-2">Crea tu cuenta</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/*Campo nombre*/}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Tu nombre"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="tu@email.com"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Mínimo 6 caracteres"
                                disabled={loading}
                            />
                        </div>

                        {/*Campo confirmar contraseña*/}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
                            <input
                                type="password"
                                value={confirmPass}
                                onChange={(e) => setConfirmPass(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Repite tu contraseña"
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-6">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">Inicia sesión</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;