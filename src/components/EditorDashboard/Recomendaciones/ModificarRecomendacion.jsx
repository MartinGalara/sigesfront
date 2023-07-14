import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import { useHistory, useParams } from "react-router-dom";
import { fetchRecommendationById } from "../../../api/recomendationApi";
import axios from 'axios';

export default function ModificarRecomendacion() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [flags, setFlags] = useState([]);
  const [file, setFile] = useState(null);
  const history = useHistory();
  const { id } = useParams();
  const [openPopup, setOpenPopup] = useState(false);
  const [cloudinaryImages, setCloudinaryImages] = useState([]);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    async function fetchRecommendation() {
      try {
        const recommendation = await fetchRecommendationById(id);
        setTitle(recommendation.title);
        setText(recommendation.text);
        setImage(recommendation.image);
        setFlags(recommendation.flags);
      } catch (error) {
        console.log(error);
      }
    }

    fetchRecommendation();
  }, [id]);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
    setImage(selectedFile.name);
    setFile(selectedFile);

    // Cerrar la ventana emergente al seleccionar una imagen
    setOpenPopup(false);
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

    setSubmitClicked(true);
  };


  const handleGoBack = () => {
    history.goBack();
  };

  const handleOpenPopup = async () => {
    setOpenPopup(true);
    setImage('');

    try {
      const response = await axios.get('https://sigesback-production.up.railway.app/cloudinary');

      const filteredImages = response.data.resources.filter((image) => image.folder === 'recommendations');
      setCloudinaryImages(filteredImages);
      console.log(cloudinaryImages);
    } catch (error) {
      console.error('Error al cargar las imágenes de Cloudinary:', error);
    }
  };

  const handleImageClick = (imageUrl) => {
    setImage(imageUrl);
    setOpenPopup(false);
  };

  useEffect(() => {
    if (image !== '' && /^https?:\/\//.test(image)) {
      setImageLoaded(true);
    } else {
      setImageLoaded(false);
    }

    if(submitClicked && imageLoaded){
      console.log("hago el dispatch al back")
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
    setTitle('');
    setText('');
    setImage('');
    setFlags([]);
    setFile(null);
    setSubmitClicked(false);
    setImageLoaded(false);

    }
  }, [image,submitClicked,imageLoaded,title,text,flags]);

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
                    <MenuItem value={'Flag 1'}>Flag 1</MenuItem>
                    <MenuItem value={'Flag 2'}>Flag 2</MenuItem>
                    <MenuItem value={'Flag 3'}>Flag 3</MenuItem>
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
          {/* Botones en la parte superior */}
          <div className="popup-buttons">
            <Button variant="contained" color="secondary" onClick={() => setOpenPopup(false)}>
              Cerrar
            </Button>
            <div className="popup-title">Seleccione una imagen</div>
            <Button variant="contained" component="label">
              Cargar nueva imagen
              <input type="file" style={{ display: 'none' }} onChange={handleImageChange} />
            </Button>
          </div>

          {/* Contenido de la ventana emergente */}
          <div className="image-container">
            {cloudinaryImages.map((e, index) => (
              <img key={index} src={e.url} alt={`${index}`} onClick={() => handleImageClick(e.url)} />
            ))}
          </div>
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
          width: 1000px; /* Ajusta el tamaño de la ventana emergente a tu gusto */
          height: 800px; /* Ajusta el tamaño de la ventana emergente a tu gusto */
          overflow: auto;
        }

        .popup-buttons {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .popup-title {
          font-size: 1.2rem;
          font-weight: bold;
        }

        .image-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-gap: 16px;
        }

        .image-container img {
          width: 100%;
          height: 200px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
