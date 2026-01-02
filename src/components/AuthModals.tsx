import React, { useState } from "react";
import { XIcon } from "lucide-react";
import { authService } from "../api";
import { toast } from "react-toastify";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

interface AuthModalsProps {
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  initialModal?: "login" | "register";
}

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <XIcon size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export function AuthModals({
  showLoginModal,
  setShowLoginModal,
  initialModal = "login",
}: AuthModalsProps) {
  const initialResetToken = React.useMemo(
    () => authService.parseResetTokenFromLocation?.() || null,
    []
  );
  const [resetToken, setResetToken] = useState<string | null>(initialResetToken);
  const [currentModal, setCurrentModal] = useState<
    "login" | "register" | "forgot" | "reset" | null
  >(showLoginModal ? (initialResetToken ? "reset" : initialModal) : null);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    razonSocial: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [registerSuccessMsg, setRegisterSuccessMsg] = useState<string | null>(null);

  const closeModal = () => {
    setCurrentModal(null);
    setShowLoginModal(false);
  };

  const switchModal = (modalName: "login" | "register" | "forgot" | "reset") => {
    setCurrentModal(modalName);
  };

  // Update currentModal when showLoginModal changes
  React.useEffect(() => {
    if (showLoginModal) {
      setCurrentModal((prev) => {
        if (resetToken) return "reset";
        return prev || initialModal;
      });
    } else if (!showLoginModal) {
      setCurrentModal(null);
    }
  }, [showLoginModal, initialModal, resetToken]);

  React.useEffect(() => {
    if (initialResetToken) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete("resetToken");
        window.history.replaceState({}, document.title, url.toString());
      } catch {}
      if (!showLoginModal) setShowLoginModal(true);
      setCurrentModal("reset");
    }
  }, [initialResetToken]);

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await authService.forgotPassword(forgotEmail);
      toast.success("Correo de recuperación enviado (si el email existe)");
      // Volver al login
      setCurrentModal("login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error solicitando recuperación");
      toast.error("No se pudo enviar el correo de recuperación");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    if (!resetToken) {
      setError("Token de reseteo no presente");
      setIsLoading(false);
      return;
    }
    try {
      await authService.resetPassword(resetToken, resetPassword);
      toast.success("Contraseña actualizada");
      setResetPassword("");
      setResetToken(null);
      setCurrentModal("login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error actualizando contraseña");
      toast.error("No se pudo restablecer la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await authService.login({
        email: loginForm.email,
        password: loginForm.password,
      });
      // Guardamos user si no lo hizo el servicio
      if (data?.user) {
        try {
          localStorage.setItem("user", JSON.stringify(data.user));
        } catch {}
      }
      closeModal();

      // Siempre redirigir a /dashboard después del login
      window.location.href = "/dashboard";
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const data = await authService.register({
        firstName: registerForm.firstName,
        razonSocial: registerForm.razonSocial,
        email: registerForm.email,
        password: registerForm.password,
      });
      if ((data as any)?.warnings?.length) {
        toast.warn("Cuenta creada, con advertencias: " + (data as any).warnings.join(" | "));
      } else {
        toast.success("Cuenta creada. Revisa tu correo para la notificación.");
      }
      setRegisterSuccessMsg(
        "Registro completado. Revisa tu correo. Cuando un administrador habilite tu cuenta podrás iniciar sesión."
      );
      setCurrentModal("login");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error en el registro");
      toast.error("Error al registrar usuario");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {/* Login Modal */}
      <Modal isOpen={currentModal === "login"} onClose={closeModal} title="Iniciar Sesión">
        <form className="space-y-4" onSubmit={handleLoginSubmit}>
          {registerSuccessMsg && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-2 rounded text-sm">
              {registerSuccessMsg}
            </div>
          )}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginForm.email}
              onChange={handleLoginInputChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-cyan-500 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginForm.password}
              onChange={handleLoginInputChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-cyan-500 focus:ring-cyan-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-4 py-2 rounded-md transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50"
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
          <div className="mt-4 text-sm text-gray-400">
            <button
              type="button"
              onClick={() => switchModal("forgot")}
              className="text-cyan-400 hover:text-cyan-300"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <div className="text-sm text-gray-400">
            ¿No tienes una cuenta?{" "}
            <button
              type="button"
              onClick={() => switchModal("register")}
              className="text-cyan-400 hover:text-cyan-300"
            >
              Registrarse
            </button>
          </div>
        </form>
      </Modal>

      {/* Register Modal */}
      <Modal isOpen={currentModal === "register"} onClose={closeModal} title="Registro de Usuario">
        <form className="space-y-4" onSubmit={handleRegisterSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
              Nombre
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={registerForm.firstName}
              onChange={handleRegisterInputChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-cyan-500 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label htmlFor="razonSocial" className="block text-sm font-medium text-gray-300">
              Razón Social
            </label>
            <input
              type="text"
              id="razonSocial"
              name="razonSocial"
              value={registerForm.razonSocial}
              onChange={handleRegisterInputChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-cyan-500 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label htmlFor="registerEmail" className="block text-sm font-medium text-gray-300">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="registerEmail"
              name="email"
              value={registerForm.email}
              onChange={handleRegisterInputChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-cyan-500 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label htmlFor="registerPassword" className="block text-sm font-medium text-gray-300">
              Contraseña
            </label>
            <input
              type="password"
              id="registerPassword"
              name="password"
              value={registerForm.password}
              onChange={handleRegisterInputChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-cyan-500 focus:ring-cyan-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-4 py-2 rounded-md transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50"
          >
            {isLoading ? "Registrando..." : "Registrar"}
          </button>
          <div className="text-sm text-gray-400">
            ¿Ya tienes una cuenta?{" "}
            <button
              type="button"
              onClick={() => switchModal("login")}
              className="text-cyan-400 hover:text-cyan-300"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </Modal>

      {/* Forgot Password Modal */}
      <Modal isOpen={currentModal === "forgot"} onClose={closeModal} title="Recuperar Contraseña">
        <form className="space-y-4" onSubmit={handleForgotPasswordSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="forgotEmail" className="block text-sm font-medium text-gray-300">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="forgotEmail"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-cyan-500 focus:ring-cyan-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-4 py-2 rounded-md transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50"
          >
            {isLoading ? "Enviando..." : "Enviar Enlace de Recuperación"}
          </button>
        </form>
      </Modal>

      {/* Reset Password Modal */}
      <Modal isOpen={currentModal === "reset"} onClose={closeModal} title="Restablecer Contraseña">
        <form className="space-y-4" onSubmit={handleResetPasswordSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}
          {!resetToken && (
            <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-400 px-4 py-2 rounded text-sm">
              No se encontró token de recuperación. Solicita un nuevo enlace.
            </div>
          )}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
              Nueva Contraseña
            </label>
            <input
              type="password"
              id="newPassword"
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-cyan-500 focus:ring-cyan-500"
              minLength={6}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !resetToken}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-4 py-2 rounded-md transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50"
          >
            {isLoading ? "Actualizando..." : "Restablecer Contraseña"}
          </button>
        </form>
      </Modal>
    </>
  );
}
