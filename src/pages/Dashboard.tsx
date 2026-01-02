import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Capacitaciones } from "../components/Capacitaciones";
import { ChatbotSection } from "../components/ChatbotSection";
import { GestionUsuarios } from "../components/GestionUsuarios";
import { userService } from "../api";

export function Dashboard() {
  const location = useLocation();
  const currentPath = location.pathname;

  const renderDashboardContent = () => {
    switch (currentPath) {
      case '/dashboard/capacitaciones':
        return <Capacitaciones />;
      case '/dashboard/chatbot':
        return <ChatbotSection />;
      case '/dashboard/usuarios':
        return <GestionUsuarios />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <main className="flex-grow pt-20">
      {renderDashboardContent()}
    </main>
  );
}

// Componente para la página principal del dashboard
function DashboardHome() {
  const [activeUsers, setActiveUsers] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadActiveUsers = async () => {
      try {
        const users = await userService.getUsers();
        const count = users.filter((u: any) => u?.status === 1).length;
        if (isMounted) setActiveUsers(count);
      } catch (err) {
        console.error("Error cargando usuarios activos:", err);
        if (isMounted) setActiveUsers(0);
      }
    };
    loadActiveUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center text-white mb-4">Dashboard</h1>
        <p className="text-center text-gray-300 text-lg">Bienvenido al panel de administración</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card Capacitaciones */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white ml-4">Capacitaciones</h3>
          </div>
          <p className="text-gray-300 mb-4">Gestiona y accede a los materiales de capacitación organizados por categorías.</p>
          <a
            href="/dashboard/capacitaciones"
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Ir a Capacitaciones
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Card Chatbot */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white ml-4">Sección Chatbot</h3>
          </div>
          <p className="text-gray-300 mb-4">Administra planillas, clientes y configuraciones del sistema de chatbot.</p>
          <a
            href="/dashboard/chatbot"
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Ir al Chatbot
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Card Gestión de Usuarios */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-teal-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white ml-4">Gestión de Usuarios</h3>
          </div>
          <p className="text-gray-300 mb-4">Administra usuarios del sistema, roles y permisos de acceso.</p>
          <a
            href="/dashboard/usuarios"
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Gestionar Usuarios
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Sección de estadísticas rápidas */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">Resumen del Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
            <div className="text-2xl font-bold text-cyan-400">{activeUsers ?? '—'}</div>
            <div className="text-gray-300 text-sm">Usuarios Activos</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
            <div className="text-2xl font-bold text-green-400">--</div>
            <div className="text-gray-300 text-sm">Capacitaciones</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
            <div className="text-2xl font-bold text-purple-400">--</div>
            <div className="text-gray-300 text-sm">Clientes</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
            <div className="text-2xl font-bold text-orange-400">--</div>
            <div className="text-gray-300 text-sm">Dispositivos</div>
          </div>
        </div>
      </div>
    </div>
  );
}
