import React, { useState } from "react";

import { TextField, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { resetPassword } from "../../redux/actions";

export default function ResetPassword() {

    const [username, setUsername] = useState("");

    const dispatch = useDispatch();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

  const handleReset = () => {
    // Aquí puedes realizar alguna acción con los datos ingresados, por ejemplo, enviarlos al servidor
    dispatch(resetPassword( username ));
  };

  return (
    <div>
    <TextField
        label="Username"
        value={username}
        onChange={handleUsernameChange}
      />
    <Button variant="contained" onClick={handleReset}>
        Recuperar contraseña
    </Button>
  </div>
  );
}