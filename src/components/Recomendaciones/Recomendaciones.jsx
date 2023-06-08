import React, { useState } from "react";
import { Card, CardContent, CardMedia, Typography, Button, CardActions} from "@mui/material";

export default function Recomendaciones() {
  const [expandedCard, setExpandedCard] = useState(null);

  const handleExpandClick = (index) => {
    if (expandedCard === index) {
      setExpandedCard(null);
    } else {
      setExpandedCard(index);
    }
  };

  // Ejemplo de datos en un array
  const datos = [
    {
      titulo: "Alertan sobre el cierre de estaciones de servicio: “Si no se pueden pagar los sueldos, no podemos seguir abiertos”",
      imagen: "https://arc-anglerfish-arc2-prod-infobae.s3.amazonaws.com/public/WMLEUZMAC5GZTM2MTCMSFL2IUM.jpg",
      texto: "Con una caída en las ventas de combustible cercana al 90%, los dueños de las estaciones de servicios aseguran que no pueden sostener los costos de mantener abiertos sus comercios y afrontar el pago los salarios de su personal, que sigue trabajando en el marco de la pandemia del coronavirus.",
    },
    {
      titulo: "Argentina superó las 5000 Estaciones de Servicio",
      imagen: "https://surtidores.com.ar/wp-content/uploads/2021/04/foto1-17.jpg",
      texto: "Diariamente, la Secretaría de Energía da a conocer el listado de establecimientos autorizados a recibir combustibles, según establece la Resolución 1102/04. El registro comprende a las instalaciones que cumplen con los requisitos dispuestos por las auditorías de seguridad y no están alcanzadas por sanciones que impidan su abastecimiento.",
    },
    // ... Puedes agregar más objetos al array
  ];

  return (
    <div>
      {datos.map((item, index) => (
        <Card key={index}>
          <CardContent>
            <Typography variant="h5" component="div">
              {item.titulo}
            </Typography>
          </CardContent>
          <CardMedia
            component="img"
            height="140"
            image={item.imagen}
            alt="Descripción de la imagen"
            sx={{ maxWidth: "40%", height: "auto" }}
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {expandedCard === index ? item.texto : item.texto.slice(0, 50) + "..."}
            </Typography>
          </CardContent>
          <CardActions>
            <Button onClick={() => handleExpandClick(index)}>
              {expandedCard === index ? "Leer menos" : "Leer más"}
            </Button>
          </CardActions>
        </Card>
      ))}
    </div>
  );
}
