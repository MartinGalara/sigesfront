import { useState } from "react";
import {
  Button,
  Input,
  Tabs,
  Tab,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
} from "@heroui/react";
import { Upload, Database, Search, FileText, Users, UserPlus, X } from "lucide-react";
import Papa from "papaparse";
import { toast } from "react-toastify";

interface Device {
  alias: string;
  teamviewer_id: string;
  clientId: string;
  bandera: string;
  identificador: string;
  razonSocial: string;
  ciudad: string;
  area: string;
  prefijo: string;
  extras: string;
  tvalias: string;
}

interface BotUser {
  name: string;
  phone: string;
  createUser: boolean;
  canSOS: boolean;
  adminPdf: boolean;
  manager: boolean;
  area: string | null;
  email: string;
  clientId: string;
  createdBy: string;
}

interface Client {
  id: string;
  email: string[];
  info: string;
}

interface WebUser {
  name: string;
  email: string;
  password: string;
  role: string;
  status: number;
  razonSocial: string;
  clientId: string;
  owner: boolean;
}

interface ProcessedData {
  devices: Device[];
  botusers: BotUser[];
  webusers: WebUser[];
  client: Client;
}

interface NewClientForm {
  nombreAdministrador: string;
  razonSocial: string;
  correo: string;
  bandera: string;
  identificador: string;
}

