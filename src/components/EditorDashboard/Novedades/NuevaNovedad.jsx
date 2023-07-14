import React, { useState } from 'react';
import { TextField, Button, Grid, Box } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

export default function NuevaNovedad() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [date, setDate] = useState(dayjs().format('DD/MM/YYYY')); // Inicializar con la fecha actual en formato 'DD/MM/YYYY'

  const history = useHistory();

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleDateChange = (newValue) => {
    const formattedDate = newValue.format('DD/MM/YYYY'); // Formatear la fecha seleccionada en 'DD/MM/YYYY'
    setDate(formattedDate);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("submit!")
  };

  const handleGoBack = () => {
    history.goBack();
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleGoBack} style={{ marginBottom: '16px' }}>
        Volver
      </Button>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box width="60%">
              <TextField label="Title" value={title} onChange={handleTitleChange} fullWidth margin="normal" required />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box width="60%">
              <TextField
                label="Text"
                value={text}
                onChange={handleTextChange}
                fullWidth
                margin="normal"
                required
                multiline
                rows={4}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box width="60%">
              <DatePicker
                label="Date"
                value={dayjs(date, 'DD/MM/YYYY')} // Convertir la fecha guardada en formato 'DD/MM/YYYY' a un objeto dayjs
                onChange={handleDateChange}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
