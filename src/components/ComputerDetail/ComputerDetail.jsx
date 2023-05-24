import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getComputer } from "../../redux/actions";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHistory} from "react-router-dom";
import { clearDetail, editComputer } from "../../redux/actions";
import { Container, Box, TextField, Button }  from '@mui/material'

export default function ComputerDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const computer = useSelector((state) => state.computerDetail);
  const history = useHistory();

  const [input, setInput] = useState({
    alias: "",
    teamviewer_id: "",
    userId: "",
    zone: "",
    order: null,
    simpleFlag: false,
  })

  if(Object.entries(computer).length !== 0 && input.simpleFlag === false){
    setInput({ ...input, 
    alias: computer.alias,
    teamviewer_id: computer.teamviewer_id,
    userId: computer.userId,
    zone: computer.zone,
    order: computer.order,
    simpleFlag: true
    })
  }

  useEffect(() => {
    dispatch(clearDetail())
    dispatch(getComputer(id));
  },[dispatch,id]);

  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.id]: e.target.value})
  }

  const handleSubmit = (e) =>{
    e.preventDefault();

    const enteredKey = window.prompt("Ingresa la clave para eliminar el ticket:");

      if (enteredKey === "asdasd") 
      { 
        dispatch(editComputer(id,{
          alias: input.alias,
          teamviewer_id: input.teamviewer_id,
          userId: input.userId,
          zone: input.zone,
          order: input.order
        }))
        dispatch(clearDetail())
        history.push("/admin/computers")
      } else {
        window.alert("Clave incorrecta. No se pudo editar la computadora.");
      }
}
 
  return (
    <Container>
        <Box component="form" onSubmit={handleSubmit}>
            <TextField
                id="alias"
                label="Alias"
                type="alias"
                variant="outlined"
                fullWidth
                value={input.alias}
                sx={{mt:2}}
                onChange={handleInputChange}
            />

            <TextField
                id="teamviewer_id"
                label="TeamViewer ID"
                type="teamviewer_id"
                variant="outlined"
                fullWidth
                value={input.teamviewer_id}
                sx={{mt:2}}
                onChange={handleInputChange}
            />

            <TextField
                id="userId"
                label="Cliente"
                type="userId"
                variant="outlined"
                fullWidth
                value={input.userId}
                sx={{mt:2}}
                onChange={handleInputChange}
            />

            <TextField
                id="zone"
                label="Zona"
                type="zone"
                variant="outlined"
                fullWidth
                value={input.zone}
                sx={{mt:2}}
                onChange={handleInputChange}
            />

            <TextField
                id="order"
                label="Orden"
                type="order"
                variant="outlined"
                fullWidth
                value={input.order}
                sx={{mt:2}}
                onChange={handleInputChange}
            />

            <Button 
            type="submit" 
            variant="outlined" 
            color="primary" 
            sx={{mt:2}}
            >
            Guardar cambios
            </Button>
        </Box>
    </Container>
  );
}
