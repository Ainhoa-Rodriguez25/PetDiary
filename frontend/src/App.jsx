import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';

// Componentes del layout
import MainLayout from './components/layout/MainLayout';
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
              <Routes>
                  {/*Rutas públicas*/}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/*Rutas protegidas*/}
                  <Route path="/dashboard" element={
                      <PrivateRoute>
                          <MainLayout>
                              <DashboardPage />
                          </MainLayout>
                      </PrivateRoute>}
                  />
                  <Route path="*" element={<NotFoundPage />} />
              </Routes>
          </AuthProvider>
      </BrowserRouter>
  );
}

export default App;