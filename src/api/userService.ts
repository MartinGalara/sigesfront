import { API_BASE_URL, getAuthHeaders } from './config';

// Tipos básicos para usuarios
export interface User {
  id: number;
  name: string;
  email: string;
  firstName?: string;
  razonSocial?: string;
  role?: string;
  status?: number;
  clientId?: string;
  owner?: boolean;
  clientInfo?: {
    id: string;
    info: string;
    email: string;
    vip: string;
    vipmail: string;
    testing: boolean;
  };
}

export interface CreateUserData {
  firstName: string;
  email: string;
  password: string;
  role: string;
  status: number;
  razonSocial: string;
  clientId: string;
  owner: boolean;
}

class UserService {
  private apiUrl = `${API_BASE_URL}/users`;

  async getUsers(clientId?: string): Promise<User[]> {
    const url = clientId ? `${this.apiUrl}?clientId=${clientId}` : this.apiUrl;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Error obteniendo usuarios');
    }

    return response.json();
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const response = await fetch(`${this.apiUrl}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Error actualizando usuario');
    }

    return response.json();
  }

  async createUser(userData: CreateUserData): Promise<User> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error('Error creando usuario');
    }

    return response.json();
  }

  async deleteUser(id: number): Promise<void> {
    const response = await fetch(`${this.apiUrl}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Error eliminando usuario');
    }
  }
}

// Exportamos una instancia del servicio
export const userService = new UserService();
