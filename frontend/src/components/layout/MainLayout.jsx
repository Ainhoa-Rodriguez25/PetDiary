import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

function MainLayout({ children }) {
    return (
        // Contenedor que unifica Navbar, Sidebar y Page
        <div className="min-h-screen bg-page-bg flex flex-col">
            <Navbar />

            {/*Area inferior: sidebar + contenido en fila*/}
            <div className="flex flex-1 overflow-hidden">
                <div className="hidden md:flex">
                    <Sidebar />
                </div>

                {/*Contenido columna derecha*/}
                <main className="flex-1 overflow-auto pb-16 md:pb-0">
                    <div className="p-4 md:p-8">
                        {children}
                    </div>
                </main>
            </div>

            <div className="flex md:hidden">
                <BottomNav />
            </div>
        </div>
    );
}

export default MainLayout;