import { API_BASE_URL, getAuthHeaders, getAuthHeadersMultipart } from './config';

// Tipos para capacitaciones
export interface Instructivo {
  id?: string;
  category: string;
  filename: string;
}

class CapacitacionesService {
  private apiUrl = `${API_BASE_URL}/upload`;

  // Obtiene las carpetas (categorías)
  async getFolders(): Promise<any[]> {
    const response = await fetch(`${this.apiUrl}/folders`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Error obteniendo carpetas');
    }
    return response.json();
  }

  // Obtiene los archivos de una carpeta
  async getFilesByFolder(folderId: string): Promise<any[]> {
    const response = await fetch(`${this.apiUrl}/files/${folderId}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Error obteniendo archivos de la carpeta');
    }
    return response.json();
  }

  async uploadInstructivo(formData: FormData): Promise<any> {
    const response = await fetch(`${this.apiUrl}/upload`, {
      method: 'POST',
      headers: getAuthHeadersMultipart(),
      body: formData
    });
    if (!response.ok) {
      throw new Error('Error subiendo instructivo');
    }
    return response.json();
  }

  // Descarga un archivo por su fileId
  async downloadInstructivo(fileId: string, filename: string): Promise<Blob> {
    const response = await fetch(`${this.apiUrl}/download/${fileId}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Error descargando instructivo');
    }
    return response.blob();
  }

  // Elimina un archivo por su fileId
  async deleteInstructivo(fileId: string): Promise<any> {
    const response = await fetch(`${this.apiUrl}/files/${fileId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Error eliminando instructivo');
    }
    return response.json();
  }

  // (Opcional) Aquí podrías agregar métodos para activar/desactivar si lo implementas en backend
}

// Exportamos una instancia del servicio
export const capacitacionesService = new CapacitacionesService();