export function ChatbotSection() {
  const [csvFile, setCsvFile] = useState<ProcessedData | null>(null);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [activeSection, setActiveSection] = useState("planilla");
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdatingDB, setIsUpdatingDB] = useState(false);

  // Estados para el modal de nuevo cliente
  const [newClientModalOpen, setNewClientModalOpen] = useState(false);
  const [newClientForm, setNewClientForm] = useState<NewClientForm>({
    nombreAdministrador: "",
    razonSocial: "",
    correo: "",
    bandera: "",
    identificador: "",
  });
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    nombreAdministrador?: boolean;
    razonSocial?: boolean;
    correo?: boolean;
    bandera?: boolean;
    identificador?: boolean;
  }>({});

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: function (results) {
          const data = results.data as string[][];
          const completeData = validate(data);
          setCsvFile(completeData);
          setIsSubmitButtonDisabled(false);
        },
        header: false,
        skipEmptyLines: true,
      });
    }
  };

  const validate = (data: string[][]): ProcessedData => {
    const razonSocial = data[0][2];
    const bandera = data[1][2];
    const identificador = data[2][2];
    const ciudad = data[3][2];
    const clientId = generarClientId(bandera, identificador);

    const devices: Device[] = [];
    const botusers: BotUser[] = [];

    // Procesar dispositivos
    for (let i = 7; i < data.length; i++) {
      if (data[i][1] !== "" && data[i][2] !== "" && data[i][3] !== "") {
        const device: Device = {
          alias: data[i][1],
          teamviewer_id: data[i][2],
          clientId,
          bandera,
          identificador,
          razonSocial,
          ciudad,
          area: data[i][3],
          prefijo: "**",
          extras: "**",
          tvalias: "",
        };
        const tvalias = generarTvAlias(device);
        device.tvalias = tvalias;
        devices.push(device);
      }
    }

    // Procesar usuarios del bot
    for (let i = 9; i < data.length; i++) {
      if (data[i][4] !== "" && data[i][6] !== "") {
        const botuser: BotUser = {
          name: data[i][4],
          phone: "549" + data[i][6],
          createUser: getBoolean(data[i][7]),
          canSOS: getBoolean(data[i][8]),
          adminPdf: getBoolean(data[i][9]),
          manager: getBoolean(data[i][10]),
          area: data[i][11] !== "" ? data[i][11] : null,
          email: data[i][12],
          clientId: clientId,
          createdBy: "Planilla",
        };
        botusers.push(botuser);
      }
    }

    const client: Client = {
      id: clientId,
      email: [data[4][2]],
      info: razonSocial,
    };

    // Procesar usuarios web
    const webusers: WebUser[] = [];

    // Agregar el usuario principal del cliente (owner)
    webusers.push({
      name: razonSocial,
      email: data[4][2],
      password: data[4][2],
      role: "Cliente",
      status: 0,
      razonSocial: razonSocial,
      clientId: clientId,
      owner: true,
    });

    // Agregar bot users que tengan email válido
    botusers.forEach((botuser) => {
      if (botuser.email && botuser.email.trim() !== "") {
        webusers.push({
          name: botuser.name,
          email: botuser.email,
          password: botuser.email,
          role: "Cliente",
          status: 0,
          razonSocial: razonSocial,
          clientId: clientId,
          owner: false,
        });
      }
    });

    return {
      devices,
      botusers,
      webusers,
      client,
    };
  };

  const getBoolean = (string: string): boolean => {
    return string === "TRUE";
  };

  const generarTvAlias = (device: Device): string => {
    const banderaShort =
      device.bandera.length > 3 ? device.bandera.substring(0, 3) : device.bandera;
    return `${device.razonSocial}|${banderaShort}|${device.identificador}|${device.area}|${device.prefijo}|${device.extras}`;
  };

  const generarClientId = (bandera: string, identificador: string): string => {
    let abrev = "";

    switch (bandera.toUpperCase()) {
      case "YPF":
        abrev = "YP";
        break;
      case "SHELL":
        abrev = "SH";
        break;
      case "AXION":
        abrev = "AX";
        break;
      case "PUMA":
        abrev = "PU";
        break;
      case "GULF":
        abrev = "GU";
        break;
      case "REFINOR":
        abrev = "RE";
        break;
      case "BLANCA":
        abrev = "BL";
        break;
      case "OTRO":
        abrev = "OT";
        break;
      default:
        abrev = "XX";
    }

    return abrev + identificador;
  };

  const handleEnviarPlanilla = async () => {
    if (csvFile) {
      setIsUploading(true);

      try {
        await fetch("/api/devices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(csvFile),
        });

        if (document.getElementById("file-upload") as HTMLInputElement) {
          (document.getElementById("file-upload") as HTMLInputElement).value = "";
        }
        setCsvFile(null);
        setIsSubmitButtonDisabled(true);
        setSuccessMessage("Datos cargados exitosamente");

        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error("Error enviando la planilla:", error);
        setSuccessMessage("Error al cargar los datos. Inténtalo de nuevo.");
        setTimeout(() => setSuccessMessage(""), 3000);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleActualizarDB = async () => {
    setIsUpdatingDB(true);

    try {
      // await fetch('https://tvserver-production.up.railway.app/devices');
      // Simulación por ahora
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUpdateMessage("Base de datos actualizada");
      setTimeout(() => setUpdateMessage(""), 3000);
    } catch (error) {
      console.error("Error actualizando la base de datos:", error);
      setUpdateMessage("Error al actualizar la base de datos.");
      setTimeout(() => setUpdateMessage(""), 3000);
    } finally {
      setIsUpdatingDB(false);
    }
  };

  const openNewClientModal = () => {
    setNewClientForm({
      nombreAdministrador: "",
      razonSocial: "",
      correo: "",
      bandera: "",
      identificador: "",
    });
    setFormErrors({});
    setNewClientModalOpen(true);
  };

  const handleCreateNewClient = async () => {
    // Resetear errores
    const errors: typeof formErrors = {};

    // Validar que todos los campos estén completos
    if (!newClientForm.nombreAdministrador.trim()) {
      errors.nombreAdministrador = true;
      toast.error("El nombre del administrador es obligatorio");
      setFormErrors(errors);
      return;
    }

    if (!newClientForm.razonSocial.trim()) {
      errors.razonSocial = true;
      toast.error("La razón social es obligatoria");
      setFormErrors(errors);
      return;
    }

    if (!newClientForm.correo.trim()) {
      errors.correo = true;
      toast.error("El correo es obligatorio");
      setFormErrors(errors);
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newClientForm.correo)) {
      errors.correo = true;
      toast.error("Por favor ingrese un correo electrónico válido");
      setFormErrors(errors);
      return;
    }

    if (!newClientForm.bandera) {
      errors.bandera = true;
      toast.error("Debe seleccionar una bandera");
      setFormErrors(errors);
      return;
    }

    if (!newClientForm.identificador.trim()) {
      errors.identificador = true;
      toast.error("El identificador es obligatorio");
      setFormErrors(errors);
      return;
    }

    // Limpiar errores si todo está bien
    setFormErrors({});
    setIsCreatingClient(true);

    try {
      // Generar el clientId usando la función existente
      const clientId = generarClientId(newClientForm.bandera, newClientForm.identificador);

      // Crear el objeto para enviar al backend
      const webUserData = {
        firstName: newClientForm.nombreAdministrador,
        email: newClientForm.correo,
        password: newClientForm.correo,
        role: "Cliente",
        status: 1,
        razonSocial: newClientForm.razonSocial,
        clientId: clientId,
        owner: true,
      };

      // Obtener el token de autenticación
      const token = localStorage.getItem("token");
      
      // Enviar al endpoint /users/web
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}/users/web`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(webUserData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrar el cliente");
      }

      // Cerrar el modal y mostrar mensaje de éxito
      setNewClientModalOpen(false);
      toast.success("Cliente registrado exitosamente");
      
      // Limpiar el formulario
      setNewClientForm({
        nombreAdministrador: "",
        razonSocial: "",
        correo: "",
        bandera: "",
        identificador: "",
      });
    } catch (error) {
      console.error("Error al crear el cliente:", error);
      const errorMessage = error instanceof Error ? error.message : "Error al registrar el cliente";
      toast.error(errorMessage);
    } finally {
      setIsCreatingClient(false);
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-center text-white mb-4">Sección Chatbot</h2>
      </div>

      {/* Botón Registrar Nuevo Cliente */}
      <div className="mb-6 flex justify-end">
        <Button
          color="primary"
          startContent={<UserPlus size={20} />}
          onClick={openNewClientModal}
          className="font-semibold rounded-xl bg-gradient-to-r from-purple-600/80 to-purple-400/60 text-white shadow-md hover:from-purple-500 hover:to-purple-300 transition-all duration-200 focus:ring-2 focus:ring-purple-400/60"
        >
          Registrar Nuevo Cliente
        </Button>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 text-white">
        <Tabs
          selectedKey={activeSection}
          onSelectionChange={(key) => setActiveSection(key as string)}
          className="mb-6"
        >
          <Tab key="planilla" title="Cargar Planilla">
            <div className="space-y-6">
              <Card className="bg-gray-900/30 border-gray-700/50">
                <CardHeader>
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <FileText className="mr-2" size={24} />
                    Gestión de Planillas
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  {successMessage && (
                    <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
                      <p className="text-green-400">{successMessage}</p>
                    </div>
                  )}

                  {updateMessage && (
                    <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3">
                      <p className="text-blue-400">{updateMessage}</p>
                    </div>
                  )}

                  <div className="flex gap-4 items-center flex-wrap">
                    <div>
                      <input
                        type="file"
                        id="file-upload"
                        accept=".csv"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <label htmlFor="file-upload">
                        <Button
                          as="span"
                          color="primary"
                          variant="flat"
                          startContent={<Upload size={20} />}
                          className="cursor-pointer"
                        >
                          Cargar Planilla CSV
                        </Button>
                      </label>
                    </div>

                    <Button
                      color="success"
                      variant="flat"
                      startContent={isUploading ? <Spinner size="sm" /> : <FileText size={20} />}
                      onClick={handleEnviarPlanilla}
                      isDisabled={isSubmitButtonDisabled || isUploading}
                    >
                      {isUploading ? "Enviando..." : "Enviar Planilla"}
                    </Button>

                    <Button
                      color="secondary"
                      variant="flat"
                      startContent={isUpdatingDB ? <Spinner size="sm" /> : <Database size={20} />}
                      onClick={handleActualizarDB}
                      isDisabled={isUpdatingDB}
                    >
                      {isUpdatingDB ? "Actualizando..." : "Actualizar DB"}
                    </Button>
                  </div>
                </CardBody>
              </Card>

              {/* Mostrar datos procesados del CSV */}
              {csvFile && (
                <div className="space-y-6">
                  {/* Información del Cliente */}
                  <Card className="bg-gray-900/30 border-gray-700/50">
                    <CardHeader>
                      <h3 className="text-xl font-semibold text-white">Datos del Cliente</h3>
                    </CardHeader>
                    <CardBody>
                      <Table aria-label="Datos del cliente" className="bg-gray-800/30">
                        <TableHeader>
                          <TableColumn>CAMPO</TableColumn>
                          <TableColumn>VALOR</TableColumn>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="text-white font-medium">Email:</TableCell>
                            <TableCell className="text-white">
                              {csvFile.client.email.join(", ")}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-white font-medium">ID:</TableCell>
                            <TableCell className="text-white">{csvFile.client.id}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-white font-medium">Info:</TableCell>
                            <TableCell className="text-white">{csvFile.client.info}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardBody>
                  </Card>

                  {/* Dispositivos */}
                  <Card className="bg-gray-900/30 border-gray-700/50">
                    <CardHeader>
                      <h3 className="text-xl font-semibold text-white">
                        Dispositivos ({csvFile.devices.length})
                      </h3>
                    </CardHeader>
                    <CardBody>
                      <Table aria-label="Dispositivos" className="bg-gray-800/30">
                        <TableHeader>
                          <TableColumn>Alias</TableColumn>
                          <TableColumn>TeamViewer ID</TableColumn>
                          <TableColumn>Client ID</TableColumn>
                          <TableColumn>Razón Social</TableColumn>
                          <TableColumn>Bandera</TableColumn>
                          <TableColumn>Identificador</TableColumn>
                          <TableColumn>Ciudad</TableColumn>
                          <TableColumn>Area</TableColumn>
                          <TableColumn>Prefijo</TableColumn>
                          <TableColumn>Extras</TableColumn>
                          <TableColumn>TvAlias</TableColumn>
                        </TableHeader>
                        <TableBody>
                          {csvFile.devices.map((device, index) => (
                            <TableRow key={index}>
                              <TableCell className="text-white">{device.alias}</TableCell>
                              <TableCell className="text-white">{device.teamviewer_id}</TableCell>
                              <TableCell className="text-white">{device.clientId}</TableCell>
                              <TableCell className="text-white">{device.razonSocial}</TableCell>
                              <TableCell className="text-white">{device.bandera}</TableCell>
                              <TableCell className="text-white">{device.identificador}</TableCell>
                              <TableCell className="text-white">{device.ciudad}</TableCell>
                              <TableCell className="text-white">{device.area}</TableCell>
                              <TableCell className="text-white">{device.prefijo}</TableCell>
                              <TableCell className="text-white">{device.extras}</TableCell>
                              <TableCell className="text-white">{device.tvalias}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardBody>
                  </Card>

                  {/* Bot Users */}
                  <Card className="bg-gray-900/30 border-gray-700/50">
                    <CardHeader>
                      <h3 className="text-xl font-semibold text-white">
                        Bot Users ({csvFile.botusers.length})
                      </h3>
                    </CardHeader>
                    <CardBody>
                      <Table aria-label="Bot Users" className="bg-gray-800/30">
                        <TableHeader>
                          <TableColumn>Name</TableColumn>
                          <TableColumn>Phone</TableColumn>
                          <TableColumn>Create User</TableColumn>
                          <TableColumn>Can SOS</TableColumn>
                          <TableColumn>Admin PDF</TableColumn>
                          <TableColumn>Manager</TableColumn>
                          <TableColumn>Area</TableColumn>
                          <TableColumn>Email</TableColumn>
                        </TableHeader>
                        <TableBody>
                          {csvFile.botusers.map((botuser, index) => (
                            <TableRow key={index}>
                              <TableCell className="text-white">{botuser.name}</TableCell>
                              <TableCell className="text-white">{botuser.phone}</TableCell>
                              <TableCell className="text-white">
                                {botuser.createUser ? "Yes" : "No"}
                              </TableCell>
                              <TableCell className="text-white">
                                {botuser.canSOS ? "Yes" : "No"}
                              </TableCell>
                              <TableCell className="text-white">
                                {botuser.adminPdf ? "Yes" : "No"}
                              </TableCell>
                              <TableCell className="text-white">
                                {botuser.manager ? "Yes" : "No"}
                              </TableCell>
                              <TableCell className="text-white">{botuser.area || "N/A"}</TableCell>
                              <TableCell className="text-white">{botuser.email}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardBody>
                  </Card>
                  {/* Web Users */}
                  <Card className="bg-gray-900/30 border-gray-700/50">
                    <CardHeader>
                      <h3 className="text-xl font-semibold text-white flex items-center">
                        <Users className="mr-2" size={24} />
                        Web Users ({csvFile.webusers.length})
                      </h3>
                    </CardHeader>
                    <CardBody>
                      <Table aria-label="Web Users" className="bg-gray-800/30">
                        <TableHeader>
                          <TableColumn>Name</TableColumn>
                          <TableColumn>Email</TableColumn>
                          <TableColumn>Password</TableColumn>
                          <TableColumn>Role</TableColumn>
                          <TableColumn>Status</TableColumn>
                          <TableColumn>Razón Social</TableColumn>
                          <TableColumn>Client ID</TableColumn>
                          <TableColumn>Owner</TableColumn>
                        </TableHeader>
                        <TableBody>
                          {csvFile.webusers.map((webuser, index) => (
                            <TableRow key={index}>
                              <TableCell className="text-white">{webuser.name}</TableCell>
                              <TableCell className="text-white">{webuser.email}</TableCell>
                              <TableCell className="text-white">{webuser.password}</TableCell>
                              <TableCell className="text-white">{webuser.role}</TableCell>
                              <TableCell className="text-white">{webuser.status}</TableCell>
                              <TableCell className="text-white">{webuser.razonSocial}</TableCell>
                              <TableCell className="text-white">{webuser.clientId}</TableCell>
                              <TableCell className="text-white">
                                <Chip
                                  color={webuser.owner ? "success" : "default"}
                                  variant="flat"
                                  size="sm"
                                >
                                  {webuser.owner ? "Owner" : "User"}
                                </Chip>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardBody>
                  </Card>
                </div>
              )}
            </div>
          </Tab>
        </Tabs>
      </div>

      {/* Modal Registrar Nuevo Cliente */}
      <Modal
        isOpen={newClientModalOpen}
        onOpenChange={setNewClientModalOpen}
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
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/20 text-purple-400">
                  <UserPlus size={22} />
                </span>
                <span className="text-lg font-semibold">Registrar Nuevo Cliente</span>
              </ModalHeader>
              <ModalBody className="px-8 pb-6 -mt-2">
                <div className="space-y-4">
                  <div>
                    <Input
                      placeholder="Nombre Administrador"
                      value={newClientForm.nombreAdministrador}
                      onChange={(e) => {
                        setNewClientForm((prev) => ({
                          ...prev,
                          nombreAdministrador: e.target.value,
                        }));
                        // Limpiar error al escribir
                        if (formErrors.nombreAdministrador) {
                          setFormErrors((prev) => ({ ...prev, nombreAdministrador: false }));
                        }
                      }}
                      classNames={{
                        input: "text-white",
                        inputWrapper: `bg-gray-900/70 border ${
                          formErrors.nombreAdministrador ? "border-red-500" : "border-gray-700"
                        }`,
                      }}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Razón Social"
                      value={newClientForm.razonSocial}
                      onChange={(e) => {
                        setNewClientForm((prev) => ({ ...prev, razonSocial: e.target.value }));
                        // Limpiar error al escribir
                        if (formErrors.razonSocial) {
                          setFormErrors((prev) => ({ ...prev, razonSocial: false }));
                        }
                      }}
                      classNames={{
                        input: "text-white",
                        inputWrapper: `bg-gray-900/70 border ${
                          formErrors.razonSocial ? "border-red-500" : "border-gray-700"
                        }`,
                      }}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Correo"
                      type="email"
                      value={newClientForm.correo}
                      onChange={(e) => {
                        setNewClientForm((prev) => ({ ...prev, correo: e.target.value }));
                        // Limpiar error al escribir
                        if (formErrors.correo) {
                          setFormErrors((prev) => ({ ...prev, correo: false }));
                        }
                      }}
                      classNames={{
                        input: "text-white",
                        inputWrapper: `bg-gray-900/70 border ${
                          formErrors.correo ? "border-red-500" : "border-gray-700"
                        }`,
                      }}
                    />
                  </div>
                  <div>
                    <Select
                      placeholder="Seleccionar Bandera"
                      selectedKeys={newClientForm.bandera ? new Set([newClientForm.bandera]) : new Set()}
                      onSelectionChange={(keys) => {
                        const val = Array.from(keys as Set<string>)[0];
                        setNewClientForm((prev) => ({ ...prev, bandera: val || "" }));
                        // Limpiar error al seleccionar
                        if (formErrors.bandera) {
                          setFormErrors((prev) => ({ ...prev, bandera: false }));
                        }
                      }}
                      classNames={{
                        trigger: `bg-gray-900/70 border ${
                          formErrors.bandera ? "border-red-500" : "border-gray-700"
                        } text-white`,
                        value: "text-white",
                        listbox: "text-white",
                        listboxWrapper: "bg-gray-900",
                        popoverContent: "bg-gray-900 border border-gray-700",
                      }}
                    >
                      <SelectItem key="YPF" value="YP" className="text-white">
                        YPF
                      </SelectItem>
                      <SelectItem key="SHELL" value="SH" className="text-white">
                        Shell
                      </SelectItem>
                      <SelectItem key="AXION" value="AX" className="text-white">
                        Axion
                      </SelectItem>
                      <SelectItem key="PUMA" value="PU" className="text-white">
                        Puma
                      </SelectItem>
                      <SelectItem key="GULF" value="GU" className="text-white">
                        Gulf
                      </SelectItem>
                      <SelectItem key="REFINOR" value="RE" className="text-white">
                        Refinor
                      </SelectItem>
                      <SelectItem key="BLANCA" value="BL" className="text-white">
                        Blanca
                      </SelectItem>
                      <SelectItem key="OTRO" value="OT" className="text-white">
                        Otro
                      </SelectItem>
                    </Select>
                  </div>
                  <div>
                    <Input
                      placeholder="Identificador"
                      value={newClientForm.identificador}
                      onChange={(e) => {
                        setNewClientForm((prev) => ({ ...prev, identificador: e.target.value }));
                        // Limpiar error al escribir
                        if (formErrors.identificador) {
                          setFormErrors((prev) => ({ ...prev, identificador: false }));
                        }
                      }}
                      classNames={{
                        input: "text-white",
                        inputWrapper: `bg-gray-900/70 border ${
                          formErrors.identificador ? "border-red-500" : "border-gray-700"
                        }`,
                      }}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="flex items-center justify-center gap-3 px-8 py-6">
                <Button variant="flat" onPress={onClose} className="min-w-24">
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  className="min-w-24 bg-gradient-to-r from-purple-600/80 to-purple-400/60"
                  isLoading={isCreatingClient}
                  onPress={async () => {
                    await handleCreateNewClient();
                  }}
                >
                  {isCreatingClient ? "Enviando..." : "Enviar"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
