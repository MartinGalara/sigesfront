import React, { useState, useEffect } from 'react';
import { Button, Input, Card, CardContent, Typography, Container, Grid } from '@mui/material';
import { useHistory } from 'react-router-dom';

export default function Clients() {
  const history = useHistory();
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Simula una llamada a un endpoint para obtener la lista de clientes.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://sigesback-production.up.railway.app/clients');
        if (response.ok) {
          const data = await response.json();
          setClients(data);
        } else {
          console.error('Error fetching clients:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };
  
    fetchData();
  }, []);
  

  // Filtrar los clientes según el término de búsqueda.
  const filteredClients = clients.filter((client) =>
  client.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
  client.info.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <Container>
      <Button variant="contained" color="primary" onClick={() => history.push('/admin')}>
        Volver
      </Button>
      <Input
        placeholder="Buscar clientes"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Grid container spacing={2}>
      {filteredClients.map((client) => (
  <Grid item key={client.id} xs={12} sm={6} md={4}>
    <Card>
      <CardContent>
        <Typography variant="h6">ID: {client.id}</Typography>
        <Typography>Email: {client.email}</Typography>
        <Typography>Info: {client.info}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => history.push(`/admin/clients/${client.id}`)}
        >
          Editar
        </Button>
      </CardContent>
    </Card>
  </Grid>
))}
      </Grid>
    </Container>
  );
}
