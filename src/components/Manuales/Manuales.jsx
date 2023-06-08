import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

export default function Manuales() {
  const manuales = [
    {
      titulo: "Manual de Usuario",
      descripcion: "Guía para utilizar nuestra aplicación",
      pdfUrl: "/pdf/manual-usuario.pdf",
    },
    {
      titulo: "Manual Técnico",
      descripcion: "Detalles técnicos de nuestra aplicación",
      pdfUrl: "/pdf/manual-tecnico.pdf",
    },
    // Agrega más objetos al array si necesitas más tarjetas
  ];

  return (
    <div>
      {manuales.map((manual, index) => (
        <Card key={index} sx={{ maxWidth: 400, margin: "0 auto 16px" }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {manual.titulo}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {manual.descripcion}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              href={manual.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Descargar PDF
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
