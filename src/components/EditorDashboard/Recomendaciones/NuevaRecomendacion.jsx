import React, { useState } from 'react';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { Image } from 'cloudinary-react';

export default function NuevaRecomendacion() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [flags, setFlags] = useState([]);
  const [file, setFile] = useState(null);

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
        formData.append('upload_preset', 'recommendations'); // Reemplaza 'TU_PRESET' con tu propio valor de upload_preset

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

  const openMediaLibrary = async () => {
    try {
      const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

      const result = await window.cloudinary.openUploadWidget({
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        multiple: false,
        resourceType: 'image',
        maxFiles: 1,
        language: 'es',
      });

      console.log(result)

      if (result.event === 'success') {
        const selectedImage = result.info.secure_url;
        setImage(selectedImage);
      }
    } catch (error) {
      console.error('Error al abrir la biblioteca de medios de Cloudinary:', error);
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
                <Button variant="contained" color="primary" onClick={openMediaLibrary}>
                  Select Photo from Cloudinary
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
      <Grid item xs={12}>
        {image && <Image cloudName="TU_CLOUD_NAME" publicId={image} />}
      </Grid>
    </div>
  );
}
