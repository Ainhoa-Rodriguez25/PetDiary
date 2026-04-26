function HomePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-blue-600 mb-4">
                    🐾 CarePet
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    Sistema de Gestión de Mascotas
                </p>
                <a href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                    Iniciar Sesión
                </a>
            </div>
        </div>
    );
}

export default HomePage;