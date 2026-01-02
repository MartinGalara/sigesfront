import { useEffect, useMemo, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { freshdeskService } from "../api/freshdeskService";
import { authService, clientService, pcService } from "../api";
import { toast } from "react-toastify";

interface TicketBasic {
  id: number;
  subject: string;
  status: number;
  priority: number;
  created_at: string;
}
interface TicketDetail extends TicketBasic {
  ticket?: any;
  conversations?: any[];
  description?: string;
}
interface NewTicketForm {
  subject: string;
  description: string;
  email: string;
  priority: number;
  area: string;
  pcId: string | null;
  status: number;
  type: string;
  problemType: string;
  specificApplicationIssue: string;
  commonPrinterIssueType: string;
  fiscalPrinterIssueType: string;
  sigesProblemOrigin: string;
  sigesReportType: string;
  libroIvaIssueType: string;
  custom_fields: any;
}

const STATUS_MAP: Record<number, string> = {
  2: "Abierto",
  3: "Pendiente",
  5: "Resuelto",
  4: "Cerrado",
  11: "En proceso",
};
const PRIORITY_MAP: Record<number, string> = { 1: "Baja", 2: "Media", 3: "Alta", 4: "Urgente" };

export function FreshdeskClientPage() {
  // Query params
  const [tickets, setTickets] = useState<TicketBasic[]>([]);
  const [filtered, setFiltered] = useState<TicketBasic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"subject" | "status" | "date">("subject");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<TicketDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [clientEmail, setClientEmail] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NewTicketForm>(() => ({
    subject: "",
    description: "",
    email: "",
    priority: 1,
    area: "",
    pcId: null,
    status: 2,
    type: "Incidente",
    problemType: "",
    specificApplicationIssue: "",
    commonPrinterIssueType: "",
    fiscalPrinterIssueType: "",
    sigesProblemOrigin: "",
    sigesReportType: "",
    libroIvaIssueType: "",
    custom_fields: {},
  }));
  const [files, setFiles] = useState<File[]>([]);
  const [formMsg, setFormMsg] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [pcs, setPcs] = useState<any[]>([]);
  const [filteredPcs, setFilteredPcs] = useState<any[]>([]);
  const [loadingPcs, setLoadingPcs] = useState(false);
  const [pcsError, setPcsError] = useState<string | null>(null);
  const [teamViewerOther, setTeamViewerOther] = useState("");
  const [showTVField, setShowTVField] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState("00:00");
  // Refs for MediaRecorder lifecycle
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    (async () => {
      try {
        const user = authService.getStoredUser?.();
        if (!user) {
          setError("No autenticado");
          setLoading(false);
          return;
        }

        setClientEmail(user.clientEmail);
        setClientId(user.clientId);
      } catch (e) {
        setError("Error resolviendo usuario");
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (clientEmail) loadTickets();
  }, [clientEmail]);

  const loadTickets = async () => {
    setLoading(true);
    setError(null);
    const user = authService.getStoredUser?.();
    console.log("Usuario completo:", user);
    try {
      const data = await freshdeskService.getTickets(user.clientEmail);
      setTickets(data as any);
      setLoading(false);
    } catch (e: any) {
      setError(e.message || "Error cargando tickets");
      setTickets([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    let list = [...tickets];
    list = list.filter((t) => {
      if (filterType === "subject" && filterSubject)
        return t.subject.toLowerCase().includes(filterSubject.toLowerCase());
      if (filterType === "status" && filterStatus) return String(t.status) === filterStatus;
      if (filterType === "date" && filterDate) {
        const d = new Date(t.created_at);
        const f = new Date(filterDate);
        return (
          d.getUTCFullYear() === f.getUTCFullYear() &&
          d.getUTCMonth() === f.getUTCMonth() &&
          d.getUTCDate() === f.getUTCDate()
        );
      }
      return true;
    });
    setFiltered(list);
    setPage(1);
  }, [tickets, filterType, filterSubject, filterStatus, filterDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const pageItems = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page]
  );
  // Build final HTML for a conversation similar to Angular version (images styled + image attachments gallery)
  const buildConversationHtml = (conv: any) => {
    let html = conv.body_html || "";
    if (!html || !html.trim()) {
      const txt = (conv.body_text || "").replace(/^&ZeroWidthSpace;/, "");
      html = txt.replace(/ {2,}/g, "<br>").replace(/\n/g, "<br>");
    }
    // Parse to manipulate images
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      doc.querySelectorAll("img").forEach((img) => {
        (img as HTMLImageElement).style.maxWidth = "100%";
        (img as HTMLImageElement).style.height = "auto";
        (img as HTMLImageElement).style.maxHeight = "400px";
        (img as HTMLImageElement).style.objectFit = "contain";
        (img as HTMLImageElement).style.display = "block";
        (img as HTMLImageElement).style.margin = "10px auto";
        (img as HTMLImageElement).style.border = "1px solid #444";
        (img as HTMLImageElement).style.borderRadius = "4px";
        (img as HTMLImageElement).style.boxShadow = "0 2px 5px rgba(0,0,0,0.3)";
        (img as HTMLImageElement).style.backgroundColor = "#222";
        img.removeAttribute("width");
        img.removeAttribute("height");
      });
      html = doc.body.innerHTML;
    } catch {
      /* ignore parse errors */
    }
    // Build attachments gallery (only images)
    let attachmentsHtml = "";
    if (Array.isArray(conv.attachments)) {
      const imageAttachments = conv.attachments.filter(
        (att: any) => att.content_type && att.content_type.startsWith("image/")
      );
      if (imageAttachments.length) {
        attachmentsHtml +=
          `\n<div style="text-align:center;margin-top:15px;margin-bottom:10px;">` +
          `<hr style=\"border:0;height:1px;background-image:linear-gradient(to right,rgba(0,123,255,0),rgba(0,123,255,.75),rgba(0,123,255,0));margin:5px auto;\">` +
          `<h5 style=\"color:#007bff;margin:5px 0;font-size:1.1em;\">Imágenes Adjuntas:</h5></div>` +
          `<div style=\"display:flex;flex-wrap:wrap;gap:10px;justify-content:center;align-items:flex-start;padding:10px;background-color:#333;border-radius:8px;box-shadow:inset 0 0 5px rgba(0,0,0,.5);\">` +
          imageAttachments
            .map(
              (att: any) =>
                `<img src="${att.attachment_url}" alt="${att.name}" style="max-width:calc(33.33% - 10px);height:auto!important;max-height:200px!important;object-fit:contain!important;border:1px solid #555!important;border-radius:4px!important;box-shadow:0 2px 5px rgba(0,0,0,.3)!important;background-color:#222!important;" />`
            )
            .join("") +
          `</div>`;
      }
    }
    return DOMPurify.sanitize(html + attachmentsHtml, { USE_PROFILES: { html: true } });
  };
  const toggleDetail = async (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
      setDetail(null);
      setDetailError(null);
      return;
    }
    setExpandedId(id);
    setDetail(null);
    setDetailError(null);
    setDetailLoading(true);
    try {
      const d: any = await freshdeskService.getTicketDetail(String(id), clientEmail);
      if (d?.conversations) {
        d.conversations = d.conversations.map((c: any) => ({
          ...c,
          display_html_content: buildConversationHtml(c),
        }));
      }
      setDetail(d);
    } catch (e: any) {
      setDetailError(e.message || "Error cargando detalle");
    }
    setDetailLoading(false);
  };

  const openModal = async () => {
    setShowModal(true);
    initFormEmail();

    loadAllPcs();
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };
  const initFormEmail = () => {
    if (clientEmail) setForm((f) => ({ ...f, email: clientEmail }));
  };
  const resetForm = () => {
    setForm({
      subject: "",
      description: "",
      email: clientEmail || "",
      priority: 1,
      area: "",
      pcId: null,
      status: 2,
      type: "Incidente",
      problemType: "",
      specificApplicationIssue: "",
      commonPrinterIssueType: "",
      fiscalPrinterIssueType: "",
      sigesProblemOrigin: "",
      sigesReportType: "",
      libroIvaIssueType: "",
      custom_fields: {},
    });
    setFiles([]);
    setFormMsg(null);
    setFormSuccess(false);
    setTeamViewerOther("");
    setShowTVField(false);
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    deleteRecording();
  };

  const loadAllPcs = async () => {
    setLoadingPcs(true);
    setPcsError(null);
    try {
      const data = await pcService.getAllPcs(String(clientId));
      setPcs(data);
      setFilteredPcs([...data, { id: "other", alias: "Otro", identificador: "", area: "" }]);
    } catch (e: any) {
      setPcsError("Error cargando PCs");
      setFilteredPcs([{ id: "other", alias: "Otro", identificador: "", area: "" }]);
    }
    setLoadingPcs(false);
  };

  const onAreaChange = (selectedArea: string) => {
    console.log(selectedArea); // Ahora mostrará el valor correcto
    setForm((f) => ({ ...f, area: selectedArea, pcId: null }));
    setTeamViewerOther("");
    setShowTVField(false);

    if (!selectedArea) {
      setFilteredPcs([{ id: "other", alias: "Otro", identificador: "", area: "" }]);
      return;
    }

    // Definir las áreas que corresponden a cada selección
    let allowedAreas: string[] = [];

    switch (selectedArea) {
      case "P": // Playa/Boxes
        allowedAreas = ["P", "N", "L", "B", "R"];
        break;
      case "A": // Administración
        allowedAreas = ["A", "S", "V"];
        break;
      case "T": // Tienda
        allowedAreas = ["T"];
        break;
      default:
        allowedAreas = [];
    }

    // Filtrar las PCs según las áreas permitidas
    const list = pcs.filter((p: any) => allowedAreas.includes(p.area));
    setFilteredPcs([...list, { id: "other", alias: "Otro", identificador: "", area: "" }]);
  };

  const onPcChange = (pcId: string | null) => {
    setForm((f) => ({ ...f, pcId }));
    if (pcId === "other") {
      setShowTVField(true);
    } else {
      setShowTVField(false);
      setTeamViewerOther("");
    }
  };
  const buildSubject = (form: NewTicketForm) => {
    const parts: string[] = [];
    const areaMap: Record<string, string> = {
      P: "Playa/Boxes",
      T: "Tienda",
      A: "Administración",
    };
    if (form.area) parts.push(areaMap[form.area] || "");
    if (form.pcId && form.pcId !== "other") {
      const pc = pcs.find((p) => p.id === form.pcId);
      if (pc) parts.push(pc.alias);
    } else if (form.pcId === "other" && teamViewerOther.trim())
      parts.push("TeamViewer: " + teamViewerOther.trim());
    const problemMap: Record<string, string> = {
      1: "Apps de Pago y Fidelización",
      2: "Impresora Fiscal / Comandera",
      3: "Despachos CIO",
      4: "Sistema SIGES",
      5: "Impresora Común / Oficina",
      6: "Libro IVA",
      7: "Servidor",
      8: "Otro",
    };
    if (form.problemType) parts.push(problemMap[form.problemType] || "");
    if (form.problemType === "1" && form.specificApplicationIssue)
      parts.push(form.specificApplicationIssue);
    if (form.problemType === "5" && form.commonPrinterIssueType)
      parts.push(form.commonPrinterIssueType);
    if (form.problemType === "2" && form.fiscalPrinterIssueType)
      parts.push(form.fiscalPrinterIssueType);
    if (form.problemType === "4") {
      if (form.sigesProblemOrigin) parts.push(form.sigesProblemOrigin);
      if (form.sigesProblemOrigin === "Informes" && form.sigesReportType)
        parts.push(form.sigesReportType);
    }
    if (form.problemType === "6" && form.libroIvaIssueType) parts.push(form.libroIvaIssueType);
    const subject = parts.filter(Boolean).join(" - ");
    return subject || "Ticket de Soporte General";
  };
  const validateForm = (): string | null => {
    if (!form.area) return "Seleccione un área";
    if (!form.pcId) return 'Seleccione una PC o "Otro"';
    if (form.pcId === "other" && !teamViewerOther.trim())
      return 'Ingrese el TeamViewer ID para "Otro"';
    if (!form.problemType) return "Seleccione el tipo de problema";
    if (form.problemType === "1" && !form.specificApplicationIssue)
      return "Seleccione la aplicación específica";
    if (form.problemType === "5" && !form.commonPrinterIssueType)
      return "Seleccione tipo de impresora común";
    if (form.problemType === "2" && !form.fiscalPrinterIssueType)
      return "Seleccione tipo de impresora fiscal";
    if (form.problemType === "4" && !form.sigesProblemOrigin)
      return "Seleccione el origen del problema SIGES";
    if (form.problemType === "4" && form.sigesProblemOrigin === "Informes" && !form.sigesReportType)
      return "Indique el informe SIGES";
    if (form.problemType === "6" && !form.libroIvaIssueType) return "Seleccione problema Libro IVA";
    if (form.problemType === "7" && form.area !== "A")
      return "Servidor solo disponible para Administración";
    if (!form.description.trim()) return "Ingrese la descripción";
    if (!form.email) return "El email no está cargado";
    return null;
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sel = e.target.files;
    if (!sel) return;
    const list = Array.from(sel);
    const MAX_FILES = 5;
    const MAX_MB = 10;
    let current = [...files];
    for (const f of list) {
      if (current.length >= MAX_FILES) {
        toast.error(`Máximo ${MAX_FILES} archivos`);
        break;
      }
      if (f.size > MAX_MB * 1024 * 1024) {
        toast.error(`Archivo demasiado grande: ${f.name}`);
        continue;
      }
      if (!current.find((c) => c.name === f.name)) current.push(f);
    }
    setFiles(current);
    e.target.value = "";
  };
  const removeFile = (i: number) => setFiles((f) => f.filter((_, idx) => idx !== i));
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      mediaRecorderRef.current = rec;
      const chunks: BlobPart[] = [];
      rec.ondataavailable = (ev) => chunks.push(ev.data);
      rec.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        updateDuration();
      };
      startTimeRef.current = Date.now();
      setRecordingDuration("00:00");
      rec.start();
      setIsRecording(true);
      intervalRef.current = window.setInterval(() => {
        updateDuration();
      }, 1000);
    } catch (e) {
      toast.error("No se pudo acceder al micrófono");
    }
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };
  const updateDuration = () => {
    const durationMs = Date.now() - startTimeRef.current;
    const m = Math.floor(durationMs / 60000);
    const s = Math.floor((durationMs % 60000) / 1000);
    setRecordingDuration(`${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
  };
  const deleteRecording = () => {
    // Stop any ongoing recording first
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingDuration("00:00");
    setIsRecording(false);
  };
  const submitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg(null);
    setFormSuccess(false);
    const v = validateForm();
    if (v) {
      setFormMsg(v);
      return;
    }
    const ticketPayload: any = { ...form, subject: buildSubject(form) };
    if (form.pcId === "other" && teamViewerOther.trim()) {
      ticketPayload.description =
        form.description + `\n\nEl TeamViewer de la PC es: ${teamViewerOther.trim()}`;
    }
    ticketPayload.custom_fields = { ...(form.custom_fields || {}), cf_recibido_por: "Bot" };
    const uploadFiles = [...files];
    if (audioBlob) {
      const audioFile = new File([audioBlob], `audio_ticket_${Date.now()}.webm`, {
        type: audioBlob.type,
      });
      uploadFiles.push(audioFile);
    }
    try {
      await freshdeskService.createTicket(ticketPayload, uploadFiles);
      toast.success("Ticket creado");
      setFormMsg("Ticket creado exitosamente");
      setFormSuccess(true);
      closeModal();
      loadTickets();
    } catch (e: any) {
      setFormMsg(e.message || "Error al crear ticket");
      setFormSuccess(false);
      toast.error("Error creando ticket");
    }
  };
  return (
    <main className="flex-grow pt-24 pb-12 container mx-auto px-4 md:px-6 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Mis Tickets</h1>
        <div className="flex gap-3">
          <button
            onClick={openModal}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-5 py-2 rounded-md text-sm font-medium shadow"
          >
            Crear Ticket
          </button>
          <button
            onClick={loadTickets}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-5 py-2 rounded-md text-sm font-medium"
          >
            Recargar
          </button>
        </div>
      </div>
      <div className="bg-gray-800/60 border border-gray-700/60 rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative">
          <button
            onClick={() => setShowFilterMenu((s) => !s)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm"
          >
            Filtros{" "}
            <span className={`transition-transform ${showFilterMenu ? "rotate-180" : ""}`}>▼</span>
          </button>
          {showFilterMenu && (
            <div className="absolute mt-2 w-40 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-10">
              {(["subject", "status", "date"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setFilterType(opt);
                    setShowFilterMenu(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-sm ${
                    filterType === opt
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {opt === "subject" ? "Asunto" : opt === "status" ? "Estado" : "Fecha"}
                </button>
              ))}
            </div>
          )}
        </div>
        {filterType === "subject" && (
          <input
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            placeholder="Buscar asunto..."
            className="bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 w-full md:w-64"
          />
        )}
        {filterType === "status" && (
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 w-full md:w-52"
          >
            <option value="">Todos</option>
            <option value="2">Abierto</option>
            <option value="3">Pendiente</option>
            <option value="11">En proceso</option>
            <option value="5">Resuelto</option>
            <option value="4">Cerrado</option>
          </select>
        )}
        {filterType === "date" && (
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 w-full md:w-56"
          />
        )}
        {(filterSubject || filterStatus || filterDate) && (
          <button
            onClick={() => {
              setFilterSubject("");
              setFilterStatus("");
              setFilterDate("");
            }}
            className="bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded-md text-sm"
          >
            Limpiar
          </button>
        )}
      </div>
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-900 text-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Asunto</th>
              <th className="text-left px-4 py-3 font-medium">Urgencia</th>
              <th className="text-left px-4 py-3 font-medium">Estado</th>
              <th className="text-left px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {pageItems.map((t) => (
              <>
                <tr
                  key={t.id}
                  className="border-b border-gray-700/40 hover:bg-gray-700/30 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-200">{t.subject}</td>
                  <td className="px-4 py-3 text-gray-300">{PRIORITY_MAP[t.priority] || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="text-cyan-300">{STATUS_MAP[t.status] || "—"}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(t.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleDetail(t.id)}
                      className="text-cyan-400 hover:text-cyan-300 text-xs font-medium inline-flex items-center gap-1"
                    >
                      Detalle{" "}
                      <span
                        className={`transition-transform ${expandedId === t.id ? "rotate-90" : ""}`}
                      >
                        ▶
                      </span>
                    </button>
                  </td>
                </tr>
                {expandedId === t.id && (
                  <tr className="bg-gray-900/60">
                    <td colSpan={5} className="px-4 pb-6">
                      {detailLoading && (
                        <div className="text-sm text-blue-400 py-4">Cargando detalles...</div>
                      )}
                      {detailError && (
                        <div className="text-sm text-red-400 py-4">{detailError}</div>
                      )}
                      {detail && detail.ticket && (
                        <div className="pt-4">
                          <h3 className="text-lg font-semibold text-blue-400 mb-4">
                            {detail.ticket.subject}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-xs text-gray-300 mb-4">
                            <span className="bg-gray-700/60 px-2 py-1 rounded">
                              {STATUS_MAP[detail.ticket.status]}
                            </span>
                            <span className="bg-gray-700/60 px-2 py-1 rounded">
                              {PRIORITY_MAP[detail.ticket.priority]}
                            </span>
                            {detail.ticket.type && (
                              <span className="bg-gray-700/60 px-2 py-1 rounded">
                                {detail.ticket.type}
                              </span>
                            )}
                          </div>
                          <div className="mb-6">
                            <h4 className="text-sm font-medium text-cyan-400 mb-2">Descripción</h4>
                            <div
                              className="prose prose-invert max-w-none text-gray-200 text-sm"
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(detail.ticket.description || ""),
                              }}
                            />
                          </div>
                          <h4 className="text-sm font-medium text-cyan-400 mb-3">Conversaciones</h4>
                          {(!detail.conversations || detail.conversations.length === 0) && (
                            <div className="text-xs text-gray-400">No hay conversaciones.</div>
                          )}
                          <div className="space-y-4">
                            {detail.conversations &&
                              detail.conversations.map((c: any, i: number) => (
                                <div
                                  key={i}
                                  className={`rounded-lg p-4 text-xs leading-relaxed border ${
                                    c.source === 1
                                      ? "bg-gray-800/70 border-gray-600"
                                      : "bg-blue-900/30 border-blue-700/40"
                                  }`}
                                >
                                  <div className="flex justify-between mb-2 text-[10px] text-gray-400">
                                    <strong className="text-gray-200 mr-2">
                                      {c.from_email || "Usuario"}
                                    </strong>
                                    <span>{new Date(c.created_at).toLocaleString()}</span>
                                  </div>
                                  <div
                                    className="conversation-html"
                                    dangerouslySetInnerHTML={{ __html: c.display_html_content }}
                                  />
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">
                  {error || "No se encontraron tickets"}
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-blue-400 text-sm">
                  Cargando tickets...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6 text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 rounded bg-gray-800 disabled:opacity-40 text-gray-200 hover:bg-gray-700"
          >
            Anterior
          </button>
          <span className="text-gray-400">
            Página {page} de {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 rounded bg-gray-800 disabled:opacity-40 text-gray-200 hover:bg-gray-700"
          >
            Siguiente
          </button>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-gray-900 w-full max-w-2xl rounded-xl border border-gray-700 shadow-xl relative">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Nuevo Ticket</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-200 text-sm">
                ✕
              </button>
            </div>
            <form onSubmit={submitTicket} className="px-6 py-6 space-y-5">
              {formMsg && (
                <div
                  className={`text-sm px-3 py-2 rounded ${
                    formSuccess
                      ? "bg-green-600/30 text-green-300 border border-green-500/50"
                      : "bg-red-600/20 text-red-300 border border-red-500/40"
                  }`}
                >
                  {formMsg}
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">
                    Área
                  </label>
                  <select
                    value={form.area}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      setForm((f) => ({ ...f, area: selectedValue }));
                      onAreaChange(selectedValue); // Pasar el valor directamente
                    }}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200"
                  >
                    <option value="">Seleccione área</option>
                    <option value="P">Playa/Boxes</option>
                    <option value="T">Tienda</option>
                    <option value="A">Administración</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">
                    PC
                  </label>
                  {loadingPcs && <div className="text-xs text-blue-400 py-2">Cargando PCs...</div>}
                  {!loadingPcs && (
                    <select
                      value={form.pcId || ""}
                      onChange={(e) => onPcChange(e.target.value || null)}
                      disabled={!form.area} // Agregar esta línea
                      className={`w-full border border-gray-700 rounded-md px-3 py-2 text-sm ${
                        !form.area
                          ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                          : "bg-gray-800 text-gray-200"
                      }`} // Modificar las clases para mostrar visualmente que está deshabilitado
                    >
                      <option value="">
                        {!form.area ? "Primero seleccione un área" : "Seleccione PC"}
                      </option>
                      {filteredPcs.map((pc) => (
                        <option key={pc.id} value={pc.id}>
                          {pc.alias}
                          {pc.id !== "other" && ` (${pc.identificador})`}
                        </option>
                      ))}
                    </select>
                  )}
                  {pcsError && <div className="text-[11px] text-red-400 mt-1">{pcsError}</div>}
                  {filteredPcs.length === 1 && filteredPcs[0].id === "other" && !loadingPcs && (
                    <div className="text-[11px] text-gray-400 mt-1">
                      No hay PCs registradas para el área.
                    </div>
                  )}
                </div>
              </div>
              {showTVField && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">
                    TeamViewer ID (PC Otro)
                  </label>
                  <input
                    value={teamViewerOther}
                    onChange={(e) => setTeamViewerOther(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200"
                    placeholder="123 456 789"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">
                  Tipo de Problema
                </label>
                <select
                  value={form.problemType}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      problemType: e.target.value,
                      specificApplicationIssue: "",
                      commonPrinterIssueType: "",
                      fiscalPrinterIssueType: "",
                      sigesProblemOrigin: "",
                      sigesReportType: "",
                      libroIvaIssueType: "",
                    }))
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200"
                >
                  <option value="">Seleccione tipo</option>
                  <option value="1">Apps de Pago y Fidelización</option>
                  <option value="2">Impresora Fiscal / Comandera</option>
                  <option value="3">Despachos CIO</option>
                  <option value="4">Sistema SIGES</option>
                  <option value="5">Impresora Común / Oficina</option>
                  {form.area === "A" && (
                    <>
                      <option value="6">Libro IVA</option>
                      <option value="7">Servidor</option>
                    </>
                  )}
                  <option value="8">Otro</option>
                </select>
              </div>
              {form.problemType === "1" && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">
                    Aplicación Específica
                  </label>
                  <select
                    value={form.specificApplicationIssue}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, specificApplicationIssue: e.target.value }))
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200"
                  >
                    <option value="">Seleccione aplicación</option>
                    <option value="App Propia (YVOS-PRIS-ON-BOX-ETC)">
                      App Propia (YVOS-PRIS-ON-BOX-ETC)
                    </option>
                    <option value="Mercado Pago - Modo - ETC">Mercado Pago - Modo - ETC</option>
                    <option value="Todas las aplicaciones">Todas las aplicaciones</option>
                  </select>
                </div>
              )}
              {form.problemType === "5" && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">
                    Tipo Impresora
                  </label>
                  <select
                    value={form.commonPrinterIssueType}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, commonPrinterIssueType: e.target.value }))
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200"
                  >
                    <option value="">Seleccione tipo</option>
                    <option value="Soporte para impresora">Soporte para impresora</option>
                    <option value="Instalar una impresora">Instalar una impresora</option>
                  </select>
                </div>
              )}
              {form.problemType === "2" && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">
                    Tipo Fiscal
                  </label>
                  <select
                    value={form.fiscalPrinterIssueType}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, fiscalPrinterIssueType: e.target.value }))
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200"
                  >
                    <option value="">Seleccione tipo</option>
                    <option value="Soporte para impresora fiscal">
                      Soporte para impresora fiscal
                    </option>
                    <option value="Instalar una impresora fiscal">
                      Instalar una impresora fiscal
                    </option>
                  </select>
                </div>
              )}
              {form.problemType === "4" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">
                      Origen SIGES
                    </label>
                    <select
                      value={form.sigesProblemOrigin}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          sigesProblemOrigin: e.target.value,
                          sigesReportType: e.target.value === "Informes" ? f.sigesReportType : "",
                        }))
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200"
                    >
                      <option value="">Seleccione origen</option>
                      <option value="Facturación">Facturación</option>
                      <option value="Cierre de turno">Cierre de turno</option>
                      <option value="Informes">Informes</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  {form.sigesProblemOrigin === "Informes" && (
                    <div>
                      <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">
                        Tipo de Informe
                      </label>
                      <input
                        value={form.sigesReportType}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, sigesReportType: e.target.value }))
                        }
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200"
                        placeholder="Reporte de Ventas, etc."
                      />
                    </div>
                  )}
                </div>
              )}
              {form.problemType === "6" && form.area === "A" && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">
                    Libro IVA
                  </label>
                  <select
                    value={form.libroIvaIssueType}
                    onChange={(e) => setForm((f) => ({ ...f, libroIvaIssueType: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200"
                  >
                    <option value="">Seleccione</option>
                    <option value="Libro IVA Compra">Libro IVA Compra</option>
                    <option value="Libro IVA Venta">Libro IVA Venta</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">
                  Descripción
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200"
                />
              </div>
              <div className="text-[11px] text-gray-400 -mt-2">
                El ticket se generará con el email:{" "}
                <span className="text-cyan-400">{form.email || "—"}</span>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
                  Adjuntar Archivos (máx 5 / 10MB)
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                  accept="image/*,video/*"
                />
                {files.length > 0 && (
                  <ul className="mt-2 space-y-1 text-xs text-gray-400">
                    {files.map((f, i) => (
                      <li key={i} className="flex items-center justify-between">
                        {f.name} ({(f.size / 1024 / 1024).toFixed(2)} MB)
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="text-red-400 hover:text-red-300 ml-2"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                {!isRecording && (
                  <button
                    type="button"
                    onClick={startRecording}
                    disabled={!!audioBlob}
                    className="px-3 py-2 rounded bg-blue-700 disabled:opacity-40 text-white"
                  >
                    Grabar Audio
                  </button>
                )}
                {isRecording && (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="px-3 py-2 rounded bg-yellow-600 text-white"
                  >
                    Detener ({recordingDuration})
                  </button>
                )}
                <button
                  type="button"
                  onClick={deleteRecording}
                  disabled={!audioBlob && !isRecording}
                  className="px-3 py-2 rounded bg-red-700 disabled:opacity-40 text-white"
                >
                  Eliminar
                </button>
                {audioBlob && (
                  <span className="text-green-400">Audio listo ({recordingDuration})</span>
                )}
                {audioUrl && !isRecording && (
                  <audio controls src={audioUrl} className="w-full mt-2" />
                )}
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-6 py-3 rounded-md text-sm font-semibold shadow disabled:opacity-60"
                >
                  Crear Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
export default FreshdeskClientPage;
