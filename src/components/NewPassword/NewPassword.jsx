import React, { useState, useEffect } from "react";

import { TextField, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { changePassword } from "../../redux/actions";

export default function NewPassword() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const emailParam = queryParams.get("email");
        if (emailParam) {
          setEmail(emailParam);
        }
      }, []);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
     setPassword(event.target.value);
    };

  const handleSubmit = () => {
    // Aquí puedes realizar alguna acción con los datos ingresados, por ejemplo, enviarlos al servidor
        dispatch(changePassword( email, password ));

  };

  return (
    <div>
    <TextField
        label="Email"
        value={email}
        onChange={handleEmailChange}
        disabled
      />
      <TextField 
      id="password"
      label="Contraseña"
      type="password"
      value={password}
      onChange={handlePasswordChange}
      inputProps={{
        minLength: 8, // Establece la longitud mínima de 8 caracteres
        maxLength: 30 // Establece la longitud máxima de 30 caracteres
      }}
      helperText={`La contraseña debe tener entre 8 y 30 caracteres`}
    />
    <Button variant="contained" onClick={handleSubmit}>
        Cambiar contraseña
    </Button>
  </div>
  );
}