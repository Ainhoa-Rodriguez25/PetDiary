import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';

// Componentes del layout
import Navbar from './components/Navbar';
import PrivateRoute from "./components/common/PrivateRoute";

// Páginas
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
      <BrowserRouter>
          <AuthProvider>
              <div className="min-h-screen bg-gray-50">
                  <Navbar />

                  <main>
                      <Routes>
                          {/*Rutas públicas*/}
                          <Route path="/" element={<HomePage />} />
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/register" element={<RegisterPage />} />

                          {/*Rutas protegidas*/}
                          <Route path="/dashboard" element={
                              <PrivateRoute>
                                <DashboardPage />
                              </PrivateRoute>}
                          />
                          <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                  </main>
              </div>
          </AuthProvider>
      </BrowserRouter>
  );
}

export default App;