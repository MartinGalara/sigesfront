import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Spinner, Input, Button, Checkbox } from "@heroui/react";
import {
  CheckCircle2,
  Building2,
  Lock,
  Mail,
  ArrowLeft,
  Plus,
  Trash2,
  Edit,
  User,
} from "lucide-react";
import { authService } from "../api";
import { toast } from "react-toastify";

export function ClientOnboarding() {
  // Ocultar navbar y whatsapp button al montar el componente
  useEffect(() => {
    // Ocultar elementos del layout
    const navbar = document.querySelector("nav");
    const whatsappButton = document.querySelector('[aria-label="Contactar por WhatsApp"]');
    const footer = document.querySelector("footer");

    if (navbar) navbar.style.display = "none";
    if (whatsappButton) whatsappButton.style.display = "none";
    if (footer) footer.style.display = "none";

    // Restaurar al desmontar
    return () => {
      if (navbar) navbar.style.display = "";
      if (whatsappButton) whatsappButton.style.display = "";
      if (footer) footer.style.display = "";
    };
  }, []);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Estados para el login
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Estados para los pasos del onboarding
  const [step1Completed, setStep1Completed] = useState(false);
  const [step2Completed, setStep2Completed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para la configuración de puestos de trabajo
  const [showStep1Config, setShowStep1Config] = useState(false);
  const [step1ConfigView, setStep1ConfigView] = useState<"areas" | "devices" | "summary">("areas");
  const [areas, setAreas] = useState<string[]>([]);
  const [newAreaName, setNewAreaName] = useState("");
  const [devices, setDevices] = useState<
    Array<{
      alias: string;
      teamviewer_id: string;
      area: string;
    }>
  >([]);

  // Estados para el Paso 2: Agregar usuarios
  const [showStep2Config, setShowStep2Config] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [canUseSigesBot, setCanUseSigesBot] = useState(false);
  const [canUsePortal, setCanUsePortal] = useState(false);
  const [userPhone, setUserPhone] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [users, setUsers] = useState<
    Array<{
      name: string;
      sigesBot?: {
        phone: string;
      };
      portal?: {
        email: string;
      };
    }>
  >([]);

  useEffect(() => {
    // Verificar si el usuario ya está logueado
    const checkAuth = () => {
      try {
        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (userStr && token) {
          const user = JSON.parse(userStr);

          // Verificar que sea un usuario Cliente y Owner
          if (user.role === "Cliente" && user.owner) {
            // Verificar si ya completó el onboarding
            if (user.onboarding_completed) {
              // Si ya completó el onboarding, redirigir al dashboard
              toast.info("Ya has completado la configuración inicial");
              window.location.href = "/dashboard";
              return;
            }

            setCurrentUser(user);
            setIsAuthenticated(true);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginForm.email || !loginForm.password) {
      toast.error("Por favor ingrese email y contraseña");
      return;
    }

    setIsLoggingIn(true);

    try {
      const response = await authService.login({
        email: loginForm.email,
        password: loginForm.password,
      });

      console.log("=== LOGIN RESPONSE ===");
      console.log("Full response:", response);
      console.log("User object:", response.user);
      console.log("User role:", response.user.role);
      console.log("User owner:", response.user.owner);
      console.log("User onboarding_completed:", response.user.onboarding_completed);
      console.log("=====================");

      // Verificar que sea un usuario Cliente y Owner
      if (response.user.role !== "Cliente" || !response.user.owner) {
        toast.error("Esta página es solo para clientes administradores");
        authService.logout();
        return;
      }

      // Verificar si ya completó el onboarding
      if (response.user.onboarding_completed) {
        toast.info("Ya has completado la configuración inicial. Redirigiendo al dashboard...");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
        return;
      }

      setCurrentUser(response.user);
      setIsAuthenticated(true);
      toast.success("¡Bienvenido!");
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      toast.error(error.message || "Error al iniciar sesión");
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  // Si no está autenticado, mostrar formulario de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 text-blue-400">
                <Building2 size={32} />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Configuración de Cliente</h1>
            <p className="text-gray-400">
              Por favor inicia sesión para continuar con la configuración
            </p>
          </div>

          {/* Login Form */}
          <Card className="bg-gray-800/50 border border-gray-700/50">
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">Iniciar Sesión</h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Correo electrónico"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                    startContent={<Mail size={18} className="text-gray-400" />}
                    classNames={{
                      input: "text-white",
                      inputWrapper: "bg-gray-900/70 border border-gray-700",
                    }}
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Contraseña"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                    startContent={<Lock size={18} className="text-gray-400" />}
                    classNames={{
                      input: "text-white",
                      inputWrapper: "bg-gray-900/70 border border-gray-700",
                    }}
                  />
                </div>
                <Button
                  type="submit"
                  color="primary"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500"
                  isLoading={isLoggingIn}
                >
                  {isLoggingIn ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-gray-400 text-sm">
                  Usa las credenciales que recibiste en tu correo electrónico
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  // Si está en configuración del Paso 2, mostrar la vista
  if (showStep2Config) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-6 left-6">
          <h1 className="text-3xl font-bold text-white tracking-wider">SIGES</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Botón volver */}
          <Button
            variant="flat"
            startContent={<ArrowLeft size={20} />}
            onClick={() => setShowStep2Config(false)}
            className="mb-6 text-gray-400 hover:text-white"
          >
            Volver
          </Button>

          <Card className="bg-gray-800/50 border border-gray-700/50">
            <CardHeader>
              <h2 className="text-2xl font-bold text-white">Paso 2: Agregar Usuarios</h2>
            </CardHeader>
            <CardBody className="space-y-6">
              <p className="text-gray-400">
                Agrega los usuarios que podrán generar tickets a través de SIGES BOT o el Portal.
              </p>

              {/* Formulario para agregar usuario */}
              <div className="bg-gray-900/30 border border-gray-700/50 rounded-lg p-4 space-y-4">
                <Input
                  placeholder="Nombre del usuario"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  classNames={{
                    input: "text-white",
                    inputWrapper: "bg-gray-900/70 border border-gray-700",
                  }}
                />

                <div className="space-y-4">
                  <p className="text-white font-medium">¿Puede generar tickets a través de...?</p>

                  <div className="flex items-center gap-4">
                    <Checkbox
                      isSelected={canUseSigesBot}
                      onValueChange={setCanUseSigesBot}
                      size="sm"
                      classNames={{
                        label: "text-white",
                        wrapper: "after:bg-blue-500 after:text-white scale-75",
                      }}
                    />
                    <span className="text-white">SIGES BOT</span>
                  </div>

                  {canUseSigesBot && (
                    <Input
                      placeholder="Teléfono (10 dígitos)"
                      value={userPhone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 10) {
                          setUserPhone(value);
                        }
                      }}
                      classNames={{
                        input: "text-white",
                        inputWrapper: "bg-gray-900/70 border border-gray-700",
                      }}
                    />
                  )}

                  <div className="flex items-center gap-4">
                    <Checkbox
                      isSelected={canUsePortal}
                      onValueChange={setCanUsePortal}
                      size="sm"
                      classNames={{
                        label: "text-white",
                        wrapper: "after:bg-blue-500 after:text-white scale-75",
                      }}
                    />
                    <span className="text-white">Portal</span>
                  </div>

                  {canUsePortal && (
                    <Input
                      type="email"
                      placeholder="Correo electrónico"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      classNames={{
                        input: "text-white",
                        inputWrapper: "bg-gray-900/70 border border-gray-700",
                      }}
                    />
                  )}
                </div>

                <Button
                  color="primary"
                  startContent={<Plus size={20} />}
                  onClick={() => {
                    if (!newUserName.trim()) {
                      toast.error("Por favor ingrese el nombre del usuario");
                      return;
                    }

                    if (!canUseSigesBot && !canUsePortal) {
                      toast.error("Debe seleccionar al menos una opción (SIGES BOT o Portal)");
                      return;
                    }

                    // Validar teléfono si marcó SIGES BOT
                    if (canUseSigesBot) {
                      if (!userPhone || userPhone.length !== 10) {
                        toast.error("El teléfono debe tener exactamente 10 dígitos");
                        return;
                      }

                      // Verificar si ya existe un usuario con el mismo teléfono
                      const existingUserWithPhone = users.find(
                        (u) => u.sigesBot?.phone === userPhone
                      );
                      if (existingUserWithPhone) {
                        toast.error(`Ya existe un usuario con el teléfono "${userPhone}"`);
                        return;
                      }
                    }

                    // Validar email si marcó Portal
                    if (canUsePortal) {
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (!userEmail || !emailRegex.test(userEmail)) {
                        toast.error("Por favor ingrese un correo electrónico válido");
                        return;
                      }

                      // Verificar si ya existe un usuario con el mismo email
                      const existingUserWithEmail = users.find(
                        (u) => u.portal?.email === userEmail.toLowerCase()
                      );
                      if (existingUserWithEmail) {
                        toast.error(`Ya existe un usuario con el correo "${userEmail}"`);
                        return;
                      }
                    }

                    // Crear nuevo usuario unificado
                    const newUser: any = {
                      name: newUserName.trim(),
                    };

                    if (canUseSigesBot) {
                      newUser.sigesBot = {
                        phone: userPhone,
                      };
                    }

                    if (canUsePortal) {
                      newUser.portal = {
                        email: userEmail,
                      };
                    }

                    setUsers([...users, newUser]);

                    // Limpiar formulario
                    setNewUserName("");
                    setUserPhone("");
                    setUserEmail("");
                    setCanUseSigesBot(false);
                    setCanUsePortal(false);

                    toast.success("Usuario agregado exitosamente");
                  }}
                  className="text-white"
                >
                  Agregar Usuario
                </Button>
              </div>

              {/* Lista unificada de usuarios */}
              {users.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                    Usuarios Agregados ({users.length})
                  </h3>
                  {users.map((user, index) => (
                    <div
                      key={index}
                      className="bg-gray-900/50 border border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <p className="text-white font-semibold text-lg">{user.name}</p>

                          <div className="grid grid-cols-2 gap-4">
                            {/* Columna SIGES BOT */}
                            <div>
                              <p className="text-xs text-gray-400 mb-1">SIGES BOT</p>
                              {user.sigesBot ? (
                                <div className="bg-purple-500/10 border border-purple-400/30 rounded px-3 py-2">
                                  <p className="text-purple-300 text-sm font-medium">✓ Activo</p>
                                  <p className="text-white text-sm">{user.sigesBot.phone}</p>
                                </div>
                              ) : (
                                <div className="bg-gray-800/50 border border-gray-700 rounded px-3 py-2">
                                  <p className="text-gray-500 text-sm">No configurado</p>
                                </div>
                              )}
                            </div>

                            {/* Columna Portal */}
                            <div>
                              <p className="text-xs text-gray-400 mb-1">Portal</p>
                              {user.portal ? (
                                <div className="bg-blue-500/10 border border-blue-400/30 rounded px-3 py-2">
                                  <p className="text-blue-300 text-sm font-medium">✓ Activo</p>
                                  <p className="text-white text-sm">{user.portal.email}</p>
                                </div>
                              ) : (
                                <div className="bg-gray-800/50 border border-gray-700 rounded px-3 py-2">
                                  <p className="text-gray-500 text-sm">No configurado</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <Button
                          isIconOnly
                          size="sm"
                          color="danger"
                          variant="flat"
                          onClick={() => {
                            setUsers(users.filter((_, i) => i !== index));
                            toast.success("Usuario eliminado");
                          }}
                        >
                          <Trash2 size={18} className="text-white" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Botón finalizar */}
              <div className="flex justify-end pt-4">
                <Button
                  color="success"
                  size="lg"
                  isDisabled={users.length === 0}
                  onClick={() => {
                    if (users.length === 0) {
                      toast.error("Debes agregar al menos un usuario");
                      return;
                    }

                    // Separar usuarios para los arrays correspondientes
                    const botUsers = users
                      .filter((u) => u.sigesBot)
                      .map((u) => ({
                        name: u.name,
                        phone: u.sigesBot!.phone,
                        canSOS: false,
                        adminPdf: false,
                        manager: false,
                        area: null,
                        email: null,
                        clientId: currentUser?.clientId || "",
                        createdBy: "Portal",
                      }));

                    const portalUsers = users
                      .filter((u) => u.portal)
                      .map((u) => ({
                        name: u.name,
                        email: u.portal!.email,
                        password: u.portal!.email,
                        role: "Cliente",
                        status: 1,
                        razonSocial: currentUser?.razonSocial || "",
                        clientId: currentUser?.clientId || "",
                        owner: false,
                      }));

                    // Guardar en localStorage
                    localStorage.setItem("onboarding_users", JSON.stringify(users));
                    localStorage.setItem("onboarding_botUsers", JSON.stringify(botUsers));
                    localStorage.setItem("onboarding_portalUsers", JSON.stringify(portalUsers));

                    // Marcar paso 2 como completado
                    setStep2Completed(true);
                    localStorage.setItem("onboarding_step2", "true");

                    // Volver a la vista principal
                    setShowStep2Config(false);

                    toast.success("¡Paso 2 completado exitosamente!");
                  }}
                  className="text-white"
                >
                  Finalizar
                </Button>
              </div>

              {users.length === 0 && (
                <p className="text-gray-500 text-sm text-center">
                  Debes agregar al menos un usuario para continuar
                </p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  // Si está en configuración del Paso 1, mostrar las vistas correspondientes
  if (showStep1Config) {
    if (step1ConfigView === "areas") {
      // Vista 1: Configurar Áreas/Sectores
      return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
          <div className="absolute top-6 left-6">
            <h1 className="text-3xl font-bold text-white tracking-wider">SIGES</h1>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Botón volver */}
            <Button
              variant="flat"
              startContent={<ArrowLeft size={20} />}
              onClick={() => setShowStep1Config(false)}
              className="mb-6 text-gray-400 hover:text-white"
            >
              Volver
            </Button>

            <Card className="bg-gray-800/50 border border-gray-700/50">
              <CardHeader>
                <h2 className="text-2xl font-bold text-white">Paso 1: Configurar Sectores</h2>
              </CardHeader>
              <CardBody className="space-y-6">
                <p className="text-gray-400">
                  Define los sectores o áreas de tu organización. Puedes agregar hasta 4 sectores.
                </p>

                {/* Lista de áreas */}
                <div className="space-y-3">
                  {areas.map((area, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-900/50 border border-gray-700 rounded-lg p-4"
                    >
                      <span className="text-white font-medium">{area}</span>
                      <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        variant="flat"
                        onClick={() => {
                          setAreas(areas.filter((_, i) => i !== index));
                          // Eliminar dispositivos de esta área
                          setDevices(devices.filter((d) => d.area !== area));
                          toast.success(`Sector "${area}" eliminado`);
                        }}
                      >
                        <Trash2 size={18} className="text-white" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Agregar nueva área */}
                {areas.length < 4 && (
                  <div className="flex gap-3">
                    <Input
                      placeholder="Nombre del sector (ej: Playa, Tienda, Administración)"
                      value={newAreaName}
                      onChange={(e) => setNewAreaName(e.target.value)}
                      classNames={{
                        input: "text-white",
                        inputWrapper: "bg-gray-900/70 border border-gray-700",
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && newAreaName.trim()) {
                          if (areas.includes(newAreaName.trim())) {
                            toast.error("Este sector ya existe");
                            return;
                          }
                          setAreas([...areas, newAreaName.trim()]);
                          setNewAreaName("");
                          toast.success("Sector agregado");
                        }
                      }}
                    />
                    <Button
                      color="primary"
                      startContent={<Plus size={20} />}
                      onClick={() => {
                        if (!newAreaName.trim()) {
                          toast.error("Por favor ingrese un nombre para el sector");
                          return;
                        }
                        if (areas.includes(newAreaName.trim())) {
                          toast.error("Este sector ya existe");
                          return;
                        }
                        setAreas([...areas, newAreaName.trim()]);
                        setNewAreaName("");
                        toast.success("Sector agregado");
                      }}
                      className="text-white"
                    >
                      Agregar
                    </Button>
                  </div>
                )}

                {areas.length >= 4 && (
                  <p className="text-yellow-400 text-sm">
                    Has alcanzado el límite máximo de 4 sectores
                  </p>
                )}

                {/* Botón siguiente */}
                <div className="flex justify-end pt-4">
                  <Button
                    color="primary"
                    size="lg"
                    isDisabled={areas.length === 0}
                    onClick={() => {
                      if (areas.length === 0) {
                        toast.error("Debes agregar al menos un sector");
                        return;
                      }
                      setStep1ConfigView("devices");
                      toast.info("Ahora agrega los puestos de trabajo para cada sector");
                    }}
                    className="text-white"
                  >
                    Siguiente
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      );
    } else if (step1ConfigView === "devices") {
      // Vista 2: Configurar Dispositivos/Puestos de Trabajo
      return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
          <div className="absolute top-6 left-6">
            <h1 className="text-3xl font-bold text-white tracking-wider">SIGES</h1>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Botón volver */}
            <Button
              variant="flat"
              startContent={<ArrowLeft size={20} />}
              onClick={() => setStep1ConfigView("areas")}
              className="mb-6 text-gray-400 hover:text-white"
            >
              Volver
            </Button>

            <Card className="bg-gray-800/50 border border-gray-700/50">
              <CardHeader>
                <h2 className="text-2xl font-bold text-white">
                  Paso 1: Agregar Puestos de Trabajo
                </h2>
              </CardHeader>
              <CardBody className="space-y-6">
                <p className="text-gray-400">
                  Agrega los puestos de trabajo para cada sector. Mínimo 1 por sector, máximo 10 por
                  sector.
                </p>

                {/* Mostrar dispositivos por área */}
                {areas.map((area) => {
                  const areaDevices = devices.filter((d) => d.area === area);
                  const canAddMore = areaDevices.length < 10;

                  return (
                    <div key={area} className="space-y-3">
                      <h3 className="text-lg font-semibold text-blue-300 flex items-center justify-between">
                        {area}
                        <span className="text-sm text-gray-400">({areaDevices.length}/10)</span>
                      </h3>

                      {/* Lista de dispositivos del área */}
                      {areaDevices.map((device, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 bg-gray-900/50 border border-gray-700 rounded-lg p-3"
                        >
                          <div className="flex-1 grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-gray-400">Alias</p>
                              <p className="text-white">{device.alias}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">TeamViewer ID</p>
                              <p className="text-white">{device.teamviewer_id}</p>
                            </div>
                          </div>
                          <Button
                            isIconOnly
                            size="sm"
                            color="danger"
                            variant="flat"
                            onClick={() => {
                              setDevices(
                                devices.filter(
                                  (_, i) =>
                                    !(
                                      devices[i].alias === device.alias &&
                                      devices[i].teamviewer_id === device.teamviewer_id &&
                                      devices[i].area === device.area
                                    )
                                )
                              );
                              toast.success("Puesto eliminado");
                            }}
                          >
                            <Trash2 size={18} className="text-white" />
                          </Button>
                        </div>
                      ))}

                      {/* Formulario para agregar dispositivo */}
                      {canAddMore && (
                        <div className="flex gap-3 bg-gray-900/30 border border-gray-700/50 rounded-lg p-3">
                          <Input
                            placeholder="Alias"
                            size="sm"
                            classNames={{
                              input: "text-white",
                              inputWrapper: "bg-gray-900/70 border border-gray-700",
                            }}
                            id={`alias-${area}`}
                            key={`alias-${area}-${areaDevices.length}`}
                          />
                          <Input
                            placeholder="TeamViewer ID"
                            size="sm"
                            classNames={{
                              input: "text-white",
                              inputWrapper: "bg-gray-900/70 border border-gray-700",
                            }}
                            id={`tv-${area}`}
                            key={`tv-${area}-${areaDevices.length}`}
                          />
                          <Button
                            size="sm"
                            color="primary"
                            startContent={<Plus size={18} />}
                            onClick={() => {
                              const aliasInput = document.getElementById(
                                `alias-${area}`
                              ) as HTMLInputElement;
                              const tvInput = document.getElementById(
                                `tv-${area}`
                              ) as HTMLInputElement;

                              const alias = aliasInput?.value.trim();
                              const teamviewer_id = tvInput?.value.trim();

                              if (!alias || !teamviewer_id) {
                                toast.error("Por favor completa todos los campos");
                                return;
                              }

                              // Verificar si ya existe un dispositivo con el mismo TeamViewer ID
                              const existingDevice = devices.find(
                                (d) => d.teamviewer_id === teamviewer_id
                              );
                              if (existingDevice) {
                                toast.error(
                                  `Ya existe un puesto con el TeamViewer ID "${teamviewer_id}" en el sector "${existingDevice.area}"`
                                );
                                return;
                              }

                              setDevices([...devices, { alias, teamviewer_id, area }]);

                              // Limpiar los inputs
                              if (aliasInput) aliasInput.value = "";
                              if (tvInput) tvInput.value = "";

                              toast.success("Puesto agregado");
                            }}
                            className="text-white"
                          >
                            Agregar
                          </Button>
                        </div>
                      )}

                      {!canAddMore && (
                        <p className="text-yellow-400 text-sm">
                          Has alcanzado el límite de 10 puestos para este sector
                        </p>
                      )}
                    </div>
                  );
                })}

                {/* Botón siguiente */}
                <div className="flex justify-end pt-4">
                  <Button
                    color="primary"
                    size="lg"
                    isDisabled={!areas.every((area) => devices.some((d) => d.area === area))}
                    onClick={() => {
                      // Verificar que cada área tenga al menos un dispositivo
                      const areasWithoutDevices = areas.filter(
                        (area) => !devices.some((d) => d.area === area)
                      );

                      if (areasWithoutDevices.length > 0) {
                        toast.error(
                          `Debes agregar al menos un puesto para: ${areasWithoutDevices.join(", ")}`
                        );
                        return;
                      }

                      // Ir a la vista de resumen
                      setStep1ConfigView("summary");
                      toast.info("Revisa la configuración antes de finalizar");
                    }}
                    className="text-white"
                  >
                    Siguiente
                  </Button>
                </div>

                {!areas.every((area) => devices.some((d) => d.area === area)) && (
                  <p className="text-gray-500 text-sm text-center">
                    Debes agregar al menos un puesto de trabajo para cada sector
                  </p>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      );
    } else {
      // Vista 3: Resumen y Confirmación
      return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
          <div className="absolute top-6 left-6">
            <h1 className="text-3xl font-bold text-white tracking-wider">SIGES</h1>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Botón volver */}
            <Button
              variant="flat"
              startContent={<ArrowLeft size={20} />}
              onClick={() => setStep1ConfigView("devices")}
              className="mb-6 text-gray-400 hover:text-white"
            >
              Volver
            </Button>

            <Card className="bg-gray-800/50 border border-gray-700/50">
              <CardHeader>
                <h2 className="text-2xl font-bold text-white">Paso 1: Resumen de Configuración</h2>
              </CardHeader>
              <CardBody className="space-y-6">
                <p className="text-gray-400">
                  Revisa la configuración antes de finalizar. Puedes volver atrás para hacer
                  cambios.
                </p>

                {/* Resumen por sector */}
                {areas.map((area) => {
                  const areaDevices = devices.filter((d) => d.area === area);

                  return (
                    <div key={area} className="space-y-3">
                      <h3 className="text-lg font-semibold text-blue-300 flex items-center justify-between border-b border-gray-700 pb-2">
                        {area}
                        <span className="text-sm text-gray-400">
                          {areaDevices.length} puesto{areaDevices.length !== 1 ? "s" : ""}
                        </span>
                      </h3>

                      <div className="grid gap-2">
                        {areaDevices.map((device, index) => (
                          <div
                            key={index}
                            className="bg-gray-900/50 border border-gray-700 rounded-lg p-3"
                          >
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs text-gray-400">Alias</p>
                                <p className="text-white font-medium">{device.alias}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">TeamViewer ID</p>
                                <p className="text-white font-medium">{device.teamviewer_id}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Resumen total */}
                <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                  <h4 className="text-blue-300 font-semibold mb-2">Resumen Total</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Total de sectores:</p>
                      <p className="text-white font-semibold text-lg">{areas.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Total de puestos:</p>
                      <p className="text-white font-semibold text-lg">{devices.length}</p>
                    </div>
                  </div>
                </div>

                {/* Botón finalizar */}
                <div className="flex justify-end pt-4">
                  <Button
                    color="success"
                    size="lg"
                    onClick={() => {
                      // Guardar en localStorage
                      localStorage.setItem("onboarding_areas", JSON.stringify(areas));
                      localStorage.setItem("onboarding_devices", JSON.stringify(devices));

                      // Marcar paso 1 como completado
                      setStep1Completed(true);
                      localStorage.setItem("onboarding_step1", "true");

                      // Volver a la vista principal
                      setShowStep1Config(false);

                      toast.success("¡Paso 1 completado exitosamente!");
                    }}
                    className="text-white"
                  >
                    Finalizar
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Logo SIGES en la parte superior */}
      <div className="absolute top-6 left-6">
        <h1 className="text-3xl font-bold text-white tracking-wider">SIGES</h1>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400">
              <Building2 size={32} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">¡Bienvenido a SIGES!</h1>
          <p className="text-gray-400 text-lg">Completemos la configuración de tu organización</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Información de la organización */}
          <Card className="bg-gray-800/50 border border-gray-700/50 lg:col-span-1 h-fit">
            <CardHeader className="pb-2">
              <h2 className="text-lg font-semibold text-white">Información de su organización</h2>
            </CardHeader>
            <CardBody className="pt-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  <span className="text-gray-300 text-sm">
                    <span className="font-medium text-white">Razón Social:</span>{" "}
                    {currentUser?.razonSocial}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  <span className="text-gray-300 text-sm">
                    <span className="font-medium text-white">Correo:</span> {currentUser?.email}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Información importante sobre el proceso */}
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-2 border-blue-400/50 lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">
                  ¿Por qué es importante esta configuración?
                </h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                Este proceso de configuración inicial está diseñado para{" "}
                <span className="font-semibold text-white">
                  optimizar y agilizar la operación de soporte
                </span>{" "}
                cuando se generen incidencias en su organización.
              </p>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  </div>
                  <p className="text-gray-300 text-sm">
                    <span className="font-semibold text-white">Puestos de trabajo:</span> Permiten
                    identificar rápidamente dónde ocurre el incidente y brindan acceso inmediato a
                    nuestros operadores para comenzar a trabajar en la solución.
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  </div>
                  <p className="text-gray-300 text-sm">
                    <span className="font-semibold text-white">Portal Web:</span> Sus usuarios
                    podrán generar tickets de soporte de manera rápida y realizar seguimiento en
                    tiempo real del estado de sus incidencias.
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                  <p className="text-gray-300 text-sm">
                    <span className="font-semibold text-white">SIGES BOT (WhatsApp):</span> Ofrece
                    una forma más intuitiva y ágil de generar tickets mediante conversación,
                    simplificando el proceso de reporte de incidencias.
                  </p>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3 mt-4">
                <p className="text-blue-200 text-sm font-medium">
                  💡 Una configuración completa garantiza tiempos de respuesta más rápidos y una
                  mejor experiencia de soporte para su equipo.
                </p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Próximos pasos */}
        <Card className="bg-gray-800/50 border border-gray-700/50">
          <CardHeader>
            <h2 className="text-xl font-semibold text-white">Próximos pasos</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {/* Paso 1 */}
              <div
                className={`${
                  step1Completed
                    ? "bg-blue-500/20 border-blue-400/50"
                    : "bg-blue-500/10 border-blue-400/30"
                } border rounded-lg p-4 flex items-center justify-between gap-4`}
              >
                <div className="flex-1">
                  <h3 className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
                    {step1Completed && <CheckCircle2 size={20} className="text-emerald-400" />}
                    📋 Paso 1: Configurar puestos de trabajo
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Registra los puestos de trabajo de tu organización para comenzar a gestionar tu
                    operación.
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  {step1Completed && (
                    <Button
                      color="default"
                      variant="flat"
                      size="sm"
                      startContent={<Edit size={18} />}
                      onClick={() => {
                        // Cargar datos guardados
                        const savedAreas = localStorage.getItem("onboarding_areas");
                        const savedDevices = localStorage.getItem("onboarding_devices");

                        if (savedAreas) setAreas(JSON.parse(savedAreas));
                        if (savedDevices) setDevices(JSON.parse(savedDevices));

                        // Abrir configuración
                        setShowStep1Config(true);
                        setStep1ConfigView("areas");
                        toast.info("Editando configuración del Paso 1");
                      }}
                      className="text-white"
                    >
                      Editar
                    </Button>
                  )}
                  <Button
                    color={step1Completed ? "success" : "primary"}
                    variant="solid"
                    size="sm"
                    onClick={() => {
                      if (!step1Completed) {
                        // Abrir configuración
                        setShowStep1Config(true);
                        setStep1ConfigView("areas");
                      } else {
                        // Desmarcar como completado
                        setStep1Completed(false);
                        localStorage.setItem("onboarding_step1", "false");
                        toast.info("Paso 1 marcado como incompleto");
                      }
                    }}
                    className="min-w-[120px] text-white"
                  >
                    {step1Completed ? "Completado ✓" : "Completar"}
                  </Button>
                </div>
              </div>

              {/* Paso 2 */}
              <div
                className={`${
                  step2Completed
                    ? "bg-purple-500/20 border-purple-400/50"
                    : "bg-purple-500/10 border-purple-400/30"
                } border rounded-lg p-4 flex items-center justify-between gap-4`}
              >
                <div className="flex-1">
                  <h3 className="text-purple-300 font-semibold mb-2 flex items-center gap-2">
                    {step2Completed && <CheckCircle2 size={20} className="text-emerald-400" />}
                    👥 Paso 2: Agregar usuarios
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Invita a los miembros de tu equipo para que puedan acceder al sistema.
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  {step2Completed && (
                    <Button
                      color="default"
                      variant="flat"
                      size="sm"
                      startContent={<Edit size={18} />}
                      onClick={() => {
                        // Cargar datos guardados
                        const savedUsers = localStorage.getItem("onboarding_users");

                        if (savedUsers) setUsers(JSON.parse(savedUsers));

                        // Abrir configuración
                        setShowStep2Config(true);
                        toast.info("Editando configuración del Paso 2");
                      }}
                      className="text-white"
                    >
                      Editar
                    </Button>
                  )}
                  <Button
                    color={step2Completed ? "success" : "primary"}
                    variant="solid"
                    size="sm"
                    onClick={() => {
                      if (!step2Completed) {
                        // Abrir configuración
                        setShowStep2Config(true);
                      } else {
                        // Desmarcar como completado
                        setStep2Completed(false);
                        localStorage.setItem("onboarding_step2", "false");
                        toast.info("Paso 2 marcado como incompleto");
                      }
                    }}
                    className="min-w-[120px] text-white"
                  >
                    {step2Completed ? "Completado ✓" : "Completar"}
                  </Button>
                </div>
              </div>

              {/* Paso 3 */}
              <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-lg p-4 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-emerald-300 font-semibold mb-2">
                    ✅ Paso 3: Empezá a utilizar las herramientas de soporte de SIGES
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Una vez completada la configuración, podrás acceder a todas las funcionalidades
                    del sistema.
                  </p>
                  {(!step1Completed || !step2Completed) && (
                    <p className="text-gray-500 text-xs mt-2">
                      Completa los pasos anteriores para continuar
                    </p>
                  )}
                </div>
                <Button
                  color="success"
                  size="sm"
                  className="min-w-[120px] bg-gradient-to-r from-emerald-600 to-emerald-500"
                  isDisabled={!step1Completed || !step2Completed}
                  isLoading={isSubmitting}
                  onClick={async () => {
                    setIsSubmitting(true);
                    try {
                      const savedDevices = localStorage.getItem("onboarding_devices");
                      const savedBotUsers = localStorage.getItem("onboarding_botUsers");
                      const savedPortalUsers = localStorage.getItem("onboarding_portalUsers");

                      const devicesData = savedDevices ? JSON.parse(savedDevices) : [];
                      const botUsersData = savedBotUsers ? JSON.parse(savedBotUsers) : [];
                      const portalUsersData = savedPortalUsers ? JSON.parse(savedPortalUsers) : [];

                      // Extraer bandera e identificador del clientId
                      const clientId = currentUser?.clientId || "";
                      const banderaMatch = clientId.match(/^([A-Z]{2})/);
                      const bandera = banderaMatch ? banderaMatch[1] : "";
                      const identificador = clientId.substring(2);

                      // Transformar devices
                      const devices = devicesData.map((device: any) => {
                        // Obtener solo la inicial del área
                        const areaInicial = (device.area || "").charAt(0).toUpperCase();
                        const tvalias = `${currentUser?.razonSocial}|${bandera}|${identificador}|${areaInicial}|**|**`;
                        return {
                          alias: device.alias,
                          teamviewer_id: device.teamviewer_id,
                          clientId: clientId,
                          bandera: bandera,
                          identificador: identificador,
                          razonSocial: currentUser?.razonSocial || "",
                          ciudad: "",
                          area: device.area,
                          prefijo: "**",
                          extras: "**",
                          tvalias: tvalias,
                        };
                      });

                      // Transformar botUsers
                      const botusers = botUsersData.map((user: any) => ({
                        name: user.name,
                        phone: `549${user.phone}`,
                        createUser: false,
                        canSOS: user.canSOS,
                        adminPdf: user.adminPdf,
                        manager: user.manager,
                        area: user.area,
                        email: user.email,
                        clientId: user.clientId,
                        createdBy: "Onboarding",
                      }));

                      // Transformar webUsers - SOLO los nuevos usuarios (el owner ya existe)
                      const webusers = portalUsersData.map((user: any) => ({
                        name: user.name,
                        email: user.email,
                        password: user.password,
                        role: user.role,
                        status: 0,
                        razonSocial: user.razonSocial,
                        clientId: user.clientId,
                        owner: false,
                      }));

                      // Crear objeto client (email del owner logueado)
                      const client = {
                        id: clientId,
                        email: [currentUser?.email || ""],
                        info: currentUser?.razonSocial || "",
                      };

                      // Construir payload final
                      const payload = {
                        devices,
                        botusers,
                        webusers,
                        client,
                      };

                      console.log(payload);

                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      toast.success("Configuración completada! Ver consola");
                    } catch (error) {
                      console.error("Error:", error);
                      toast.error("Error al completar la configuración");
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                >
                  {isSubmitting ? "Enviando..." : "Enviar"}
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
