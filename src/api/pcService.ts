import { API_BASE_URL, getAuthHeaders } from './config';

// Interfaz para la PC para tener tipado fuerte
export interface Pc {
  id?: string; // El ID podría ser opcional si lo genera el backend (ej. UUID)
  alias: string;
  teamviewer_id: string;
  razonSocial: string;
  bandera: string;
  identificador: string;
  ciudad: string;
  area: string; // Este es el campo de área (P, A, T, etc.)
  prefijo: string;
  extras: string;
  clientId: string; // El ID del cliente al que está asociada esta PC
  // Agrega otros campos que tu modelo Pc pueda tener y que el backend devuelva,
  // especialmente si tienes 'clientInfo' para mostrar datos del cliente asociado.
  clientInfo?: {
    id: string;
    info: string;
    email: string;
    vip: string;
    vipmail: boolean; // Asegúrate de que el tipo sea correcto (boolean vs string)
    testing: boolean;
  };
}

class PcService {
  private apiUrl = `${API_BASE_URL}/pcs`; // La URL base para el endpoint de PCs en tu backend

  /**
   * Obtiene las PCs desde el backend, filtradas por clientId del usuario logeado y opcionalmente por área.
   * Corresponde a GET /api/pcs?clientId=ID_USUARIO&area=LETRA_AREA
   * @param loggedInClientId El ID del cliente del usuario logeado. Es obligatorio para esta búsqueda.
   * @param areaFilter Opcional. El área a filtrar (letras como 'P', 'A', 'T').
   */
  async getAllPcs(loggedInClientId: string, areaFilter?: string): Promise<Pc[]> {
    // Construir los parámetros de consulta
    const params = new URLSearchParams();
    params.set('clientId', loggedInClientId);

    // Si se proporciona un filtro de área y no está vacío, añádelo también
    if (areaFilter) {
      params.set('area', areaFilter);
    }

    const response = await fetch(`${this.apiUrl}?${params.toString()}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Error obteniendo PCs');
    }

    return response.json();
  }

  /**
   * Obtiene una PC específica por su ID desde el backend.
   * Corresponde a GET /api/pcs/:id
   * @param id El ID de la PC a obtener.
   */
  async getPcById(id: string): Promise<Pc> {
    const response = await fetch(`${this.apiUrl}/${id}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Error obteniendo PC por ID');
    }

    return response.json();
  }

  /**
   * Envía los datos de una PC para crearla o actualizarla en el backend.
   * Corresponde a POST /api/pcs (tu endpoint de upsert)
   * @param pcData Los datos de la PC (incluyendo teamviewer_id y clientId).
   */
  async createOrUpdatePc(pcData: Pc): Promise<Pc> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(pcData)
    });

    if (!response.ok) {
      throw new Error('Error creando o actualizando PC');
    }

    return response.json();
  }

  // Los métodos updatePc y deletePc (opcionales) se mantienen comentados,
  // ya que su funcionalidad de filtrado es diferente o inexistente para estos endpoints.
  // Si los necesitas, asegúrate de que tu backend tenga esas rutas implementadas.

  /**
   * (Opcional, si tienes una ruta PUT /api/pcs/:id separada para actualizaciones)
   * Actualiza una PC existente por su ID.
   * Corresponde a PUT /api/pcs/:id
   * @param id El ID de la PC a actualizar.
   * @param data Los datos actualizados de la PC.
   */
  // async updatePc(id: string, data: Pc): Promise<Pc> {
  //   const response = await fetch(`${this.apiUrl}/${id}`, {
  //     method: 'PUT',
  //     headers: getAuthHeaders(),
  //     body: JSON.stringify(data)
  //   });

  //   if (!response.ok) {
  //     throw new Error('Error actualizando PC');
  //   }

  //   return response.json();
  // }

  /**
   * (Opcional, si tienes una ruta DELETE /api/pcs/:id en tu backend)
   * Elimina una PC por su ID.
   * Corresponde a DELETE /api/pcs/:id
   * @param id El ID de la PC a eliminar.
   */
  // async deletePc(id: string): Promise<void> {
  //   const response = await fetch(`${this.apiUrl}/${id}`, {
  //     method: 'DELETE',
  //     headers: getAuthHeaders()
  //   });

  //   if (!response.ok) {
  //     throw new Error('Error eliminando PC');
  //   }
  // }
}

// Exportamos una instancia del servicio
export const pcService = new PcService();
