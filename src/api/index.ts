// Exportamos todos los servicios desde un punto central
export { authService } from './authService';
export { userService } from './userService';
export { clientService } from './clientService';
export { pcService } from './pcService';
export { capacitacionesService } from './capacitacionesService';
export { chatbotService } from './chatbotService';
export { freshdeskService } from './freshdeskService';
export { botuserService, AREA_LABELS } from './botuserService';

// Exportamos tipos comunes
export type { LoginCredentials, RegisterData, AuthResponse } from './authService';
export type { User } from './userService';
export type { Client, ClientEmailResponse } from './clientService';
export type { Pc } from './pcService';
export type { Instructivo } from './capacitacionesService';
export type { DeviceData, ClientData } from './chatbotService';
export type { NewTicket, TicketData } from './freshdeskService';
export type { Botuser, CreateBotuserData, UpdateBotuserData } from './botuserService';

// Exportamos configuración si es necesaria
export { API_BASE_URL, getAuthHeaders, getAuthHeadersMultipart } from './config';
