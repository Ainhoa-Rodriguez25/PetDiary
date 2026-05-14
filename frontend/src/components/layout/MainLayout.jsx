import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

function MainLayout({ children }) {
    return (
        <div className="h-screen flex flex-col bg-page-bg">

            <Navbar />

            <div className="flex flex-1 overflow-hidden">

                {/* Sidebar en escritorio */}
                <div className="hidden md:flex">
                    <Sidebar />
                </div>

                {/* Contenido con scroll */}
                <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
                    <div className="p-4 md:p-8">
                        {children}
                    </div>
                </main>

            </div>

            {/* Barra inferior móvil */}
            <div className="flex md:hidden">
                <BottomNav />
            </div>

        </div>
    );
}

export default MainLayout;