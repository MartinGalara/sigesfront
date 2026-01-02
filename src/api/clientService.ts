import { API_BASE_URL, getAuthHeaders } from './config';

// Tipos básicos para clientes
export interface Client {
  id: number;
  name: string;
  email: string;
  // Agregar más campos según necesidad
}

export interface ClientEmailResponse {
  email: string;
}

class ClientService {
  private apiUrl = `${API_BASE_URL}/clients`;

  async getClients(): Promise<Client[]> {
    const response = await fetch(this.apiUrl, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Error obteniendo clientes');
    }

    return response.json();
  }

  async updateClient(id: number, data: Partial<Client>): Promise<Client> {
    const response = await fetch(`${this.apiUrl}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Error actualizando cliente');
    }

    return response.json();
  }

  /**
   * Obtiene el email global de un cliente específico.
   * @param clientId El ID del cliente.
   * @returns Una promesa que resuelve con el email del cliente.
   */
  async getClientGlobalEmail(clientId: string): Promise<string> {
    const response = await fetch(`${this.apiUrl}/${clientId}/email`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      console.error('Error fetching client global email');
      throw new Error('Could not fetch client global email.');
    }

    console.log(response.json())

    const data: ClientEmailResponse = await response.json();
    return data.email;
  }
}

// Exportamos una instancia del servicio
export const clientService = new ClientService();
