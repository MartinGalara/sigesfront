import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

const clientFieldStyle = {
  marginBottom: '20px', // Separación vertical entre campos del cliente
  marginTop: '20px'
};

export default function EditClient() {
  const { id } = useParams();
  const history = useHistory(); // Para redireccionar

  const [clientData, setClientData] = useState({
    id: '',
    email: [],
    info: '',
    vip: '',
    vipmail: '',
    testing: false,
    botusers: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://sigesback-production.up.railway.app/clients?id=${id}`);
        if (response.ok) {
          const data = await response.json();
          setClientData(data); // Establece el estado 'clientData' con los datos recibidos.
        } else {
          console.error('Error fetching client data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    fetchData();
  }, [id]);

  // Función para manejar cambios en los campos editables del formulario.
  const handleFieldChange = (fieldName, value) => {
    setClientData((prevClientData) => ({
      ...prevClientData,
      [fieldName]: value,
    }));
  };

  const addEmailField = () => {
    setClientData((prevClientData) => ({
      ...prevClientData,
      email: [...prevClientData.email, ''],
    }));
  };

  const removeEmailField = (index) => {
    setClientData((prevClientData) => {
      const updatedEmails = [...prevClientData.email];
      updatedEmails.splice(index, 1);
      return {
        ...prevClientData,
        email: updatedEmails,
      };
    });
  };

  const saveChanges = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://sigesback-production.up.railway.app/clients`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(clientData), // Envía el estado completo en el cuerpo de la solicitud.
        }
      );

      if (response.ok) {
        // La solicitud se completó con éxito, puedes manejar la respuesta aquí.
        console.log('Cambios guardados con éxito');
        // Vaciar los estados locales
        setClientData({
          id: '',
          email: [],
          info: '',
          vip: '',
          vipmail: '',
          testing: false,
          botusers: [],
        });
        // Redireccionar a /admin/clients
        history.push('/admin/clients');
      } else {
        console.error('Error al guardar los cambios:', response.statusText);
      }
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  return (
    <div>
      <Button onClick={() => history.push('/admin/clients')} variant="contained" color="primary">
        Volver
      </Button>
      {clientData ? (
        <form>
          <div style={clientFieldStyle} >
            <TextField label="ID" value={clientData.id} disabled />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div>
              {clientData.email.map((email, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <TextField
                    label="Correo"
                    value={email}
                    onChange={(e) => {
                      const updatedEmails = [...clientData.email];
                      updatedEmails[index] = e.target.value;
                      handleFieldChange('email', updatedEmails);
                    }}
                  />
                  {clientData.email.length > 1 && (
                    <Button onClick={() => removeEmailField(index)} variant="outlined" color="secondary">
                      Eliminar
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div>
              <Button onClick={addEmailField}>Agregar otro correo</Button>
            </div>
          </div>
          <div style={clientFieldStyle}>
            <TextField label="Info" value={clientData.info} onChange={(e) => handleFieldChange('info', e.target.value)} />
          </div>
          <div style={clientFieldStyle}>
            <TextField label="VIP" value={clientData.vip} onChange={(e) => handleFieldChange('vip', e.target.value)} />
          </div>
          <div style={clientFieldStyle}>
            <TextField label="VIP Mail" value={clientData.vipmail} onChange={(e) => handleFieldChange('vipmail', e.target.value)} />
          </div>
          <div style={clientFieldStyle}>
            <label>Testing</label>
            <Select value={clientData.testing ? 'true' : 'false'} onChange={(e) => handleFieldChange('testing', e.target.value === 'true')}>
              <MenuItem value="false">False</MenuItem>
              <MenuItem value="true">True</MenuItem>
            </Select>
          </div>
          <h2>Bot Users</h2>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Create User</TableCell>
                  <TableCell>Can SOS</TableCell>
                  <TableCell>Admin PDF</TableCell>
                  <TableCell>Manager</TableCell>
                  <TableCell>Area</TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientData.botusers.map((botuser, index) => (
                  <TableRow key={index}>
                    <TableCell>{botuser.name}</TableCell>
                    <TableCell>{botuser.phone}</TableCell>
                    <TableCell>{botuser.createUser ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{botuser.canSOS ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{botuser.adminPdf ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{botuser.manager ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{botuser.area}</TableCell>
                    <TableCell>{botuser.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button onClick={(e) => saveChanges(e)} variant="contained" color="primary">
            Guardar cambios
          </Button>
        </form>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
}
