import React, { useState } from "react";

import { TextField, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { resetPassword } from "../../redux/actions";

export default function ResetPassword() {

    const [email, setEmail] = useState("");

    const dispatch = useDispatch();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

  const handleReset = () => {
    // Aquí puedes realizar alguna acción con los datos ingresados, por ejemplo, enviarlos al servidor
    dispatch(resetPassword( email ));
  };

  return (
    <div>
    <TextField
        label="Email"
        value={email}
        onChange={handleEmailChange}
      />
    <Button variant="contained" onClick={handleReset}>
        Recuperar contraseña
    </Button>
  </div>
  );
}