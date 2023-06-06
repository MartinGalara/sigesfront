import React, { useState, useEffect } from "react";

import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useDispatch } from "react-redux";
import { activateUser } from "../../redux/actions";

export default function NewUser() {

    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");

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

    const handleRoleChange = (event) => {
     setRole(event.target.value);
    };

  const handleActivarUsuario = () => {
    // Aquí puedes realizar alguna acción con los datos ingresados, por ejemplo, enviarlos al servidor
    dispatch(activateUser( email, role ));
  };

  return (
    <div>
    <TextField
        label="Email"
        value={email}
        onChange={handleEmailChange}
        disabled
      />
    <FormControl>
        <InputLabel>Rol</InputLabel>
        <Select value={role} onChange={handleRoleChange}>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="User">User</MenuItem>
        </Select>
    </FormControl>
    <Button variant="contained" onClick={handleActivarUsuario}>
        Activar Usuario
    </Button>
  </div>
  );
}