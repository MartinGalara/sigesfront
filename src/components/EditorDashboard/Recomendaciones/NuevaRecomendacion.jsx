import React, { useState } from 'react';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { Buffer } from 'buffer';

export default function NuevaRecomendacion() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [flags, setFlags] = useState([]);
  const [file, setFile] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [cloudinaryImages, setCloudinaryImages] = useState([]);

  const history = useHistory();

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleFlagsChange = (event) => {
    setFlags(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verificar si se seleccionó una foto localmente
    if (file) {
      try {
        const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'recommendations');

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        const imageUrl = data.secure_url;

        // Actualizar el estado de la imagen con la URL de Cloudinary
        setImage(imageUrl);
      } catch (error) {
        console.error('Error al cargar la imagen:', error);
      }
    }

    // Resto del código para enviar los datos al backend
    const data = {
      title: title,
      text: text,
      image: image,
      flags: flags,
    };
    // Realizar la lógica para enviar los datos al backend
    console.log(data);
    // Luego puedes redirigir o realizar alguna acción adicional
  };

  const handleGoBack = () => {
    history.goBack();
  };

  const handleOpenPopup = async () => {
    setOpenPopup(true);
    try {
     /*  const results = await fetch('/api/v1_1/diapwgajv/resources/search', {
			headers: {
				Authorization: `Basic ${Buffer.from(
					CLOUDINARY_API_KEY + ':' + CLOUDINARY_API_SECRET
				).toString('base64')}`,
			},
		}).then((res) => res.json());
		const cloudinary_array = await results.resources;
		const cloudinary_images = await cloudinary_array.filter(
			(index) => index.folder === 'AppGym-facilities'
		); */
    } catch (error) {
      console.error('Error al cargar las imágenes de Cloudinary:', error);
    }
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
              <FormControl fullWidth margin="normal">
                <TextField label="Image" value={image} onChange={handleImageChange} disabled />
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item>
                <Button variant="contained" component="label">
                  Upload Local Photo
                  <input type="file" style={{ display: 'none' }} onChange={handleImageChange} />
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" onClick={handleOpenPopup}>
                  Elegir Foto
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Box width="60%">
              <FormControl fullWidth margin="normal">
                <InputLabel>Flags</InputLabel>
                <Select multiple value={flags} onChange={handleFlagsChange}>
                  <MenuItem value="flag1">Flag 1</MenuItem>
                  <MenuItem value="flag2">Flag 2</MenuItem>
                  <MenuItem value="flag3">Flag 3</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Ventana emergente */}
      {openPopup && (
        <div className="popup">
          {/* Contenido de la ventana emergente */}
          {cloudinaryImages.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`${index}`} />
          ))}
        </div>
      )}

      <style jsx>{`
        .popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: white;
          padding: 20px;
          border: 1px solid #ccc;
          z-index: 9999;
        }
      `}</style>
    </div>
  );
}
