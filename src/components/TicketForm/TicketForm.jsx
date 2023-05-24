import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Container, Box, TextField, Button }  from '@mui/material'
import { createTicket } from "../../redux/actions";

export default function TicketForm() {

    const [input, setInput] = useState({
        name: "",
        client: "",
        detail: ""
    })

    const [errors, setErrors] = useState({
        name: "Ingrese el nombre del operador que genera el ticket",
        detail: "Ingrese el detalle del ticket"
    })

    const dispatch = useDispatch();

    const handleSubmit = (e) =>{
        e.preventDefault();
        dispatch(createTicket(input))
        setInput({
            name: "",
            client: "",
            detail: ""
        })
        setErrors({
            name: "Ingrese el nombre del operador que genera el ticket",
            detail: "Ingrese el detalle del ticket"
        })
    }

    const validate = (input) => {
        let errors = {};
        if(!input.name) errors.name = "Ingrese el nombre del operador que genera el ticket";
        if(!input.detail) errors.detail = "Ingrese el detalle del ticket";

        return errors;

    }
    
    const handleInputChange = (e) => {
        setInput({ ...input, [e.target.id]: e.target.value})
        setErrors(validate({ ...input, [e.target.id]: e.target.value}))
    }

  return (
    <Container>
        <Box component="form" onSubmit={handleSubmit}>
            <TextField
                id="name"
                label="Nombre"
                type="name"
                variant="outlined"
                fullWidth
                helperText={errors.name ? errors.name : "Ingrese su nombre"}
                value={input.name}
                onChange={handleInputChange}
                error={errors.name}
            />

            <TextField
                id="client"
                label="Cliente a referenciar"
                type="client"
                variant="outlined"
                fullWidth
                helperText="Ingrese el nombre del cliente a refernciar si lo hay"
                value={input.client}
                onChange={handleInputChange}
            />

            <TextField
                id="detail"
                label="Detalle"
                type="detail"
                variant="outlined"
                fullWidth
                helperText={errors.detail ? errors.detail : "Ingrese el detalle del ticket"}
                multiline
                value={input.detail}
                onChange={handleInputChange}
                error={errors.detail}
            />

            <Button 
            type="submit" 
            variant="outlined" 
            color="primary" 
            sx={{mt:2}}
            disabled={Object.entries(errors).length !== 0}
            >
            Enviar ticket
            </Button>
        </Box>
    </Container>
  );
}
