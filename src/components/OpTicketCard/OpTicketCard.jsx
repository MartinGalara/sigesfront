import React from "react";
import { Button }  from '@mui/material'
import { useDispatch } from "react-redux";
import { deleteOpTickets } from "../../redux/actions";

export default function OpTicketCard({ id, name, client, detail }) {

    const dispatch = useDispatch();

    function deleteTicket(id) {
      const enteredKey = window.prompt("Ingresa la clave para eliminar el ticket:");

      // Verificar si la clave ingresada coincide con la clave esperada
      if (enteredKey === "asdasd") { // Reemplaza "clave_secreta" con la clave esperada
       // Si la clave coincide, llamar a dispatch
        dispatch(deleteOpTickets(id));
      } else {
        // Si la clave no coincide, mostrar un mensaje de error
        window.alert("Clave incorrecta. No se pudo eliminar el ticket.");
      }
      }

  return (
    <div>
        <h3>
          ID TICKET: {id}
        </h3>
        <h3>
          Operador que lo envio: {name}
        </h3>
      <h4>Cliente a referenciar: {client}</h4>
      <h4>Detalle: {detail}</h4>
      <Button 
            onClick={() => {
                deleteTicket(id)
            }}
            variant="outlined" 
            color="primary" 
            >
            Marcar como resuelto
            </Button>
    </div>
  );
}
