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
        <div className="min-h-screen bg-page-bg flex items-center justify-center px-4 py-8">
            <div className="max-w-md w-full">

                <div className="text-center mb-8">
                    <span className="text-5xl">🐾</span>
                    <h1 className="text-3xl font-bold text-text-dark mt-4">CarePet</h1>
                    <p className="text-text-medium mt-2">Crea tu cuenta</p>
                </div>

                <div className="bg-white rounded-2xl border border-border p-8">

                    {error && (
                        <div className="bg-primary-bg border border-border-dark text-primary px-4 py-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/*Campo nombre*/}
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1">Nombre completo</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark placeholder:text-text-light"
                                placeholder="Tu nombre"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark placeholder:text-text-light"
                                placeholder="tu@email.com"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark placeholder:text-text-light"
                                placeholder="Mínimo 6 caracteres"
                                disabled={loading}
                            />
                        </div>

                        {/*Campo confirmar contraseña*/}
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1">Confirmar contraseña</label>
                            <input
                                type="password"
                                value={confirmPass}
                                onChange={(e) => setConfirmPass(e.target.value)}
                                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark placeholder:text-text-light"
                                placeholder="Repite tu contraseña"
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-text-medium mt-6">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" className="text-primary hover:text-primary-hover font-medium">Inicia sesión</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;