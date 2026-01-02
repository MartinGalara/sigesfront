import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Tabs,
  Tab,
  Spinner,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Search, UserCheck, UserX, Edit, AlertTriangle, CheckCircle2, X, Plus } from "lucide-react";
import { Select, SelectItem, Autocomplete, AutocompleteItem } from "@heroui/react";
import { userService, clientService, authService } from "../api";
import { toast } from "react-toastify";

interface User {
  id: string;
  firstName: string;
  razonSocial: string;
  email: string;
  role: string;
  status: number;
  clientInfo?: {
    info: string;
    email: string;
  };
  dbRazonSocial?: string;
  globalEmail?: string;
}

interface ClientOption {
  id: string;
  info: string;
  email: string;
  vip: boolean;
  vipmail: string;
  testing: boolean;
}

interface CreateUserForm {
  firstName: string;
  email: string;
  selectedClientId?: string;
  clientSearchQuery?: string;
}

export function GestionUsuarios() {
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [selectedSubsection, setSelectedSubsection] = useState("UsuariosDadosDeAlta");
  const [searchQueryAlta, setSearchQueryAlta] = useState("");
  const [searchQueryPorDarAlta, setSearchQueryPorDarAlta] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<{
    id: string;
    action: "activate" | "deactivate";
    name?: string;
  } | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<"Admin" | "Cliente">("Cliente");

  // Estados para crear usuario
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [createUserForm, setCreateUserForm] = useState<CreateUserForm>({
    firstName: "",
    email: "",
    selectedClientId: "",
    clientSearchQuery: "",
  });
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Obtener datos del usuario logueado
  const currentUser =
    authService.getStoredUser?.() || JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = currentUser?.role === "Admin";
  const isOwnerClient = currentUser?.role === "Cliente" && currentUser?.owner === true;

  useEffect(() => {
    loadUsers();
    loadClients();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getUsers();
      const processedUsers = data.map((user: any) => {
        if (user.status === 0) {
          user.dbRazonSocial = user.clientInfo?.info || "";
          user.globalEmail = user.clientInfo?.email || "";
        }
        return user;
      });
      setUsers(processedUsers);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      const data = await clientService.getClients();
      // Mapear los datos del backend al formato que necesitamos
      const mappedClients: ClientOption[] = data.map((client: any) => ({
        id: client.id.toString(),
        info: client.info,
        email: client.email,
        vip: client.vip,
        vipmail: client.vipmail,
        testing: client.testing,
      }));
      setClients(mappedClients);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
      toast.error("Error al cargar la lista de clientes");
    }
  };

  const openCreateUser = () => {
    setCreateUserForm({
      firstName: "",
      email: "",
      selectedClientId: "",
      clientSearchQuery: "",
    });
    setCreateUserOpen(true);
  };

  const handleCreateUser = async () => {
    if (!createUserForm.firstName.trim() || !createUserForm.email.trim()) {
      toast.error("Nombre y email son requeridos");
      return;
    }

    if (isAdmin && !createUserForm.selectedClientId) {
      toast.error("Debe seleccionar un cliente");
      return;
    }

    try {
      setIsCreatingUser(true);

      let userData;

      if (isOwnerClient) {
        // Cliente Owner: crear usuario vinculado a su organización
        userData = {
          firstName: createUserForm.firstName,
          email: createUserForm.email,
          password: createUserForm.email,
          role: "Cliente",
          status: 0,
          razonSocial: currentUser.razonSocial,
          clientId: currentUser.clientId,
          owner: false,
        };
      } else if (isAdmin) {
        // Admin: crear usuario para el cliente seleccionado
        const selectedClient = clients.find((c) => c.id === createUserForm.selectedClientId);
        if (!selectedClient) {
          toast.error("Cliente seleccionado no encontrado");
          return;
        }

        userData = {
          firstName: createUserForm.firstName,
          email: createUserForm.email,
          password: createUserForm.email,
          role: "Cliente",
          status: 0,
          razonSocial: selectedClient.info,
          clientId: selectedClient.id,
          owner: false,
        };
      }

      if (!userData) {
        toast.error("Error al preparar los datos del usuario");
        return;
      }

      // Llamada real al backend para crear usuario
      await userService.createUser(userData);
      toast.success("Usuario creado exitosamente");
      setCreateUserOpen(false);
      loadUsers(); // Recargar la lista de usuarios
    } catch (error) {
      console.error("Error al crear usuario:", error);
      toast.error("Error al crear el usuario");
    } finally {
      setIsCreatingUser(false);
    }
  };

  const performActivate = async (userId: string) => {
    try {
      // Convertir el userId a número si la API lo requiere
      const userIdNumber = parseInt(userId);
      await userService.updateUser(userIdNumber, { status: 1 });
      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, status: 1 } : user)));
      toast.success("Usuario activado con éxito");
    } catch (error) {
      console.error("Error al activar usuario:", error);
      toast.error("Error al activar el usuario");
    }
  };

  const performDeactivate = async (userId: string) => {
    try {
      const userIdNumber = parseInt(userId);
      await userService.updateUser(userIdNumber, { status: 0 });
      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, status: 0 } : user)));
      toast.success("Usuario desactivado con éxito");
    } catch (error) {
      console.error("Error al desactivar usuario:", error);
      toast.error("Error al desactivar el usuario");
    }
  };

  const openEdit = (user: User) => {
    setEditUser(user);
    setNewRole(user.role === "Admin" ? "Admin" : "Cliente");
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editUser) return;
    try {
      const userIdNumber = parseInt(editUser.id);
      await userService.updateUser(userIdNumber, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === editUser.id ? { ...u, role: newRole } : u)));
      toast.success("Rol actualizado con éxito");
      setEditOpen(false);
      setEditUser(null);
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      toast.error("Error al actualizar el rol");
    }
  };

  const requestConfirm = (id: string, action: "activate" | "deactivate", name?: string) => {
    setConfirmTarget({ id, action, name });
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!confirmTarget) return;
    const { id, action } = confirmTarget;
    setConfirmOpen(false);
    if (action === "activate") await performActivate(id);
    else await performDeactivate(id);
    setConfirmTarget(null);
  };

  // Función para filtrar y ordenar clientes
  const getFilteredAndSortedClients = () => {
    const searchQuery = createUserForm.clientSearchQuery?.toLowerCase() || "";

    return clients
      .filter((client) => {
        if (!searchQuery) return true;
        return (
          client.info.toLowerCase().includes(searchQuery) ||
          client.id.toLowerCase().includes(searchQuery)
        );
      })
      .sort((a, b) => a.info.localeCompare(b.info));
  };

  const filteredUsuariosDadosDeAlta = users
    .filter((user) => user.status === 1)
    .filter(
      (user) =>
        user.firstName?.toLowerCase().includes(searchQueryAlta.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQueryAlta.toLowerCase()) ||
        user.razonSocial?.toLowerCase().includes(searchQueryAlta.toLowerCase())
    );

  const filteredUsuariosPorDarDeAlta = users
    .filter((user) => user.status === 0)
    .filter(
      (user) =>
        user.firstName?.toLowerCase().includes(searchQueryPorDarAlta.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQueryPorDarAlta.toLowerCase()) ||
        user.dbRazonSocial?.toLowerCase().includes(searchQueryPorDarAlta.toLowerCase()) ||
        user.globalEmail?.toLowerCase().includes(searchQueryPorDarAlta.toLowerCase())
    );

  const renderUserRow = (user: User, isActive: boolean) => {
    return (
      <TableRow key={user.id}>
        <TableCell className="text-white text-center align-middle">{user.firstName}</TableCell>
        <TableCell className="text-white text-center align-middle">
          {isActive ? user.email : user.globalEmail || user.email}
        </TableCell>
        <TableCell className="text-white text-center align-middle">
          {isActive ? user.razonSocial : user.dbRazonSocial || user.razonSocial}
        </TableCell>
        <TableCell className="text-white text-center align-middle">
          <Chip color={user.role === "Admin" ? "danger" : "primary"} variant="flat" size="sm">
            {user.role}
          </Chip>
        </TableCell>
        <TableCell className="text-white text-center align-middle">
          <div className="flex items-center justify-center gap-2">
            <Button
              size="sm"
              color="primary"
              variant="flat"
              startContent={<Edit size={16} />}
              onClick={() => openEdit(user)}
              className="font-semibold rounded-lg bg-gradient-to-r from-sky-600/80 to-sky-400/60 text-white shadow-md hover:from-sky-500 hover:to-sky-300 transition-all duration-200 focus:ring-2 focus:ring-sky-400/60 px-3"
            >
              <span className="inline-flex items-center gap-1">
                <span className="hidden md:inline">Editar</span>
                <Edit size={16} className="md:hidden" />
              </span>
            </Button>
            {isActive ? (
              <Button
                size="sm"
                color="danger"
                variant="flat"
                onClick={() => requestConfirm(user.id, "deactivate", user.firstName)}
                className="font-semibold rounded-lg bg-gradient-to-r from-amber-600/80 to-amber-400/60 text-white shadow-md hover:from-amber-500 hover:to-amber-300 transition-all duration-200 focus:ring-2 focus:ring-amber-400/60 px-3 flex items-center gap-1"
              >
                <UserX size={16} />
                <span>Desactivar</span>
              </Button>
            ) : (
              <Button
                size="sm"
                color="success"
                variant="flat"
                onClick={() => requestConfirm(user.id, "activate", user.firstName)}
                className="font-semibold rounded-lg bg-gradient-to-r from-emerald-600/80 to-emerald-400/60 text-white shadow-md hover:from-emerald-500 hover:to-emerald-300 transition-all duration-200 focus:ring-2 focus:ring-emerald-400/60 px-3 flex items-center gap-1"
              >
                <UserCheck size={16} />
                <span>Activar</span>
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
    );
  };

  const renderUserCard = (user: User, isActive: boolean) => {
    return (
      <div key={user.id} className="rounded-xl bg-gray-900/40 border border-gray-700/50 p-4 shadow">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-white">{user.firstName}</h3>
          <Chip color={user.role === "Admin" ? "danger" : "primary"} variant="flat" size="sm">
            {user.role}
          </Chip>
        </div>
        <div className="mt-2 text-sm text-gray-300 space-y-1">
          <div>
            <span className="text-gray-400">Email: </span>
            <span>{isActive ? user.email : user.globalEmail || user.email}</span>
          </div>
          <div>
            <span className="text-gray-400">Razón social: </span>
            <span>{isActive ? user.razonSocial : user.dbRazonSocial || user.razonSocial}</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            size="sm"
            color="primary"
            variant="flat"
            startContent={<Edit size={16} />}
            onClick={() => openEdit(user)}
            className="w-full font-semibold rounded-lg bg-gradient-to-r from-emerald-600/80 to-emerald-400/60 text-white shadow-md hover:from-emerald-500 hover:to-emerald-300 transition-all duration-200 focus:ring-2 focus:ring-emerald-400/60"
          >
            Editar
          </Button>
          {isActive ? (
            <Button
              size="sm"
              color="danger"
              variant="flat"
              onClick={() => requestConfirm(user.id, "deactivate", user.firstName)}
              className="w-full font-semibold rounded-lg bg-gradient-to-r from-amber-600/80 to-amber-400/60 text-white shadow-md hover:from-amber-500 hover:to-amber-300 transition-all duration-200 focus:ring-2 focus:ring-amber-400/60 flex items-center justify-center gap-1"
            >
              <UserX size={16} />
              <span>Desactivar</span>
            </Button>
          ) : (
            <Button
              size="sm"
              color="success"
              variant="flat"
              onClick={() => requestConfirm(user.id, "activate", user.firstName)}
              className="w-full font-semibold rounded-lg bg-gradient-to-r from-emerald-600/80 to-emerald-400/60 text-white shadow-md hover:from-emerald-500 hover:to-emerald-300 transition-all duration-200 focus:ring-2 focus:ring-emerald-400/60 flex items-center justify-center gap-1"
            >
              <UserCheck size={16} />
              <span>Activar</span>
            </Button>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen text-white">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-center text-white mb-4">Gestión de Usuarios</h2>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              className={`px-5 py-2 rounded-xl font-semibold shadow transition-all duration-200 border-2 text-base focus:outline-none ${
                selectedSubsection === "UsuariosDadosDeAlta"
                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                  : "bg-gray-900/60 border-gray-700 text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-300 hover:border-emerald-400/40"
              }`}
              onClick={() => setSelectedSubsection("UsuariosDadosDeAlta")}
            >
              Usuarios Dados de Alta
            </button>
            <button
              className={`px-5 py-2 rounded-xl font-semibold shadow transition-all duration-200 border-2 text-base focus:outline-none ${
                selectedSubsection === "UsuariosPorDarDeAlta"
                  ? "bg-amber-500/20 border-amber-400 text-amber-300"
                  : "bg-gray-900/60 border-gray-700 text-gray-300 hover:bg-amber-500/10 hover:text-amber-300 hover:border-amber-400/40"
              }`}
              onClick={() => setSelectedSubsection("UsuariosPorDarDeAlta")}
            >
              Usuarios por Dar de Alta
            </button>
          </div>

          {/* Botón Crear Usuario - solo visible para Admin o Cliente Owner */}
          {(isAdmin || isOwnerClient) && (
            <Button
              color="primary"
              startContent={<Plus size={20} />}
              onClick={openCreateUser}
              className="font-semibold rounded-xl bg-gradient-to-r from-blue-600/80 to-blue-400/60 text-white shadow-md hover:from-blue-500 hover:to-blue-300 transition-all duration-200 focus:ring-2 focus:ring-blue-400/60 px-6 py-2"
            >
              Crear Usuario
            </Button>
          )}
        </div>
        <Tabs
          selectedKey={selectedSubsection}
          onSelectionChange={(key) => setSelectedSubsection(key as string)}
          className="hidden"
        >
          <Tab key="UsuariosDadosDeAlta" title="Usuarios Dados de Alta">
            <div className="space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:max-w-sm">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none">
                    <Search size={20} />
                  </span>
                  <input
                    type="text"
                    placeholder="Buscar usuarios activos..."
                    value={searchQueryAlta}
                    onChange={(e) => setSearchQueryAlta(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-900/80 border border-gray-700/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400 transition-all duration-200 shadow-sm hover:border-emerald-400/40"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-colors duration-200 group-focus-within:text-emerald-400">
                    {/* Puedes agregar un icono de limpiar o animación aquí si lo deseas */}
                  </span>
                </div>
                <Chip
                  color="success"
                  variant="flat"
                  className="font-semibold text-base px-4 py-2 bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 shadow-sm"
                >
                  {filteredUsuariosDadosDeAlta.length} usuarios activos
                </Chip>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {filteredUsuariosDadosDeAlta.map((user) => renderUserCard(user, true))}
              </div>

              {/* Desktop table with horizontal scroll */}
              <div className="hidden md:block overflow-x-auto">
                <div className="min-w-[900px]">
                  <Table
                    aria-label="Usuarios dados de alta"
                    className="bg-gray-900/30"
                    removeWrapper
                  >
                    <TableHeader>
                      <TableColumn className="text-center">NOMBRE</TableColumn>
                      <TableColumn className="text-center">EMAIL</TableColumn>
                      <TableColumn className="text-center">RAZÓN SOCIAL</TableColumn>
                      <TableColumn className="text-center">ROL</TableColumn>
                      <TableColumn className="text-center">ACCIONES</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent="No hay usuarios activos">
                      {filteredUsuariosDadosDeAlta.map((user) => renderUserRow(user, true))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </Tab>

          <Tab key="UsuariosPorDarDeAlta" title="Usuarios por Dar de Alta">
            <div className="space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:max-w-sm group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none">
                    <Search size={20} />
                  </span>
                  <input
                    type="text"
                    placeholder="Buscar usuarios pendientes..."
                    value={searchQueryPorDarAlta}
                    onChange={(e) => setSearchQueryPorDarAlta(e.target.value)}
                    className="w-full pl-11 pr-10 py-2.5 rounded-xl bg-gray-900/80 border border-gray-700/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400 transition-all duration-200 shadow-md hover:border-amber-400/40"
                  />
                  {searchQueryPorDarAlta && (
                    <button
                      type="button"
                      onClick={() => setSearchQueryPorDarAlta("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-400 transition-colors duration-200 focus:outline-none"
                      aria-label="Limpiar búsqueda"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>

                {/* Cambiar el Chip para que tenga el mismo estilo visual que el de usuarios activos */}
                <Chip
                  color="warning"
                  variant="flat"
                  className="font-semibold text-base px-4 py-2 bg-amber-500/10 border border-amber-400/30 text-amber-300 shadow-sm"
                >
                  {filteredUsuariosPorDarDeAlta.length} usuarios pendientes
                </Chip>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {filteredUsuariosPorDarDeAlta.map((user) => renderUserCard(user, false))}
              </div>

              {/* Desktop table with horizontal scroll */}
              <div className="hidden md:block overflow-x-auto">
                <div className="min-w-[900px]">
                  <Table
                    aria-label="Usuarios por dar de alta"
                    className="bg-gray-900/30"
                    removeWrapper
                  >
                    <TableHeader>
                      <TableColumn className="text-center">NOMBRE</TableColumn>
                      <TableColumn className="text-center">EMAIL</TableColumn>
                      <TableColumn className="text-center">RAZÓN SOCIAL</TableColumn>
                      <TableColumn className="text-center">ROL</TableColumn>
                      <TableColumn className="text-center">ACCIONES</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent="No hay usuarios pendientes de activación">
                      {filteredUsuariosPorDarDeAlta.map((user) => renderUserRow(user, false))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
      <Modal
        isOpen={confirmOpen}
        onOpenChange={setConfirmOpen}
        placement="center"
        backdrop="blur"
        hideCloseButton
      >
        <ModalContent className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700/60 text-white max-w-md mx-auto rounded-3xl shadow-2xl transform -translate-y-[8%]">
          {(onClose) => (
            <>
              {/* Custom close button on the right */}
              <Button
                isIconOnly
                variant="light"
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
                onPress={onClose}
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </Button>

              <ModalHeader className="flex items-center justify-center gap-3 px-8 py-6">
                {confirmTarget?.action === "activate" ? (
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 size={22} />
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/20 text-amber-400">
                    <AlertTriangle size={22} />
                  </span>
                )}
                <span className="text-lg font-semibold">
                  {confirmTarget?.action === "activate"
                    ? "Confirmar activación"
                    : "Confirmar desactivación"}
                </span>
              </ModalHeader>
              <ModalBody className="px-8 pb-6 -mt-2 text-center">
                <p className="text-gray-300 leading-relaxed">
                  {confirmTarget?.action === "activate"
                    ? `¿Deseas activar al usuario ${confirmTarget?.name ?? ""}?`
                    : `¿Deseas desactivar al usuario ${confirmTarget?.name ?? ""}?`}
                </p>
              </ModalBody>
              <ModalFooter className="flex items-center justify-center gap-3 px-8 py-6">
                <Button variant="flat" onPress={onClose} className="min-w-24">
                  Cancelar
                </Button>
                <Button
                  color={confirmTarget?.action === "activate" ? "success" : "danger"}
                  onPress={async () => {
                    await handleConfirm();
                    onClose();
                  }}
                  className="min-w-24"
                >
                  Confirmar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={editOpen}
        onOpenChange={setEditOpen}
        placement="center"
        backdrop="blur"
        hideCloseButton
      >
        <ModalContent className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700/60 text-white max-w-md mx-auto rounded-3xl shadow-2xl transform -translate-y-[8%]">
          {(onClose) => (
            <>
              <Button
                isIconOnly
                variant="light"
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
                onPress={onClose}
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </Button>
              <ModalHeader className="flex items-center justify-center gap-3 px-8 py-6">
                <span className="text-lg font-semibold">Editar usuario</span>
              </ModalHeader>
              <ModalBody className="px-8 pb-6 -mt-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Nombre</p>
                    <p className="text-white font-medium">{editUser?.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white font-medium">{editUser?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300 mb-2">Rol</p>
                    <Select
                      placeholder="Rol"
                      labelPlacement="inside"
                      selectedKeys={new Set([newRole])}
                      onSelectionChange={(keys) => {
                        const val = Array.from(keys as Set<string>)[0] as "Admin" | "Cliente";
                        setNewRole(val);
                      }}
                      classNames={{
                        trigger: "bg-gray-900/70 border border-gray-700 text-white",
                        value: "text-white",
                        label: "text-gray-300",
                        listbox: "text-white",
                        listboxWrapper: "bg-gray-900",
                        popoverContent: "bg-gray-900 border border-gray-700",
                      }}
                    >
                      <SelectItem key="Admin" className="text-white">
                        Admin
                      </SelectItem>
                      <SelectItem key="Cliente" className="text-white">
                        Cliente
                      </SelectItem>
                    </Select>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="flex items-center justify-center gap-3 px-8 py-6">
                <Button variant="flat" onPress={onClose} className="min-w-24">
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  className="min-w-24"
                  onPress={async () => {
                    await saveEdit();
                    onClose();
                  }}
                >
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Create User Modal */}
      <Modal
        isOpen={createUserOpen}
        onOpenChange={setCreateUserOpen}
        placement="center"
        backdrop="blur"
        hideCloseButton
      >
        <ModalContent className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700/60 text-white max-w-md mx-auto rounded-3xl shadow-2xl transform -translate-y-[8%]">
          {(onClose) => (
            <>
              <Button
                isIconOnly
                variant="light"
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
                onPress={onClose}
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </Button>
              <ModalHeader className="flex items-center justify-center gap-3 px-8 py-6">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 text-blue-400">
                  <Plus size={22} />
                </span>
                <span className="text-lg font-semibold">Crear Usuario</span>
              </ModalHeader>
              <ModalBody className="px-8 pb-6 -mt-2">
                <div className="space-y-4">
                  <div>
                    <Input
                      placeholder="Nombre"
                      value={createUserForm.firstName}
                      onChange={(e) =>
                        setCreateUserForm((prev) => ({ ...prev, firstName: e.target.value }))
                      }
                      classNames={{
                        input: "text-white",
                        inputWrapper: "bg-gray-900/70 border border-gray-700",
                      }}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Email"
                      type="email"
                      value={createUserForm.email}
                      onChange={(e) =>
                        setCreateUserForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      classNames={{
                        input: "text-white",
                        inputWrapper: "bg-gray-900/70 border border-gray-700",
                      }}
                    />
                  </div>

                  {/* Select de cliente solo para Admin */}
                  {isAdmin && (
                    <div>
                      <Autocomplete
                        placeholder="Buscar cliente por nombre o ID..."
                        selectedKey={createUserForm.selectedClientId || ""}
                        onSelectionChange={(key) => {
                          setCreateUserForm((prev) => ({
                            ...prev,
                            selectedClientId: key as string,
                          }));
                        }}
                        inputValue={createUserForm.clientSearchQuery || ""}
                        onInputChange={(value) => {
                          setCreateUserForm((prev) => ({ ...prev, clientSearchQuery: value }));
                        }}
                        allowsCustomValue={false}
                        defaultFilter={() => true}
                        classNames={{
                          base: "w-full",
                          listbox: "text-white",
                          listboxWrapper: "bg-gray-900",
                          popoverContent: "bg-gray-900 border border-gray-700 text-white",
                          emptyContent: "text-gray-300",
                        }}
                        inputProps={{
                          classNames: {
                            input: "text-white placeholder:text-gray-400",
                            inputWrapper: "bg-gray-900/70 border border-gray-700",
                          },
                        }}
                      >
                        {getFilteredAndSortedClients().map((client) => (
                          <AutocompleteItem key={client.id} className="text-white" textValue={`${client.info} - ${client.id}`}>
                            {client.info} - {client.id}
                          </AutocompleteItem>
                        ))}
                      </Autocomplete>
                    </div>
                  )}

                  {/* Info para Cliente Owner */}
                  {isOwnerClient && (
                    <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3">
                      <p className="text-blue-300 text-sm">
                        El usuario será creado para su organización:{" "}
                        <strong>{currentUser?.razonSocial}</strong>
                      </p>
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter className="flex items-center justify-center gap-3 px-8 py-6">
                <Button variant="flat" onPress={onClose} className="min-w-24">
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  className="min-w-24"
                  isLoading={isCreatingUser}
                  onPress={async () => {
                    await handleCreateUser();
                    // No cerrar automáticamente - la función handleCreateUser se encarga de cerrar si es exitoso
                  }}
                >
                  {isCreatingUser ? "Creando..." : "Crear"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
