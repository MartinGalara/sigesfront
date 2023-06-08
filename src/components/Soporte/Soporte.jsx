import React from "react";
import { Grid, Paper, Typography, Divider } from '@mui/material';


export default function Soporte() {
  const phoneNumber = "3512275549"; // Número de teléfono para el chat de soporte

  const openWhatsAppChat = () => {
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    let url;
    if (isMobile) {
      url = `https://api.whatsapp.com/send?phone=${phoneNumber}`;
    } else {
      url = `https://web.whatsapp.com/send?phone=${phoneNumber}`;
    }

    window.open(url, "_blank");
  };

  const openFreshDesk = () => {
    window.open("https://sistemasiges.freshdesk.com/support/home", "_blank");
  }

  const novedades = [
    {
      fecha: "2023-06-01",
      titulo: "Novedad 1",
      descripcion: "Descripción de la novedad 1",
    },
    {
      fecha: "2023-06-02",
      titulo: "Novedad 2",
      descripcion: "Descripción de la novedad 2",
    },
    {
      fecha: "2023-06-03",
      titulo: "Novedad 3",
      descripcion: "Descripción de la novedad 3",
    },
    {
        fecha: "2023-06-03",
        titulo: "Novedad 3",
        descripcion: "Descripción de la novedad 3",
      },
      {
        fecha: "2023-06-03",
        titulo: "Novedad 3",
        descripcion: "Descripción de la novedad 3",
      },
      {
        fecha: "2023-06-03",
        titulo: "Novedad 3",
        descripcion: "Descripción de la novedad 3",
      },
  ];

  const renderNovedades = () => {
    return novedades.map((novedad, index) => (
      <div key={index} style={{ marginBottom: "20px" }}>
        <Typography variant="body1">{novedad.fecha}</Typography>
        <Typography variant="h5">{novedad.titulo}</Typography>
        <Typography variant="body1">{novedad.descripcion}</Typography>
        {index < novedades.length - 1 && <Divider style={{ margin: '20px 0' }} />}
      </div>
    ));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Paper onClick={openWhatsAppChat} style={{ padding: "20px", marginBottom: "20px" }}>
          <Typography variant="h4">Generar Ticket de Soporte</Typography>
          <img
            src="https://www.fayerwayer.com/resizer/bkSvmQ8_6qGak-qaerghmWmZHoA=/800x0/filters:format(jpg):quality(70)/cloudfront-us-east-1.images.arcpublishing.com/metroworldnews/Q4OLTMLC6NAFZDVKOQU5FFX6WE.jpg"
            alt="Imagen del ticket de soporte"
            style={{ width: "100%", marginBottom: "20px" }}
          />
        </Paper>
        <Paper onClick={openFreshDesk} style={{ padding: "20px" }}>
          <Typography variant="h4">Portal de Soporte</Typography>
          <img
            src="data:image/png;base64,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"
            alt="Imagen de Freshdesk"
            style={{ width: "100%", marginBottom: "20px" }}
          />
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper
          style={{ height: "400px", overflowY: "scroll", padding: "20px" }}
        >
          {renderNovedades()}
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper style={{ height: "100%" }}></Paper>
      </Grid>
    </Grid>
  );
}
