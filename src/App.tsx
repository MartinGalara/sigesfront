import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { Home } from "./pages/Home";
import EndUserLicenseRedirect from "./pages/EndUserLicenseRedirect";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { Dashboard } from "./pages/Dashboard";
import { ProtectedRoute } from "./components/ProtectedRule";
import FreshdeskClientPage from "./pages/FreshdeskClient";
import { ClientOnboarding } from "./pages/ClientOnboarding";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col w-full min-h-screen bg-gray-900">
        <ToastContainer position="top-right" theme="dark" newestOnTop closeOnClick pauseOnHover />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/enduserlicense" element={<EndUserLicenseRedirect />} />
          <Route path="/privacypolici" element={<PrivacyPolicy />} />

          {/* Dashboard - accesible para Admin y Cliente */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Cliente"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Capacitaciones - accesible para Admin y Cliente */}
          <Route
            path="/dashboard/capacitaciones"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Cliente"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Chatbot - solo Admin */}
          <Route
            path="/dashboard/chatbot"
            element={
              <ProtectedRoute allowedRoles={["Admin"]} redirectTo="/dashboard">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Gestión de Usuarios - Admin o Cliente con owner=true */}
          <Route
            path="/dashboard/usuarios"
            element={
              <ProtectedRoute
                allowedRoles={["Admin", "Cliente"]}
                requireOwnerForClients={true}
                redirectTo="/dashboard"
              >
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* FreshDesk - solo Cliente */}
          <Route
            path="/freshdesk"
            element={
              <ProtectedRoute allowedRoles={["Cliente"]} redirectTo="/dashboard">
                <FreshdeskClientPage />
              </ProtectedRoute>
            }
          />

          {/* Client Onboarding - Configuración inicial del cliente */}
          <Route path="/client-onboarding" element={<ClientOnboarding />} />
        </Routes>
        <Footer />
        <WhatsAppButton />
      </div>
    </BrowserRouter>
  );
}
