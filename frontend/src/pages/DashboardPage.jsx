import { useAuth } from '../hooks/useAuth';

function DashboardPage() {
    // Objeto usuario con toda la información relacionada
    const { user } = useAuth();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/*Sección de bienvenida*/}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Bienvenida, {user?.name} 👋</h1>
                <p className="text-gray-600 mt-1">Gestiona el cuidado de tus mascotas desde aquí</p>
            </div>

            {/*Tarjetas placeholder*/}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/*Sección mascotas*/}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="text-3xl mb-3">🐶</div>
                    <h3 className="font-semibold text-gray-800">Mis mascotas</h3>
                    <p className="text-sm text-gray-500 mt-1">Gestiona tus mascotas</p>
                </div>

                {/*Sección medicación*/}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="text-3xl mb-3">💊</div>
                    <h3 className="font-semibold text-gray-800">Medicación</h3>
                    <p className="text-sm text-gray-500 mt-1">Control de medicamentos</p>
                </div>

                {/*Sección paseos*/}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="text-3xl mb-3">🚶</div>
                    <h3 className="font-semibold text-gray-800">Paseos</h3>
                    <p className="text-sm text-gray-500 mt-1">Registra los paseos</p>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;