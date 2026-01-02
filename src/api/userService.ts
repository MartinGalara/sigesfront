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
  clientId?: number;
  // Agregar más campos según necesidad
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

  async getUsers(): Promise<User[]> {
    const response = await fetch(this.apiUrl, {
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
}

// Exportamos una instancia del servicio
export const userService = new UserService();
