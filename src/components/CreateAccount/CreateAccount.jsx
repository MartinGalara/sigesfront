import React, { useState, useEffect } from "react";

import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { findUser, createWebUser } from "../../redux/actions";

export default function CreateAccount() {

    const [input, setInput] = useState({
        flag:"",
        id: "",
        password: "",
        email: "",
        identificador:""
      })
    
      const dispatch = useDispatch();
      const userInfo = useSelector(state => state.userInfo);

      const handleInputChange = (e) => {
        setInput({ ...input, [e.target.id]: e.target.value})
      }

      const handleFlagChange = (e) => {
        setInput({ ...input, flag: e.target.value });
    }

    useEffect(() => {
        if(Object.keys(userInfo).length === 0){
            alert('No se encontro a un cliente con ese identificador')
        }else if(!userInfo.hasOwnProperty('empty')){
            dispatch(createWebUser({
              email: input.email,
              password: input.password,
              userId: input.identificador,
              defaultEmail: userInfo.email
            }))
            alert(`Se envió un correo electrónico a ${userInfo.email} para habilitar el usuario creado.`);
        }
      }, [userInfo, dispatch, input.identificador, input.password, input.email]);
    


      const handleCreateAccount = () => {
    
        let identificador = ""

        switch (input.flag) {
            case "YPF": 
                identificador = "YP"
                break;
            case "Shell": 
                identificador = "SH"
                break;
            case "Axion": 
                identificador = "AX"
                break;
            case "Puma": 
                identificador = "PU"
                break;
            case "Gulf": 
                identificador = "GU"
                break;
            case "Refinor": 
                identificador = "RE"
                break;   
            case "Est. Blanca": 
                identificador = "BL"
                break;
            case "Otro": 
                identificador = "OT"
              break;
            default:
              break;
      };

      identificador = identificador + input.id
      setInput({ ...input, identificador: identificador });
      dispatch(findUser(identificador))
    }

  return (
    <FormControl fullWidth>
        <InputLabel id="flag-label">Seleccione una bandera</InputLabel>
        <Select
        id="flag"
        value={input.flag}
        onChange={handleFlagChange}
        label="Seleccione una bandera"
      >
        <MenuItem value="YPF">YPF</MenuItem>
        <MenuItem value="Shell">Shell</MenuItem>
        <MenuItem value="Axion">Axion</MenuItem>
        <MenuItem value="Puma">Puma</MenuItem>
        <MenuItem value="Gulf">Gulf</MenuItem>
        <MenuItem value="Refinor">Refinor</MenuItem>
        <MenuItem value="Est. Blanca">Est. Blanca</MenuItem>
        <MenuItem value="Otro">Otro</MenuItem>
      </Select>
      <br />
     <TextField 
      id="id"
      label="Identificador"
      type="id"
      value={input.id}
      onChange={handleInputChange}
      helperText={`Identificador único de estacion (Ej: YPF => Apies)`}
    />
    <br />
    <TextField 
      id="email"
      label="Correo"
      type="email"
      value={input.email}
      onChange={handleInputChange}
      inputProps={{
        maxLength: 20 // Establece el límite máximo de 30 caracteres
      }}
      helperText={`Ingrese un correo valido`}
    />
    <br /><TextField 
      id="password"
      label="Contraseña"
      type="password"
      value={input.password}
      onChange={handleInputChange}
      inputProps={{
        minLength: 8, // Establece la longitud mínima de 8 caracteres
        maxLength: 30 // Establece la longitud máxima de 30 caracteres
      }}
      helperText={`La contraseña debe tener entre 8 y 30 caracteres`}
    />
    <br />

    <Button variant="contained" color="primary" onClick={handleCreateAccount}>
        Crear cuenta
      </Button>

    </FormControl>
  );
}