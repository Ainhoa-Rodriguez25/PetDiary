import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" component={<HomePage />} />
              <Route path="/login" component={<LoginPage />} />
              <Route path="/register" component={<RegisterPage />} />
              <Route path="/dashboard" component={<DashboardPage />} />
              <Route path="*" component={<NotFoundPage />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;