import React from "react";
import { Card, CardContent, CardMedia, Typography, Button, CardActions, Grid } from "@mui/material";
import { Link } from "react-router-dom";

export default function Recomendaciones() {
  // Ejemplo de datos en un array
  const datos = [
    {
      titulo: "Alertan sobre el cierre de estaciones de servicio: “Si no se pueden pagar los sueldos, no podemos seguir abiertos”",
      imagen: "https://arc-anglerfish-arc2-prod-infobae.s3.amazonaws.com/public/WMLEUZMAC5GZTM2MTCMSFL2IUM.jpg",
      texto: "Con una caída en las ventas de combustible cercana al 90%, los dueños de las estaciones de servicios aseguran que no pueden sostener los costos de mantener abiertos sus comercios y afrontar el pago los salarios de su personal, que sigue trabajando en el marco de la pandemia del coronavirus.",
      url: "/noticia1"
    },
    {
      titulo: "Argentina superó las 5000 Estaciones de Servicio",
      imagen: "https://surtidores.com.ar/wp-content/uploads/2021/04/foto1-17.jpg",
      texto: "Diariamente, la Secretaría de Energía da a conocer el listado de establecimientos autorizados a recibir combustibles, según establece la Resolución 1102/04. El registro comprende a las instalaciones que cumplen con los requisitos dispuestos por las auditorías de seguridad y no están alcanzadas por sanciones que impidan su abastecimiento.",
      url: "/noticia2"
    },
    // ... Puedes agregar más objetos al array
  ];

  const getFirstParagraph = (text) => {
    const paragraphs = text.split("\n");
    return paragraphs[0];
  };

  return (
    <Grid container spacing={2}>
      {datos.map((item, index) => (
        <Grid item xs={12} sm={4} key={index}>
          <Card sx={{ border: '1px solid gray' }}>
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
              sx={{ maxWidth: "100%", height: "auto" }}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {getFirstParagraph(item.texto)}
              </Typography>
            </CardContent>
            <CardActions>
              <Button component={Link} to={item.url}>
                Leer más
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
