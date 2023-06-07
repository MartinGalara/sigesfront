import React, { useState } from "react";
import { TextField, Button, Link } from "@mui/material";
import { useDispatch } from "react-redux";
import { login } from "../../redux/actions";

export default function LoginForm() {
  const [input, setInput] = useState({
    email: "",
    password: ""
  });

  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login(input));
    setInput({
      email: "",
      password: ""
    });
  };

  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.id]: e.target.value });
  };

  return (
    <div>
      <TextField
        id="email"
        label="Email"
        type="email"
        value={input.email}
        onChange={handleInputChange}
      />
      <br />
      <TextField
        id="password"
        label="Contraseña"
        type="password"
        value={input.password}
        onChange={handleInputChange}
      />
      <br />
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Iniciar sesión
      </Button>
      <br />
      <Link href="/createaccount">No tenes cuenta? Crear cuenta</Link>
      <br />
      <Link href="/resetpassword">Olvidaste la contraseña?</Link>
    </div>
  );
}