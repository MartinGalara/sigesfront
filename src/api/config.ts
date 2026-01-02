// config.ts
export const API_BASE_URL = getApiUrl();

function getApiUrl(): string {
  if (import.meta.env.PROD) {
    return 'https://botserver-production-9926.up.railway.app'; // URL de producción
  } else {
    return 'http://localhost:3000'; // URL de desarrollo
  }
}

// Headers comunes para las peticiones
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': token })
  };
};

export const getAuthHeadersMultipart = () => {
  const token = localStorage.getItem('token');
  return {
    ...(token && { 'Authorization': token })
  };
};
