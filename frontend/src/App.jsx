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

// Páginas de mascotas
import PetsPage from "./pages/pets/PetsPage.jsx";
import PetDetailPage from "./pages/pets/PetDetailPage.jsx";
import PetFormPage from "./pages/pets/PetFormPage.jsx";

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

                  {/*Lista de mascotas*/}
                  <Route path="/pets" element={
                      <PrivateRoute>
                          <MainLayout>
                              <PetsPage />
                          </MainLayout>
                      </PrivateRoute>}
                  />

                  {/*Formulario crear mascota*/}
                  <Route path="/pets/new" element={
                      <PrivateRoute>
                          <MainLayout>
                              <PetFormPage />
                          </MainLayout>
                      </PrivateRoute>}
                  />

                  {/*Detalle de mascota*/}
                  <Route path="/pets/:id" element={
                          <PrivateRoute>
                              <MainLayout>
                                  <PetDetailPage />
                              </MainLayout>
                          </PrivateRoute>}
                  />

                  {/*Formulario editar mascota*/}
                  <Route path="/pets/:id/edit" element={
                          <PrivateRoute>
                              <MainLayout>
                                  <PetFormPage />
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