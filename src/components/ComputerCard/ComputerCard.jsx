import React from "react";
import { Button }  from '@mui/material'
import { Link } from "react-router-dom";

export default function ComputerCard({ alias, area, client, clientId, extras, teamviewer_id, id }) {

  console.log(alias)

  return (
    <div>
        <h3>
          Cliente: {client}
        </h3>
        <h3>
          ID cliente: {clientId}
        </h3>
        <h3>
          Alias: {alias}
        </h3>
        <h3>
          Area: {area}
        </h3>
        <h3>
          TeamViewer ID: {teamviewer_id}
        </h3>
        <h3>
          Extras: {extras}
        </h3>
        
        <Link to={`/admin/computers/${id}`}>
            <Button 
            variant="outlined" 
            color="primary" 
            >
            Editar
            </Button>
        </Link>
    </div>
  );
}
