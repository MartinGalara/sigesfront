import axios from "axios";

export const fetchNews = async () => {

    const novedades = [
        {
          id: 1,
          title: "Descubrimiento de yacimiento de petróleo",
          date: "2023-07-01",
          text: "Se ha realizado un importante descubrimiento de un yacimiento de petróleo en una nueva ubicación, lo que representa una gran oportunidad para la industria petrolera.",
        },
        {
          id: 2,
          title: "Avances en la tecnología de extracción de petróleo",
          date: "2023-06-15",
          text: "Se han logrado avances significativos en la tecnología utilizada para la extracción de petróleo, lo que permitirá aumentar la eficiencia y reducir los costos en la industria petrolera.",
        },
        {
          id: 3,
          title: "Inversiones en energías renovables",
          date: "2023-05-20",
          text: "Las empresas petroleras están realizando importantes inversiones en el desarrollo de energías renovables, como la solar y la eólica, como parte de sus esfuerzos por diversificar sus fuentes de energía.",
        },
        // Agrega más objetos de novedades aquí...
      ];

      return novedades
  /* try {
    const response = await axios.get("https://sigesback-production.up.railway.app/recommendations"); // Reemplaza "/api/recommendations" con la ruta correcta hacia tu endpoint de recomendaciones en el backend
    return response.data; // Retorna los datos de las recomendaciones recibidas desde el backend
  } catch (error) {
    console.error("Error al obtener las recomendaciones:", error);
    throw error;
  } */
};

export const fetchNewsById = async (id) => {
  try {
    const response = await axios.get(`https://sigesback-production.up.railway.app/recommendations?id=${id}`); // Reemplaza "/api/recommendations" con la ruta correcta hacia tu endpoint de recomendaciones en el backend
    return response.data; // Retorna los datos de las recomendaciones recibidas desde el backend
  } catch (error) {
    console.error("Error al obtener la recomendacion:", error);
    throw error;
  }
};