import { API_BASE_URL, getAuthHeaders } from './config';

export interface Botuser {
  id: number;
  name: string;
  phone: string;
  email?: string;
  createUser: boolean;
  canSOS: boolean;
  adminPdf: boolean;
  manager: boolean;
  area: 'P' | 'A' | 'B' | 'T' | 'G';
  createdBy?: string;
  Clients?: Array<{
    id: string;
    info: string;
    email: string;
    vip: string;
    vipmail: string;
    testing: boolean;
  }>;
}

export interface CreateBotuserData {
  name: string;
  phone: string;
  email?: string;
  createUser?: boolean;
  canSOS?: boolean;
  adminPdf?: boolean;
  manager?: boolean;
  area?: 'P' | 'A' | 'B' | 'T' | 'G';
  clientIds: string[];
  createdBy?: string;
}

export interface UpdateBotuserData {
  name?: string;
  phone?: string;
  email?: string;
  createUser?: boolean;
  canSOS?: boolean;
  adminPdf?: boolean;
  manager?: boolean;
  area?: 'P' | 'A' | 'B' | 'T' | 'G';
  createdBy?: string;
  clientIds?: string[];
}

// Area labels for display
export const AREA_LABELS: Record<string, string> = {
  P: 'Playa',
  A: 'Administración',
  B: 'Bodega',
  T: 'Tienda',
  G: 'General',
};

class BotuserService {
  private baseUrl = `${API_BASE_URL}/botusers`;

  // Get all botusers or filter by phone/clientId
  async getBotusers(filters?: { phone?: string; clientId?: string }): Promise<Botuser[]> {
    try {
      let url = this.baseUrl;
      const params = new URLSearchParams();
      
      if (filters?.phone) {
        params.append('phone', filters.phone);
      }
      if (filters?.clientId) {
        params.append('clientId', filters.clientId);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener los botusers');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching botusers:', error);
      throw error;
    }
  }

  // Get botuser by ID
  async getBotuserById(id: number): Promise<Botuser> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener el botuser');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching botuser:', error);
      throw error;
    }
  }

  // Create new botuser
  async createBotuser(data: CreateBotuserData): Promise<Botuser> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el botuser');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating botuser:', error);
      throw error;
    }
  }

  // Update botuser
  async updateBotuser(id: number, data: UpdateBotuserData): Promise<Botuser> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el botuser');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating botuser:', error);
      throw error;
    }
  }

  // Delete botuser
  async deleteBotuser(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar el botuser');
      }
    } catch (error) {
      console.error('Error deleting botuser:', error);
      throw error;
    }
  }

  // Get area label
  getAreaLabel(area: string): string {
    return AREA_LABELS[area] || area;
  }
}

export const botuserService = new BotuserService();
