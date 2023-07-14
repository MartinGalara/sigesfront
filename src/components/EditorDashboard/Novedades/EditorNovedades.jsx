import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button, Grid } from "@mui/material";
import { useHistory } from "react-router-dom";
import { fetchNews } from "../../../api/newsApi";

export default function EditorNovedades() {
  const [news, setNews] = useState([]);
  const history = useHistory();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchNews();
        setNews(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  const handleNewUrl = (url) => {
    history.push(url);
  };

  const handleEliminar = () => {
    // Aquí puedes implementar la lógica para eliminar el elemento
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Button
          variant="outlined"
          color="primary"
          style={{ marginBottom: "16px" }}
          onClick={() => handleNewUrl("/novedades/crear")}
        >
          Nueva Novedad
        </Button>
      </Grid>
      {news.map((item) => (
        <Grid item xs={12} sm={6} key={item.id}>
          <Card style={{ height: "100%", position: "relative" }}>
            <CardContent style={{ width: "80%" }}>
              <Typography variant="h6">{item.title}</Typography>
              <Typography variant="h6">{item.date}</Typography>
              <Typography variant="body2" component="p" paragraph>
                {item.text}
              </Typography>
            </CardContent>
            <div
              style={{
                position: "absolute",
                right: "30px",
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                style={{ marginBottom: "8px", width: "100%" }}
                onClick={() => handleNewUrl(`/novedades/modificar/${item.id}`)}
              >
                Editar
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                style={{ width: "100%" }}
                onClick={handleEliminar}
              >
                Eliminar
              </Button>
            </div>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
