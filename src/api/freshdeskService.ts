import { API_BASE_URL, getAuthHeadersMultipart } from './config';

// Tipos para Freshdesk
export interface NewTicket {
  subject: string;
  description: string;
  email: string;
  priority?: number;
  status?: number;
  type?: string;
  group_id?: number;
  responder_id?: number;
  company_id?: number;
  custom_fields?: any;
}

export interface TicketData {
  id: string;
  subject: string;
  description: string;
  // Agregar más campos según necesidad
  [key: string]: any;
}

class FreshdeskService {
  private freshdeskApiUrl = `${API_BASE_URL}/freshdesk`;

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': token || '',
      'Content-Type': 'application/json'
    };
  }

  async getTickets(clientEmail: string | null = null): Promise<TicketData[]> {
    const url = new URL(`${this.freshdeskApiUrl}/tickets`);
    
    if (clientEmail) {
      url.searchParams.set('clientEmail', clientEmail);
    }

    const response = await fetch(url.toString(), {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Error obteniendo tickets');
    }

    return response.json();
  }

  async getTicketDetail(ticketId: string, clientEmail?: string | null): Promise<TicketData> {
    const url = new URL(`${this.freshdeskApiUrl}/tickets/${ticketId}`);
    if (clientEmail) {
      url.searchParams.set('clientEmail', clientEmail);
    }
    const response = await fetch(url.toString(), {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Error obteniendo detalle del ticket');
    }

    return response.json();
  }

  // MODIFICADO: Ahora acepta 'files' opcionalmente
  async createTicket(ticketData: NewTicket, files: File[] = []): Promise<any> {
    const formData = new FormData();

    // Añadir los campos de texto del ticket a FormData
    formData.append('subject', ticketData.subject);
    formData.append('description', ticketData.description);
    formData.append('email', ticketData.email);

    if (ticketData.priority) formData.append('priority', ticketData.priority.toString());
    if (ticketData.status) formData.append('status', ticketData.status.toString());
    if (ticketData.type) formData.append('type', ticketData.type);
    if (ticketData.group_id) formData.append('group_id', ticketData.group_id.toString());
    if (ticketData.responder_id) formData.append('responder_id', ticketData.responder_id.toString());
    if (ticketData.company_id) formData.append('company_id', ticketData.company_id.toString());

    // Si hay campos personalizados, convertirlos a JSON string y añadirlos
    if (ticketData.custom_fields) {
      formData.append('custom_fields', JSON.stringify(ticketData.custom_fields));
    }

    // Añadir los archivos a FormData
    // Freshdesk espera los archivos con el nombre de campo 'uploads'
    files.forEach(file => {
      formData.append('uploads', file, file.name);
    });

    // IMPORTANTE: NO establecer Content-Type: 'multipart/form-data' aquí.
    // fetch lo establecerá automáticamente con el 'boundary' correcto cuando le pasas un FormData.
    const response = await fetch(`${this.freshdeskApiUrl}/tickets`, {
      method: 'POST',
      headers: getAuthHeadersMultipart(),
      body: formData
    });

    if (!response.ok) {
      throw new Error('Error creando ticket');
    }

    return response.json();
  }
}

// Exportamos una instancia del servicio
export const freshdeskService = new FreshdeskService();
