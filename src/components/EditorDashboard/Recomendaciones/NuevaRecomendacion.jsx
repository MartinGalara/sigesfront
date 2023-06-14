import React, { useState } from "react";
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import { useHistory } from "react-router-dom";

export default function NuevaRecomendacion() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [flags, setFlags] = useState([]);

  const history = useHistory();

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.value);
  };

  const handleFlagsChange = (event) => {
    setFlags(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí puedes enviar los datos al backend
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

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleGoBack} style={{ marginBottom: "16px" }}>
        Volver
      </Button>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box width="60%">
              <TextField
                label="Title"
                value={title}
                onChange={handleTitleChange}
                fullWidth
                margin="normal"
                required
              />
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
                <TextField
                  label="Image"
                  value={image}
                  onChange={handleImageChange}
                  disabled
                />
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item>
                <Button variant="contained" component="label">
                  Upload Local Photo
                  <input type="file" style={{ display: "none" }} />
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary">
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
    </div>
  );
}
