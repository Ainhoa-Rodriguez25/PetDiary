import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div className="min-h-screen bg-page-bg flex items-center justify-center px-4">
            <div className="text-center">

                <span className="text-6xl">🐾</span>

                <h1 className="text-4xl font-bold text-text-dark mt-4 mb-3">
                    CarePet
                </h1>

                <p className="text-lg text-text-medium mb-8">
                    Sistema de Gestión de Mascotas
                </p>

                <div className="flex gap-3 justify-center">
                    <Link
                        to="/login"
                        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors font-medium"
                    >
                        Iniciar sesión
                    </Link>
                    <Link
                        to="/register"
                        className="bg-white text-primary border border-primary px-6 py-3 rounded-lg hover:bg-primary-bg transition-colors font-medium"
                    >
                        Registrarse
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default HomePage;