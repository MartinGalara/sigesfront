import { API_BASE_URL } from './config';

export interface DeviceData {
  [key: string]: any;
}

export interface ClientData {
  id: string;
  [key: string]: any;
}

class ChatbotService {
  // Nota: Usando cors-anywhere para bypass CORS
  private apiUrl = `https://cors-anywhere.herokuapp.com/${API_BASE_URL}`;

  private getCorsHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': token || '',
      'x-requested-with': 'XMLHttpRequest', // Requerido por cors-anywhere
      'Content-Type': 'application/json'
    };
  }

  async sendPlanilla(data: DeviceData): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/devices`, {
        method: 'POST',
        headers: this.getCorsHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Error al enviar la planilla');
      }

      return response.json();
    } catch (error) {
      console.error('Error al enviar la planilla:', error);
      throw error;
    }
  }

  async updateDatabase(): Promise<any> {
    const response = await fetch(`${this.apiUrl}/devices`, {
      headers: this.getCorsHeaders()
    });

    if (!response.ok) {
      throw new Error('Error actualizando base de datos');
    }

    return response.json();
  }

  async getAllClients(): Promise<ClientData[]> {
    const response = await fetch(`${this.apiUrl}/clients`, {
      headers: this.getCorsHeaders()
    });

    if (!response.ok) {
      throw new Error('Error obteniendo clientes');
    }

    return response.json();
  }

  async getClientById(id: string): Promise<ClientData> {
    const response = await fetch(`${this.apiUrl}/clients?id=${id}`, {
      headers: this.getCorsHeaders()
    });

    if (!response.ok) {
      throw new Error('Error obteniendo cliente por ID');
    }

    return response.json();
  }

  async updateClient(clientData: ClientData): Promise<ClientData> {
    const response = await fetch(`${this.apiUrl}/clients`, {
      method: 'PUT',
      headers: this.getCorsHeaders(),
      body: JSON.stringify(clientData)
    });

    if (!response.ok) {
      throw new Error('Error actualizando cliente');
    }

    return response.json();
  }
}

// Exportamos una instancia del servicio
export const chatbotService = new ChatbotService();
