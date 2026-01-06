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
import { Search, UserCheck, UserX, Edit, AlertTriangle, CheckCircle2, X, Plus, Trash2 } from "lucide-react";
import { Select, SelectItem } from "@heroui/react";
import { 
  userService, 
  botuserService, 
  clientService, 
  authService,
  type User,
  type Botuser,
} from "../api";
import { toast } from "react-toastify";

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
  password: string;
  clientId: string;
  role: string;
  razonSocial: string;
}

interface CreateBotuserForm {
  name: string;
  phone: string;
  email: string;
  clientIds: string[];
  area: 'P' | 'A' | 'B' | 'T' | 'G';
}

const AREA_LABELS: Record<string, string> = {
  P: 'Playa',
  A: 'Administración',
  B: 'Bodega',
  T: 'Tienda',
  G: 'General',
};

export function GestionUsuarios() {
  const [users, setUsers] = useState<User[]>([]);
  const [botusers, setBotusers] = useState<Botuser[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [selectedTab, setSelectedTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Confirm modal states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<{
    id: number;
    action: "activate" | "deactivate" | "delete";
    type: "user" | "botuser";
    name?: string;
  } | null>(null);
  
  // Edit modal states
  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingBotuser, setEditingBotuser] = useState<Botuser | null>(null);
  
  // Create modal states
  const [createOpen, setCreateOpen] = useState(false);
  const [createUserForm, setCreateUserForm] = useState<CreateUserForm>({
    firstName: "",
    email: "",
    password: "",
    clientId: "",
    role: "Cliente",
    razonSocial: "",
  });
  const [createBotuserForm, setCreateBotuserForm] = useState<CreateBotuserForm>({
    name: "",
    phone: "",
    email: "",
    clientIds: [],
    area: "G",
  });
  const [isCreating, setIsCreating] = useState(false);

  // Get current user info
  const currentUser =
    authService.getStoredUser?.() || JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = currentUser?.role === "Admin";
  const isOwnerClient = currentUser?.role === "Cliente" && currentUser?.owner === true;

  useEffect(() => {
    loadData();
    loadClients();
  }, [selectedTab]);

  // Load data based on selected tab
  const loadData = async () => {
    try {
      setIsLoading(true);
      
      if (selectedTab === "users") {
        const clientId = isOwnerClient ? currentUser.clientId : undefined;
        const data = await userService.getUsers(clientId);
        setUsers(data);
      } else {
        const filters = isOwnerClient ? { clientId: currentUser.clientId } : undefined;
        const data = await botuserService.getBotusers(filters);
        setBotusers(data);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      toast.error("Error al cargar los usuarios");
    } finally {
      setIsLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      const data = await clientService.getClients();
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

  // Open create modal
  const openCreate = () => {
    if (selectedTab === "users") {
      setCreateUserForm({
        firstName: "",
        email: "",
        password: "",
        clientId: isOwnerClient ? currentUser.clientId : "",
        role: "Cliente",
        razonSocial: "",
      });
    } else {
      setCreateBotuserForm({
        name: "",
        phone: "",
        email: "",
        clientIds: isOwnerClient ? [currentUser.clientId] : [],
        area: "G",
      });
    }
    setCreateOpen(true);
  };

  // Handle create
  const handleCreate = async () => {
    try {
      setIsCreating(true);

      if (selectedTab === "users") {
        if (!createUserForm.firstName.trim() || !createUserForm.email.trim() || !createUserForm.password.trim()) {
          toast.error("Nombre, email y contraseña son requeridos");
          return;
        }

        const clientId = isOwnerClient ? currentUser.clientId : createUserForm.clientId;
        if (!clientId) {
          toast.error("Debe seleccionar un cliente");
          return;
        }

        // Get client info for razonSocial
        const selectedClient = clients.find(c => c.id === clientId);
        if (!selectedClient) {
          toast.error("Cliente no encontrado");
          return;
        }

        await userService.createUser({
          firstName: createUserForm.firstName,
          email: createUserForm.email,
          password: createUserForm.password,
          clientId: clientId,
          role: createUserForm.role,
          status: 0,
          razonSocial: selectedClient.info,
          owner: false,
        });
        toast.success("Usuario creado exitosamente");
      } else {
        if (!createBotuserForm.name.trim() || !createBotuserForm.phone.trim()) {
          toast.error("Nombre y teléfono son requeridos");
          return;
        }

        const clientIds = isOwnerClient 
          ? [currentUser.clientId] 
          : createBotuserForm.clientIds;

        if (!clientIds || clientIds.length === 0) {
          toast.error("Debe seleccionar al menos un cliente");
          return;
        }

        await botuserService.createBotuser({
          name: createBotuserForm.name,
          phone: createBotuserForm.phone,
          email: createBotuserForm.email,
          clientIds: clientIds,
          area: createBotuserForm.area,
        });
        toast.success("Bot user creado exitosamente");
      }

      setCreateOpen(false);
      loadData();
    } catch (error: any) {
      console.error("Error al crear usuario:", error);
      toast.error(error.message || "Error al crear el usuario");
    } finally {
      setIsCreating(false);
    }
  };

  // Open edit modal
  const openEdit = (user: User | Botuser, type: "user" | "botuser") => {
    if (type === "user") {
      setEditingUser(user as User);
      setEditingBotuser(null);
    } else {
      const botuser = user as Botuser;
      // Normalize clients property - handle both 'Clients' and 'clients'
      const normalizedBotuser = {
        ...botuser,
        Clients: botuser.Clients || (botuser as any).clients || []
      };
      console.log('Opening edit for botuser:', normalizedBotuser);
      console.log('Botuser clients:', normalizedBotuser.Clients);
      setEditingBotuser(normalizedBotuser);
      setEditingUser(null);
    }
    setEditOpen(true);
  };

  // Handle edit save
  const handleEditSave = async () => {
    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, {
          firstName: editingUser.firstName,
          email: editingUser.email,
          role: editingUser.role,
          status: editingUser.status,
        });
        toast.success("Usuario actualizado con éxito");
      } else if (editingBotuser) {
        const clientIds = editingBotuser.Clients?.map(c => c.id) || [];
        await botuserService.updateBotuser(editingBotuser.id, {
          name: editingBotuser.name,
          phone: editingBotuser.phone,
          email: editingBotuser.email,
          area: editingBotuser.area,
          clientIds: clientIds,
        });
        toast.success("Botuser actualizado con éxito");
      }
      setEditOpen(false);
      setEditingUser(null);
      setEditingBotuser(null);
      loadData();
    } catch (error: any) {
      console.error("Error al actualizar:", error);
      toast.error(error.message || "Error al actualizar el usuario");
    }
  };

  // Request confirmation
  const requestConfirm = (
    id: number,
    action: "activate" | "deactivate" | "delete",
    type: "user" | "botuser",
    name?: string
  ) => {
    setConfirmTarget({ id, action, type, name });
    setConfirmOpen(true);
  };

  // Handle confirmation
  const handleConfirm = async () => {
    if (!confirmTarget) return;
    const { id, action, type } = confirmTarget;
    setConfirmOpen(false);

    try {
      if (type === "user") {
        if (action === "activate") {
          await userService.updateUser(id, { status: 1 });
          toast.success("Usuario activado con éxito");
        } else if (action === "deactivate") {
          await userService.updateUser(id, { status: 0 });
          toast.success("Usuario desactivado con éxito");
        } else if (action === "delete") {
          await userService.deleteUser(id);
          toast.success("Usuario eliminado con éxito");
        }
      } else {
        if (action === "delete") {
          await botuserService.deleteBotuser(id);
          toast.success("Botuser eliminado con éxito");
        }
      }
      loadData();
    } catch (error: any) {
      console.error("Error en operación:", error);
      toast.error(error.message || "Error al realizar la operación");
    }

    setConfirmTarget(null);
  };

  // Filter function
  const getFilteredData = () => {
    const query = searchQuery.toLowerCase();

    if (selectedTab === "users") {
      return users.filter(
        (user) =>
          user.firstName?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.razonSocial?.toLowerCase().includes(query) ||
          user.clientInfo?.info?.toLowerCase().includes(query) ||
          user.clientInfo?.email?.toLowerCase().includes(query)
      );
    } else {
      return botusers.filter(
        (user) =>
          user.name?.toLowerCase().includes(query) ||
          user.phone?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.Clients?.some((client) => client.info?.toLowerCase().includes(query))
      );
    }
  };

  // Render user row
  const renderUserRow = (user: User) => {
    const clientInfo = user.clientInfo?.info || user.razonSocial || "N/A";
    const isActive = user.status === 1;
    
    return (
      <TableRow key={user.id}>
        <TableCell className="text-white text-center align-middle">
          {user.firstName}
        </TableCell>
        <TableCell className="text-white text-center align-middle">
          {user.email}
        </TableCell>
        <TableCell className="text-white text-center align-middle">
          {clientInfo}
        </TableCell>
        <TableCell className="text-white text-center align-middle">
          <Chip color={isActive ? "success" : "warning"} variant="flat" size="sm">
            {isActive ? "Activo" : "Inactivo"}
          </Chip>
        </TableCell>
        <TableCell className="text-white text-center align-middle">
          <div className="flex items-center justify-center gap-2">
            <Button
              size="sm"
              color="primary"
              variant="flat"
              startContent={<Edit size={16} />}
              onClick={() => openEdit(user, "user")}
              className="font-semibold rounded-lg bg-gradient-to-r from-sky-600/80 to-sky-400/60 text-white shadow-md hover:from-sky-500 hover:to-sky-300 transition-all duration-200"
            >
              <span className="hidden md:inline">Editar</span>
            </Button>
            {isActive ? (
              <Button
                size="sm"
                color="warning"
                variant="flat"
                startContent={<UserX size={16} />}
                onClick={() => requestConfirm(user.id, "deactivate", "user", user.firstName)}
                className="font-semibold rounded-lg bg-gradient-to-r from-amber-600/80 to-amber-400/60 text-white shadow-md hover:from-amber-500 hover:to-amber-300 transition-all duration-200"
              >
                <span className="hidden md:inline">Desactivar</span>
              </Button>
            ) : (
              <Button
                size="sm"
                color="success"
                variant="flat"
                startContent={<UserCheck size={16} />}
                onClick={() => requestConfirm(user.id, "activate", "user", user.firstName)}
                className="font-semibold rounded-lg bg-gradient-to-r from-emerald-600/80 to-emerald-400/60 text-white shadow-md hover:from-emerald-500 hover:to-emerald-300 transition-all duration-200"
              >
                <span className="hidden md:inline">Activar</span>
              </Button>
            )}
            {isAdmin && (
              <Button
                size="sm"
                color="danger"
                variant="flat"
                startContent={<Trash2 size={16} />}
                onClick={() => requestConfirm(user.id, "delete", "user", user.firstName)}
                className="font-semibold rounded-lg bg-gradient-to-r from-red-600/80 to-red-400/60 text-white shadow-md hover:from-red-500 hover:to-red-300 transition-all duration-200"
              >
                <span className="hidden md:inline">Eliminar</span>
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
    );
  };

  // Render botuser row
  const renderBotuserRow = (user: Botuser) => {
    // Handle both 'Clients' and 'clients' (Sequelize might return lowercase)
    const clients = (user.Clients || (user as any).clients) as Array<{id: string, info: string}> | undefined;
    const clientNames = clients?.map((c) => c.info).join(", ") || "Sin asignar";
    
    return (
      <TableRow key={user.id}>
        <TableCell className="text-white text-center align-middle">
          {user.name}
        </TableCell>
        <TableCell className="text-white text-center align-middle">
          {user.phone}
        </TableCell>
        <TableCell className="text-white text-center align-middle">
          {user.email || "N/A"}
        </TableCell>
        <TableCell className="text-white text-center align-middle">
          <div className="text-sm">
            {clientNames}
          </div>
        </TableCell>
        <TableCell className="text-white text-center align-middle">
          <div className="flex items-center justify-center gap-2">
            <Button
              size="sm"
              color="primary"
              variant="flat"
              startContent={<Edit size={16} />}
              onClick={() => openEdit(user, "botuser")}
              className="font-semibold rounded-lg bg-gradient-to-r from-sky-600/80 to-sky-400/60 text-white shadow-md hover:from-sky-500 hover:to-sky-300 transition-all duration-200"
            >
              <span className="hidden md:inline">Editar</span>
            </Button>
            {isAdmin && (
              <Button
                size="sm"
                color="danger"
                variant="flat"
                startContent={<Trash2 size={16} />}
                onClick={() => requestConfirm(user.id, "delete", "botuser", user.name)}
                className="font-semibold rounded-lg bg-gradient-to-r from-red-600/80 to-red-400/60 text-white shadow-md hover:from-red-500 hover:to-red-300 transition-all duration-200"
              >
                <span className="hidden md:inline">Eliminar</span>
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
    );
  };

  // Render mobile card for user
  const renderUserCard = (user: User) => {
    const isActive = user.status === 1;
    
    return (
      <div key={user.id} className="rounded-xl bg-gray-900/40 border border-gray-700/50 p-4 shadow">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h3 className="text-base font-semibold text-white">{user.firstName}</h3>
          <Chip color={isActive ? "success" : "warning"} variant="flat" size="sm">
            {isActive ? "Activo" : "Inactivo"}
          </Chip>
        </div>
        <div className="text-sm text-gray-300 space-y-1 mb-4">
          <div>
            <span className="text-gray-400">Email: </span>
            <span>{user.email}</span>
          </div>
          <div>
            <span className="text-gray-400">Cliente: </span>
            <span>{user.clientInfo?.info || user.razonSocial || "N/A"}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            color="primary"
            variant="flat"
            startContent={<Edit size={16} />}
            onClick={() => openEdit(user, "user")}
            className="w-full font-semibold rounded-lg bg-gradient-to-r from-sky-600/80 to-sky-400/60 text-white"
          >
            Editar
          </Button>
          {isActive ? (
            <Button
              size="sm"
              color="warning"
              variant="flat"
              startContent={<UserX size={16} />}
              onClick={() => requestConfirm(user.id, "deactivate", "user", user.firstName)}
              className="w-full font-semibold rounded-lg bg-gradient-to-r from-amber-600/80 to-amber-400/60 text-white"
            >
              Desactivar
            </Button>
          ) : (
            <Button
              size="sm"
              color="success"
              variant="flat"
              startContent={<UserCheck size={16} />}
              onClick={() => requestConfirm(user.id, "activate", "user", user.firstName)}
              className="w-full font-semibold rounded-lg bg-gradient-to-r from-emerald-600/80 to-emerald-400/60 text-white"
            >
              Activar
            </Button>
          )}
        </div>
        {isAdmin && (
          <Button
            size="sm"
            color="danger"
            variant="flat"
            startContent={<Trash2 size={16} />}
            onClick={() => requestConfirm(user.id, "delete", "user", user.firstName)}
            className="w-full mt-2 font-semibold rounded-lg bg-gradient-to-r from-red-600/80 to-red-400/60 text-white"
          >
            Eliminar
          </Button>
        )}
      </div>
    );
  };

  // Render mobile card for botuser
  const renderBotuserCard = (user: Botuser) => {
    const clients = (user.Clients || (user as any).clients) as Array<{id: string, info: string}> | undefined;
    const clientNames = clients?.map((c) => c.info).join(", ") || "Sin asignar";
    
    return (
      <div key={user.id} className="rounded-xl bg-gray-900/40 border border-gray-700/50 p-4 shadow">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h3 className="text-base font-semibold text-white">{user.name}</h3>
        </div>
        <div className="text-sm text-gray-300 space-y-1 mb-4">
          <div>
            <span className="text-gray-400">Teléfono: </span>
            <span>{user.phone}</span>
          </div>
          <div>
            <span className="text-gray-400">Email: </span>
            <span>{user.email || "N/A"}</span>
          </div>
          <div>
            <span className="text-gray-400">Clientes: </span>
            <span>{clientNames}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            color="primary"
            variant="flat"
            startContent={<Edit size={16} />}
            onClick={() => openEdit(user, "botuser")}
            className="w-full font-semibold rounded-lg bg-gradient-to-r from-sky-600/80 to-sky-400/60 text-white"
          >
            Editar
          </Button>
          {isAdmin && (
            <Button
              size="sm"
              color="danger"
              variant="flat"
              startContent={<Trash2 size={16} />}
              onClick={() => requestConfirm(user.id, "delete", "botuser", user.name)}
              className="w-full font-semibold rounded-lg bg-gradient-to-r from-red-600/80 to-red-400/60 text-white"
            >
              Eliminar
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

  const filteredData = getFilteredData();

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
                selectedTab === "users"
                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                  : "bg-gray-900/60 border-gray-700 text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-300 hover:border-emerald-400/40"
              }`}
              onClick={() => setSelectedTab("users")}
            >
              Portal Users
            </button>
            <button
              className={`px-5 py-2 rounded-xl font-semibold shadow transition-all duration-200 border-2 text-base focus:outline-none ${
                selectedTab === "botusers"
                  ? "bg-sky-500/20 border-sky-400 text-sky-300"
                  : "bg-gray-900/60 border-gray-700 text-gray-300 hover:bg-sky-500/10 hover:text-sky-300 hover:border-sky-400/40"
              }`}
              onClick={() => setSelectedTab("botusers")}
            >
              Bot Users
            </button>
          </div>

          {(isAdmin || isOwnerClient) && (
            <Button
              color="primary"
              startContent={<Plus size={20} />}
              onClick={openCreate}
              className="font-semibold rounded-xl bg-gradient-to-r from-blue-600/80 to-blue-400/60 text-white shadow-md hover:from-blue-500 hover:to-blue-300 transition-all duration-200 focus:ring-2 focus:ring-blue-400/60 px-6 py-2"
            >
              Crear {selectedTab === "users" ? "Usuario Portal" : "Usuario Bot"}
            </Button>
          )}
        </div>

        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          className="hidden"
        >
          <Tab key="users" title="Portal Users">
            <div className="space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:max-w-sm">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none">
                    <Search size={20} />
                  </span>
                  <input
                    type="text"
                    placeholder="Buscar usuarios portal..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-900/80 border border-gray-700/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400 transition-all duration-200"
                  />
                </div>
                <Chip
                  color="success"
                  variant="flat"
                  className="font-semibold text-base px-4 py-2 bg-emerald-500/10 border border-emerald-400/30 text-emerald-300"
                >
                  {filteredData.length} usuarios
                </Chip>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {filteredData.map((user) => renderUserCard(user as User))}
              </div>

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <Table aria-label="Portal Users Table" className="min-w-full">
                  <TableHeader>
                    <TableColumn className="bg-gray-900/60 text-emerald-400 text-center font-bold text-base">
                      Nombre
                    </TableColumn>
                    <TableColumn className="bg-gray-900/60 text-emerald-400 text-center font-bold text-base">
                      Email
                    </TableColumn>
                    <TableColumn className="bg-gray-900/60 text-emerald-400 text-center font-bold text-base">
                      Cliente
                    </TableColumn>
                    <TableColumn className="bg-gray-900/60 text-emerald-400 text-center font-bold text-base">
                      Estado
                    </TableColumn>
                    <TableColumn className="bg-gray-900/60 text-emerald-400 text-center font-bold text-base">
                      Acciones
                    </TableColumn>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((user) => renderUserRow(user as User))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Tab>

          <Tab key="botusers" title="Bot Users">
            <div className="space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:max-w-sm">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400 pointer-events-none">
                    <Search size={20} />
                  </span>
                  <input
                    type="text"
                    placeholder="Buscar bot users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-900/80 border border-gray-700/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-400 transition-all duration-200"
                  />
                </div>
                <Chip
                  color="primary"
                  variant="flat"
                  className="font-semibold text-base px-4 py-2 bg-sky-500/10 border border-sky-400/30 text-sky-300"
                >
                  {filteredData.length} bot users
                </Chip>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {filteredData.map((user) => renderBotuserCard(user as Botuser))}
              </div>

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <Table aria-label="Bot Users Table" className="min-w-full">
                  <TableHeader>
                    <TableColumn className="bg-gray-900/60 text-sky-400 text-center font-bold text-base">
                      Nombre
                    </TableColumn>
                    <TableColumn className="bg-gray-900/60 text-sky-400 text-center font-bold text-base">
                      Teléfono
                    </TableColumn>
                    <TableColumn className="bg-gray-900/60 text-sky-400 text-center font-bold text-base">
                      Email
                    </TableColumn>
                    <TableColumn className="bg-gray-900/60 text-sky-400 text-center font-bold text-base">
                      Clientes
                    </TableColumn>
                    <TableColumn className="bg-gray-900/60 text-sky-400 text-center font-bold text-base">
                      Acciones
                    </TableColumn>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((user) => renderBotuserRow(user as Botuser))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>

      {/* Confirm Modal */}
      <Modal
        isOpen={confirmOpen}
        onOpenChange={setConfirmOpen}
        placement="center"
        backdrop="blur"
        hideCloseButton
      >
        <ModalContent className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700/60 text-white max-w-md mx-auto rounded-3xl shadow-2xl">
          {(onClose) => (
            <>
              <Button
                isIconOnly
                variant="light"
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
                onPress={onClose}
              >
                <X className="w-5 h-5" />
              </Button>

              <ModalHeader className="flex items-center justify-center gap-3 px-8 py-6">
                <div
                  className={`p-3 rounded-full ${
                    confirmTarget?.action === "delete"
                      ? "bg-red-500/10"
                      : confirmTarget?.action === "activate"
                      ? "bg-emerald-500/10"
                      : "bg-amber-500/10"
                  }`}
                >
                  {confirmTarget?.action === "delete" ? (
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                  ) : confirmTarget?.action === "activate" ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-amber-400" />
                  )}
                </div>
                <h2 className="text-2xl font-bold">
                  {confirmTarget?.action === "delete"
                    ? "Eliminar Usuario"
                    : confirmTarget?.action === "activate"
                    ? "Activar Usuario"
                    : "Desactivar Usuario"}
                </h2>
              </ModalHeader>
              <ModalBody className="px-8 pb-6 text-center">
                <p className="text-gray-300 text-lg">
                  {confirmTarget?.action === "delete"
                    ? `¿Está seguro que desea eliminar a "${confirmTarget?.name}"? Esta acción no se puede deshacer.`
                    : confirmTarget?.action === "activate"
                    ? `¿Está seguro que desea activar a "${confirmTarget?.name}"?`
                    : `¿Está seguro que desea desactivar a "${confirmTarget?.name}"?`}
                </p>
              </ModalBody>
              <ModalFooter className="flex items-center justify-center gap-3 px-8 py-6">
                <Button color="default" variant="flat" onPress={onClose} className="px-6 py-2">
                  Cancelar
                </Button>
                <Button
                  color={confirmTarget?.action === "delete" ? "danger" : "primary"}
                  onPress={handleConfirm}
                  className={`px-6 py-2 font-semibold ${
                    confirmTarget?.action === "delete"
                      ? "bg-gradient-to-r from-red-600 to-red-400"
                      : confirmTarget?.action === "activate"
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-400"
                      : "bg-gradient-to-r from-amber-600 to-amber-400"
                  }`}
                >
                  {confirmTarget?.action === "delete"
                    ? "Eliminar"
                    : confirmTarget?.action === "activate"
                    ? "Activar"
                    : "Desactivar"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editOpen}
        onOpenChange={setEditOpen}
        placement="center"
        backdrop="blur"
        size="2xl"
        classNames={{
          base: "bg-gray-900 border border-gray-700",
          backdrop: "bg-black/50",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-white text-xl font-bold border-b border-gray-700 pb-4">
                Editar {selectedTab === "users" ? "Usuario Portal" : "Usuario Bot"}
              </ModalHeader>
              <ModalBody className="py-6">
                {editingUser && (
                  <div className="space-y-5">
                    <div>
                      <label className="text-white text-sm font-semibold mb-2 block">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={editingUser.firstName}
                        onChange={(e) =>
                          setEditingUser({ ...editingUser, firstName: e.target.value })
                        }
                        placeholder="Ingrese el nombre"
                        className="w-full px-4 py-2.5 rounded-lg bg-gray-800/60 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm font-semibold mb-2 block">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editingUser.email}
                        onChange={(e) =>
                          setEditingUser({ ...editingUser, email: e.target.value })
                        }
                        placeholder="Ingrese el email"
                        className="w-full px-4 py-2.5 rounded-lg bg-gray-800/60 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm font-semibold mb-2 block">
                        Razón Social
                      </label>
                      <input
                        type="text"
                        value={editingUser.razonSocial || ""}
                        onChange={(e) =>
                          setEditingUser({ ...editingUser, razonSocial: e.target.value })
                        }
                        placeholder="Ingrese la razón social"
                        className="w-full px-4 py-2.5 rounded-lg bg-gray-800/60 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm font-semibold mb-2 block">
                        Estado
                      </label>
                      <select
                        value={editingUser.status?.toString() || "1"}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            status: e.target.value === "1" ? 1 : 0,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-lg bg-gray-800/60 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="1">Activo</option>
                        <option value="0">Inactivo</option>
                      </select>
                    </div>
                  </div>
                )}
                {editingBotuser && (
                  <div className="space-y-5">
                    <div>
                      <label className="text-white text-sm font-semibold mb-2 block">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={editingBotuser.name}
                        onChange={(e) =>
                          setEditingBotuser({ ...editingBotuser, name: e.target.value })
                        }
                        placeholder="Ingrese el nombre"
                        className="w-full px-4 py-2.5 rounded-lg bg-gray-800/60 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm font-semibold mb-2 block">
                        Teléfono
                      </label>
                      <input
                        type="text"
                        value={editingBotuser.phone}
                        onChange={(e) =>
                          setEditingBotuser({ ...editingBotuser, phone: e.target.value })
                        }
                        placeholder="Ingrese el teléfono"
                        className="w-full px-4 py-2.5 rounded-lg bg-gray-800/60 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm font-semibold mb-2 block">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editingBotuser.email || ""}
                        onChange={(e) =>
                          setEditingBotuser({ ...editingBotuser, email: e.target.value })
                        }
                        placeholder="Ingrese el email"
                        className="w-full px-4 py-2.5 rounded-lg bg-gray-800/60 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm font-semibold mb-2 block">
                        Área
                      </label>
                      <select
                        value={editingBotuser.area}
                        onChange={(e) =>
                          setEditingBotuser({
                            ...editingBotuser,
                            area: e.target.value as 'P' | 'A' | 'B' | 'T' | 'G',
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-lg bg-gray-800/60 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        {Object.entries(AREA_LABELS).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {!isOwnerClient && (
                      <div>
                        <label className="text-white text-sm font-semibold mb-2 block">
                          Clientes
                        </label>
                        <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-gray-800/60 rounded-lg border border-gray-600">
                          {clients.map((client) => {
                            const isChecked = editingBotuser.Clients?.some((c) => {
                              console.log('Comparing:', { clientId: c.id, clientIdType: typeof c.id, listClientId: client.id, listClientIdType: typeof client.id, match: c.id.toString() === client.id });
                              return c.id.toString() === client.id;
                            }) || false;
                            return (
                              <label key={client.id} className="flex items-center gap-2 text-white hover:bg-gray-700/50 p-2 rounded cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                onChange={(e) => {
                                  const currentClients = editingBotuser.Clients || [];
                                  if (e.target.checked) {
                                    setEditingBotuser({
                                      ...editingBotuser,
                                      Clients: [...currentClients, {
                                        id: client.id,
                                        info: client.info,
                                        email: client.email,
                                        vip: client.vip ? "true" : "false",
                                        vipmail: client.vipmail,
                                        testing: client.testing
                                      }],
                                    });
                                  } else {
                                    setEditingBotuser({
                                      ...editingBotuser,
                                      Clients: currentClients.filter((c) => c.id.toString() !== client.id),
                                    });
                                  }
                                }}
                                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm">{client.info}</span>
                            </label>
                            );
                          })}
                        </div>
                        {(!editingBotuser.Clients || editingBotuser.Clients.length === 0) && (
                          <p className="text-sm text-yellow-400 mt-1">Debe seleccionar al menos un cliente</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </ModalBody>
              <ModalFooter className="border-t border-gray-700 pt-4">
                <Button 
                  color="danger" 
                  variant="light" 
                  onPress={onClose}
                  className="font-semibold"
                >
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  onPress={handleEditSave}
                  className="bg-gradient-to-r from-blue-600 to-blue-400 font-semibold"
                >
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Create Modal */}
      <Modal
        isOpen={createOpen}
        onOpenChange={setCreateOpen}
        placement="center"
        backdrop="blur"
        hideCloseButton
      >
        <ModalContent className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700/60 text-white max-w-md mx-auto rounded-3xl shadow-2xl">
          {(onClose) => (
            <>
              <Button
                isIconOnly
                variant="light"
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
                onPress={onClose}
              >
                <X className="w-5 h-5" />
              </Button>
              <ModalHeader className="flex items-center justify-center gap-3 px-8 py-6">
                <Plus className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold">
                  Crear {selectedTab === "users" ? "Usuario Portal" : "Usuario Bot"}
                </h2>
              </ModalHeader>
              <ModalBody className="px-8 pb-6">
                {selectedTab === "users" ? (
                  <div className="space-y-4">
                    <Input
                      label="Nombre"
                      type="text"
                      value={createUserForm.firstName}
                      onChange={(e) =>
                        setCreateUserForm({ ...createUserForm, firstName: e.target.value })
                      }
                      variant="bordered"
                      isRequired
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={createUserForm.email}
                      onChange={(e) =>
                        setCreateUserForm({ ...createUserForm, email: e.target.value })
                      }
                      variant="bordered"
                      isRequired
                    />
                    <Input
                      label="Contraseña"
                      type="password"
                      value={createUserForm.password}
                      onChange={(e) =>
                        setCreateUserForm({ ...createUserForm, password: e.target.value })
                      }
                      variant="bordered"
                      isRequired
                    />
                    <Input
                      label="Razón Social"
                      type="text"
                      value={createUserForm.razonSocial}
                      onChange={(e) =>
                        setCreateUserForm({ ...createUserForm, razonSocial: e.target.value })
                      }
                      variant="bordered"
                    />
                    {isAdmin && (
                      <Select
                        label="Cliente"
                        selectedKeys={[createUserForm.clientId]}
                        onChange={(e) =>
                          setCreateUserForm({ ...createUserForm, clientId: e.target.value })
                        }
                        variant="bordered"
                        isRequired
                      >
                        {clients.map((client) => (
                          <SelectItem key={client.id}>
                            {client.info}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Input
                      label="Nombre"
                      value={createBotuserForm.name}
                      onChange={(e) =>
                        setCreateBotuserForm({ ...createBotuserForm, name: e.target.value })
                      }
                      variant="bordered"
                      isRequired
                    />
                    <Input
                      label="Teléfono"
                      value={createBotuserForm.phone}
                      onChange={(e) =>
                        setCreateBotuserForm({ ...createBotuserForm, phone: e.target.value })
                      }
                      variant="bordered"
                      isRequired
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={createBotuserForm.email}
                      onChange={(e) =>
                        setCreateBotuserForm({ ...createBotuserForm, email: e.target.value })
                      }
                      variant="bordered"
                    />
                    <Select
                      label="Área"
                      selectedKeys={[createBotuserForm.area]}
                      onChange={(e) =>
                        setCreateBotuserForm({
                          ...createBotuserForm,
                          area: e.target.value as 'P' | 'A' | 'B' | 'T' | 'G',
                        })
                      }
                      variant="bordered"
                      isRequired
                    >
                      {Object.entries(AREA_LABELS).map(([key, label]) => (
                        <SelectItem key={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </Select>
                    {!isOwnerClient && (
                      <div>
                        <label className="text-white text-sm font-semibold mb-2 block">
                          Clientes *
                        </label>
                        <div className="space-y-2 max-h-48 overflow-y-auto p-3 bg-gray-800/60 rounded-lg border-2 border-gray-600">
                          {clients.map((client) => (
                            <label key={client.id} className="flex items-center gap-2 text-white hover:bg-gray-700/50 p-2 rounded cursor-pointer">
                              <input
                                type="checkbox"
                                checked={createBotuserForm.clientIds.includes(client.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setCreateBotuserForm({
                                      ...createBotuserForm,
                                      clientIds: [...createBotuserForm.clientIds, client.id],
                                    });
                                  } else {
                                    setCreateBotuserForm({
                                      ...createBotuserForm,
                                      clientIds: createBotuserForm.clientIds.filter((id) => id !== client.id),
                                    });
                                  }
                                }}
                                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm">{client.info}</span>
                            </label>
                          ))}
                        </div>
                        {createBotuserForm.clientIds.length === 0 && (
                          <p className="text-sm text-yellow-400 mt-1">Debe seleccionar al menos un cliente</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </ModalBody>
              <ModalFooter className="flex items-center justify-center gap-3 px-8 py-6">
                <Button color="default" variant="flat" onPress={onClose} disabled={isCreating}>
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  onPress={handleCreate}
                  isLoading={isCreating}
                  className="bg-gradient-to-r from-blue-600 to-blue-400"
                >
                  Crear
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
