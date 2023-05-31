import React, { useState, useEffect } from "react";

import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useDispatch } from "react-redux";
import { activateUser } from "../../redux/actions";

export default function NewUser() {

    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");

    const dispatch = useDispatch();

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const usernameParam = queryParams.get("username");
        if (usernameParam) {
          setUsername(usernameParam);
        }
      }, []);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleRoleChange = (event) => {
     setRole(event.target.value);
    };

  const handleActivarUsuario = () => {
    // Aquí puedes realizar alguna acción con los datos ingresados, por ejemplo, enviarlos al servidor
    dispatch(activateUser( username, role ));
  };

  return (
    <div>
    <TextField
        label="Username"
        value={username}
        onChange={handleUsernameChange}
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