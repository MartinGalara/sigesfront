import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { AuthModals } from "./AuthModals";
import { authService } from "../api";
import { toast } from "react-toastify";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const [role, setRole] = useState<string | null>(null);
  const [canAccessUsers, setCanAccessUsers] = useState<boolean>(false);

  // Verificar si estamos en el home
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Verificar si el usuario está logueado
    setIsLoggedIn(authService.isLoggedIn());
    if (authService.isLoggedIn()) {
      const user = authService.getStoredUser?.() || safeParse(localStorage.getItem("user"));
      if (user) {
        const userRole = user.role || user.statusRole || user.status || null;
        setRole(userRole);

        // Verificar si puede acceder a Gestión de Usuarios
        // Admin: siempre puede acceder
        // Cliente: solo si owner = true
        const canAccess = userRole === "Admin" || (userRole === "Cliente" && user.owner === true);
        setCanAccessUsers(canAccess);
      }
    } else {
      setRole(null);
      setCanAccessUsers(false);
    }
  }, [location]);

  // Abrir modal reset si viene resetToken en la URL
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get("resetToken")) {
        setShowLoginModal(true); // AuthModals detectará y abrirá el reset
      }
    } catch {}
  }, []);

  // Toast cuando cambia el estado de autenticación a logueado
  const prevLoggedIn = useRef<boolean>(authService.isLoggedIn());
  useEffect(() => {
    if (!prevLoggedIn.current && isLoggedIn) {
      toast.success("Sesión iniciada");
    }
    prevLoggedIn.current = isLoggedIn;
  }, [isLoggedIn]);

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    toast.info("Sesión cerrada");
    window.location.href = "/";
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-gray-900/80 backdrop-blur-md shadow-lg shadow-blue-900/20"
            : "bg-transparent"
        }`}
      >
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/">
              <img
                src="/WHITE_LOGO.png"
                alt="SIGES Logo"
                className="h-10 cursor-pointer hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {isLoggedIn ? (
              isHomePage ? (
                // Si está logueado y en home, mostrar navegación del home
                <>
                  <a href="#inicio" className="text-gray-300 hover:text-cyan-400 transition-colors">
                    Inicio
                  </a>
                  <a
                    href="#nosotros"
                    className="text-gray-300 hover:text-cyan-400 transition-colors"
                  >
                    Nosotros
                  </a>
                  <a
                    href="#soluciones"
                    className="text-gray-300 hover:text-cyan-400 transition-colors"
                  >
                    Soluciones
                  </a>
                  <a
                    href="#servicios"
                    className="text-gray-300 hover:text-cyan-400 transition-colors"
                  >
                    Servicios
                  </a>
                  <a
                    href="#contacto"
                    className="text-gray-300 hover:text-cyan-400 transition-colors"
                  >
                    Contacto
                  </a>
                </>
              ) : role === "Admin" ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-300 hover:text-cyan-400 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard/capacitaciones"
                    className="text-gray-300 hover:text-cyan-400 transition-colors"
                  >
                    Capacitaciones
                  </Link>
                  <Link
                    to="/dashboard/chatbot"
                    className="text-gray-300 hover:text-cyan-400 transition-colors"
                  >
                    Sección Chatbot
                  </Link>
                  {canAccessUsers && (
                    <Link
                      to="/dashboard/usuarios"
                      className="text-gray-300 hover:text-cyan-400 transition-colors"
                    >
                      Gestión de Usuarios
                    </Link>
                  )}
                </>
              ) : role === "Cliente" ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-300 hover:text-cyan-400 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/freshdesk"
                    className="text-gray-300 hover:text-cyan-400 transition-colors"
                  >
                    FreshDesk
                  </Link>
                  <Link
                    to="/dashboard/capacitaciones"
                    className="text-gray-300 hover:text-cyan-400 transition-colors"
                  >
                    Capacitaciones
                  </Link>
                  {canAccessUsers && (
                    <Link
                      to="/dashboard/usuarios"
                      className="text-gray-300 hover:text-cyan-400 transition-colors"
                    >
                      Gestión de Usuarios
                    </Link>
                  )}
                </>
              ) : (
                <></>
              )
            ) : (
              <>
                <a href="#inicio" className="text-gray-300 hover:text-cyan-400 transition-colors">
                  Inicio
                </a>
                <a href="#nosotros" className="text-gray-300 hover:text-cyan-400 transition-colors">
                  Nosotros
                </a>
                <a
                  href="#soluciones"
                  className="text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  Soluciones
                </a>
                <a
                  href="#servicios"
                  className="text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  Servicios
                </a>
                <a href="#contacto" className="text-gray-300 hover:text-cyan-400 transition-colors">
                  Contacto
                </a>
              </>
            )}
          </div>

          {isLoggedIn ? (
            // Botones para usuario logueado
            <div className="hidden md:flex space-x-4">
              {isHomePage && (
                <>
                  <a
                    href="https://wa.me/3512266159"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-6 py-2 rounded-full transition-all shadow-lg hover:shadow-green-500/30"
                  >
                    Contactanos
                  </a>
                  <Link
                    to="/dashboard"
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-6 py-2 rounded-full transition-all shadow-lg hover:shadow-blue-500/30"
                  >
                    Ir al Dashboard
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-6 py-2 rounded-full transition-all shadow-lg hover:shadow-red-500/30"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            // Botones para landing page (solo si no está logueado)
            <>
              <a
                href="https://wa.me/3512266159"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:block bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-6 py-2 rounded-full transition-all shadow-lg hover:shadow-blue-500/30"
              >
                Contactanos
              </a>
              <button
                onClick={() => setShowLoginModal(true)}
                className="hidden md:block bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-6 py-2 rounded-full transition-all shadow-lg hover:shadow-purple-500/30"
              >
                Iniciar Sesión
              </button>
            </>
          )}

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-300" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-md shadow-lg py-4 px-6 absolute w-full">
            <div className="flex flex-col space-y-4">
              {isLoggedIn ? (
                <>
                  {/* Si está en home, mostrar navegación del home + botón dashboard */}
                  {isHomePage ? (
                    <>
                      <a
                        href="#inicio"
                        className="text-gray-300 hover:text-cyan-400 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Inicio
                      </a>
                      <a
                        href="#nosotros"
                        className="text-gray-300 hover:text-cyan-400 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Nosotros
                      </a>
                      <a
                        href="#soluciones"
                        className="text-gray-300 hover:text-cyan-400 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Soluciones
                      </a>
                      <a
                        href="#servicios"
                        className="text-gray-300 hover:text-cyan-400 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Servicios
                      </a>
                      <a
                        href="#contacto"
                        className="text-gray-300 hover:text-cyan-400 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Contacto
                      </a>
                      <a
                        href="https://wa.me/3512266159"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-6 py-2 rounded-full transition-all shadow-lg hover:shadow-green-500/30 w-full text-center"
                      >
                        Contactanos
                      </a>
                      <Link
                        to="/dashboard"
                        className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-6 py-2 rounded-full transition-all shadow-lg hover:shadow-blue-500/30 w-full text-center"
                        onClick={() => setIsOpen(false)}
                      >
                        Ir al Dashboard
                      </Link>
                    </>
                  ) : (
                    <>
                      {role === "Admin" && (
                        <>
                          <Link
                            to="/dashboard"
                            className="text-gray-300 hover:text-cyan-400 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            Dashboard
                          </Link>
                          <Link
                            to="/dashboard/capacitaciones"
                            className="text-gray-300 hover:text-cyan-400 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            Capacitaciones
                          </Link>
                          <Link
                            to="/dashboard/chatbot"
                            className="text-gray-300 hover:text-cyan-400 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            Sección Chatbot
                          </Link>
                          {canAccessUsers && (
                            <Link
                              to="/dashboard/usuarios"
                              className="text-gray-300 hover:text-cyan-400 transition-colors"
                              onClick={() => setIsOpen(false)}
                            >
                              Gestión de Usuarios
                            </Link>
                          )}
                        </>
                      )}
                      {role === "Cliente" && (
                        <>
                          <Link
                            to="/dashboard"
                            className="text-gray-300 hover:text-cyan-400 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            Dashboard
                          </Link>
                          <Link
                            to="/freshdesk"
                            className="text-gray-300 hover:text-cyan-400 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            FreshDesk
                          </Link>
                          <Link
                            to="/dashboard/capacitaciones"
                            className="text-gray-300 hover:text-cyan-400 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            Capacitaciones
                          </Link>
                          {canAccessUsers && (
                            <Link
                              to="/dashboard/usuarios"
                              className="text-gray-300 hover:text-cyan-400 transition-colors"
                              onClick={() => setIsOpen(false)}
                            >
                              Gestión de Usuarios
                            </Link>
                          )}
                        </>
                      )}
                    </>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-6 py-2 rounded-full transition-all shadow-lg hover:shadow-red-500/30 w-full text-center"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="#inicio"
                    className="text-gray-300 hover:text-cyan-400 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Inicio
                  </a>
                  <a
                    href="#nosotros"
                    className="text-gray-300 hover:text-cyan-400 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Nosotros
                  </a>
                  <a
                    href="#soluciones"
                    className="text-gray-300 hover:text-cyan-400 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Soluciones
                  </a>
                  <a
                    href="#servicios"
                    className="text-gray-300 hover:text-cyan-400 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Servicios
                  </a>
                  <a
                    href="#contacto"
                    className="text-gray-300 hover:text-cyan-400 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Contacto
                  </a>
                  <a
                    href="https://wa.me/3512266159"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-6 py-2 rounded-full transition-all shadow-lg hover:shadow-blue-500/30 w-full text-center"
                  >
                    Contactanos
                  </a>
                  <button
                    onClick={() => {
                      setShowLoginModal(true);
                      setIsOpen(false);
                    }}
                    className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-6 py-2 rounded-full transition-all shadow-lg hover:shadow-purple-500/30 w-full text-center"
                  >
                    Iniciar Sesión
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>
      {!isLoggedIn && (
        <AuthModals showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal} />
      )}
    </>
  );
}

function safeParse(raw: string | null) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
