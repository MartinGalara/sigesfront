import axios from "axios";

export const fetchRecommendations = async () => {
  try {
    const response = await axios.get("https://sigesback-production.up.railway.app/recommendations"); // Reemplaza "/api/recommendations" con la ruta correcta hacia tu endpoint de recomendaciones en el backend
    return response.data; // Retorna los datos de las recomendaciones recibidas desde el backend
  } catch (error) {
    console.error("Error al obtener las recomendaciones:", error);
    throw error;
  }
};

export const fetchRecommendationById = async (id) => {
  try {
    const response = await axios.get(`https://sigesback-production.up.railway.app/recommendations?id=${id}`); // Reemplaza "/api/recommendations" con la ruta correcta hacia tu endpoint de recomendaciones en el backend
    return response.data; // Retorna los datos de las recomendaciones recibidas desde el backend
  } catch (error) {
    console.error("Error al obtener la recomendacion:", error);
    throw error;
  }
};