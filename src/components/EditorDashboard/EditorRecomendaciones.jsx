import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button, Grid } from "@mui/material";
import { useHistory } from "react-router-dom";

export default function EditorRecomendaciones() {
  const datos = [
    {
      titulo: "Alertan sobre el cierre de estaciones de servicio: “Si no se pueden pagar los sueldos, no podemos seguir abiertos”",
      texto: "Con una caída en las ventas de combustible cercana al 90%, los dueños de las estaciones de servicios aseguran que no pueden sostener los costos de mantener abiertos sus comercios y afrontar el pago los salarios de su personal, que sigue trabajando en el marco de la pandemia del coronavirus.",
      url: "/noticia1"
    },
    {
      titulo: "Argentina superó las 5000 Estaciones de Servicio",
      texto: "Diariamente, la Secretaría de Energía da a conocer el listado de establecimientos autorizados a recibir combustibles, según establece la Resolución 1102/04. El registro comprende a las instalaciones que cumplen con los requisitos dispuestos por las auditorías de seguridad y no están alcanzadas por sanciones que impidan su abastecimiento.",
      url: "/noticia2"
    },
    // ... Puedes agregar más objetos al array
  ];

  const history = useHistory();

  const handleEditar = (url) => {
    history.push(url);
  };

  const handleEliminar = () => {
    // Aquí puedes implementar la lógica para eliminar el elemento
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Button variant="outlined" color="primary" style={{ marginBottom: "16px" }} onClick={() => handleEditar("/nueva-recomendacion")}>
          Nueva Recomendación
        </Button>
      </Grid>
      {datos.map((item, index) => (
        <Grid item xs={12} sm={6} key={index}>
          <Card style={{ height: "100%", position: "relative" }}>
            <CardContent style={{ width: "80%" }}>
              <Typography variant="h6">{item.titulo}</Typography>
              <Typography variant="body2" component="p" paragraph>
                {item.texto.split("\n")[0]}
              </Typography>
            </CardContent>
            <div style={{ position: "absolute", right: "30px", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <Button variant="outlined" color="primary" style={{ marginBottom: "8px", width: "100%" }} onClick={() => handleEditar(item.url)}>
                Editar
              </Button>
              <Button variant="outlined" color="secondary" style={{ width: "100%" }} onClick={handleEliminar}>
                Eliminar
              </Button>
            </div>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
