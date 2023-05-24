import React from "react";
import { Button }  from '@mui/material'
import { Link } from "react-router-dom";

export default function AdminDashboard() {

  return (
    <div>
      <Link to="/admin/optickets">
        <Button 
        variant="outlined" 
        color="primary" 
        >
        Tickets de operadores
        </Button>
      </Link>
      <Link to="/admin/clients">
        <Button 
        variant="outlined" 
        color="primary" 
        >
        Clientes
        </Button>
      </Link>
      <Link to="/admin/computers">
        <Button 
        variant="outlined" 
        color="primary" 
        >
        Computadoras
        </Button>
      </Link>
    </div>
  );
}
