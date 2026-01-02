import { API_BASE_URL, getAuthHeaders } from './config';

// Tipos básicos para autenticación
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  razonSocial: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: any;
}

class AuthService {
  private apiUrl = `${API_BASE_URL}/auth`;

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${this.apiUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error('Error en el registro');
    }

    return response.json();
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${this.apiUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      throw new Error('Error en el login');
    }

    const data = await response.json();

    if (data.token) {
      localStorage.setItem('token', data.token);
      // Guardamos también el usuario si viene en la respuesta para poder validar roles
      if (data.user) {
        try {
          localStorage.setItem('user', JSON.stringify(data.user));
        } catch (e) {
          console.warn('No se pudo guardar el usuario en localStorage', e);
        }
      }
    } else {
      throw new Error('Token no recibido');
    }

    return data;
  }

  async getCurrentUser(): Promise<any> {
    const response = await fetch(`${this.apiUrl}/currentUser`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Error obteniendo usuario actual');
    }

    return response.json();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  async enableUser(userId: number): Promise<any> {
    const response = await fetch(`${this.apiUrl}/enable/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Error habilitando usuario');
    }

    return response.json();
  }

  async forgotPassword(email: string): Promise<any> {
    const response = await fetch(`${this.apiUrl}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      throw new Error('Error enviando email de recuperación');
    }

    return response.json();
  }

  async resetPassword(token: string, newPassword: string): Promise<any> {
    // Endpoint permite token como param o body; usaremos body para no exponerlo en logs de infraestructura
    const response = await fetch(`${this.apiUrl}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    });

    if (!response.ok) {
      throw new Error('Error reseteando contraseña');
    }

    return response.json();
  }

  getStoredUser(): any | null {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  parseResetTokenFromLocation(loc: Location | Location & { searchParams?: URLSearchParams } = window.location): string | null {
    try {
      const url = new URL(loc.href || (loc as any).toString());
      const token = url.searchParams.get('resetToken');
      return token || null;
    } catch {
      return null;
    }
  }
}

// Exportamos una instancia del servicio
export const authService = new AuthService();
