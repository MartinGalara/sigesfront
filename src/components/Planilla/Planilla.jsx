import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';
import Papa from 'papaparse';

import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import axios from 'axios';

export default function Planilla() {
  const [csvFile, setCsvFile] = useState(null);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: function(results) {
          const data = results.data;
          const completeData = validate(data);
          setCsvFile(completeData);
          setIsSubmitButtonDisabled(false); // Habilita el botón
        },
        header: false,
        skipEmptyLines: true,
      });
    }
  };

  const handleEnviarPlanilla = async () => {

    const config = {
        method: 'post',
        url: 'http://tvserver-production.up.railway.app/devices',
        data: csvFile
 
      }
    
      await axios(config)

      setCsvFile(null);
      setIsSubmitButtonDisabled(true);
      setSuccessMessage('Datos cargados exitosamente');
      setIsSnackbarOpen(true);
  };

  const validate = (data) => {

    let razonSocial = data[0][2]
    let bandera = data[1][2]
    let identificador = data[2][2]
    let ciudad = data[3][2]
    let clientId = generarClientId(bandera,identificador)

    const devices = []
    const botusers = []

    for (let i = 7; i < data.length; i++) {
        if(data[i][1] !== "" && data[i][2] !== "" && data[i][3] !== ""){
            const device = {
                alias: data[i][1],
                teamviewer_id: data[i][2],
                clientId,
                bandera,
                identificador,
                razonSocial,
                ciudad,
                area: data[i][3],
                prefijo: "**",
                extras: "**",
                tvalias:""
              };
            let tvalias = generarTvAlias(device)
            device.tvalias = tvalias
            devices.push(device)
        }
    }

    for (let i = 9; i < data.length; i++) {
        if(data[i][4] !== "" && data[i][6] !== "" ){
            
            const botuser = {
                name: data[i][4],
                phone: "549" + data[i][6],
                createUser: getBoolean(data[i][7]),
                canSOS: getBoolean(data[i][8]),
                adminPdf: getBoolean(data[i][9]),
                manager: getBoolean(data[i][10]),
                area: data[i][11] !== "" ? data[i][11] : null,
                email: data[i][12],
                clientId: clientId,
                createdBy: "Planilla"
              };
            botusers.push(botuser)
        }

    }

    const client = {
        id: clientId,
        email: [data[4][2]],
        info: razonSocial
    }

    const completeData = {
        devices,
        botusers,
        client
    }

    return completeData

  }

  const getBoolean = (string) => {

    if(string === "TRUE") return true
    else return false

  }

  const generarTvAlias = (device) => {
    // Obtener los primeros 3 caracteres de bandera (si existen)
    const banderaShort = device.bandera.length > 3 ? device.bandera.substring(0, 3) : device.bandera;
  
    let tvalias = `${device.razonSocial}|${banderaShort}|${device.identificador}|${device.ciudad}|${device.area}|${device.prefijo}|${device.extras}`;
    return tvalias;
  };
  

  const generarClientId = (bandera,identificador) => {

    let abrev = ""

    switch (bandera.toUpperCase()) {
        case "YPF": 
            abrev = "YP"
            return abrev + identificador
        case "SHELL": 
            abrev = "SH"
            return abrev + identificador
        case "AXION": 
            abrev = "AX"
            return abrev + identificador
        case "PUMA": 
            abrev = "PU"
            return abrev + identificador
        case "GULF": 
            abrev = "GU"
            return abrev + identificador
        case "REFINOR": 
            abrev = "RE"
            return abrev + identificador 
        case "BLANCA": 
            abrev = "BL"
            return abrev + identificador 
        case "OTRO": 
            abrev = "OT"
            return abrev + identificador 
       
        default:
            return false
       }

  }

  const handleActualizarDB = async () => {
    // Realiza una solicitud al endpoint de actualización de la base de datos
    try {
      await axios.get('http://tvserver-production.up.railway.app/devices');

      setUpdateMessage('Base de datos actualizada');
      setIsSnackbarOpen(true);
    } catch (error) {
      console.error('Error al actualizar la base de datos:', error);
      // Maneja los errores de actualización de la base de datos según sea necesario
    }
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  return (
    <div>
      <Button component={Link} to="/admin" variant="contained" color="primary">
        Volver
      </Button>
      <input
        accept=".csv"
        type="file"
        id="file-upload"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <label htmlFor="file-upload">
        <Button
          variant="contained"
          color="primary"
          component="span"
          startIcon={<CloudUploadIcon />}
        >
          Cargar Planilla
        </Button>
      </label>
      <Button
            variant="contained"
            color="primary"
            onClick={handleEnviarPlanilla}
            disabled={isSubmitButtonDisabled}
          >
            Enviar Planilla
        </Button>
        <Button
        variant="contained"
        color="primary"
        onClick={handleActualizarDB}
      >
        Actualizar DB
      </Button>

      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={successMessage ? 'success' : 'info'}
        >
          {successMessage ? (
            <AlertTitle>Éxito</AlertTitle>
          ) : (
            <AlertTitle>Información</AlertTitle>
          )}
          {successMessage || updateMessage}
        </Alert>
      </Snackbar>

      {csvFile && (
        <div>
          {/* Renderiza la información del cliente, dispositivos y botusers aquí */}
          <h2>Datos del Cliente</h2>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Email:</TableCell>
                  <TableCell>{csvFile.client.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>ID:</TableCell>
                  <TableCell>{csvFile.client.id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Info:</TableCell>
                  <TableCell>{csvFile.client.info}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <h2>Dispositivos</h2>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Alias</TableCell>
                  <TableCell>TeamViewer ID</TableCell>
                  <TableCell>Client ID</TableCell>
                  <TableCell>Razón Social</TableCell>
                  <TableCell>Bandera</TableCell>
                  <TableCell>Identificador</TableCell>
                  <TableCell>Ciudad</TableCell>
                  <TableCell>Area</TableCell>
                  <TableCell>Prefijo</TableCell>
                  <TableCell>Extras</TableCell>
                  <TableCell>TvAlias</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {csvFile.devices.map((device, index) => (
                  <TableRow key={index}>
                    <TableCell>{device.alias}</TableCell>
                    <TableCell>{device.teamviewer_id}</TableCell>
                    <TableCell>{device.clientId}</TableCell>
                    <TableCell>{device.razonSocial}</TableCell>
                    <TableCell>{device.bandera}</TableCell>
                    <TableCell>{device.identificador}</TableCell>
                    <TableCell>{device.ciudad}</TableCell>
                    <TableCell>{device.area}</TableCell>
                    <TableCell>{device.prefijo}</TableCell>
                    <TableCell>{device.extras}</TableCell>
                    <TableCell>{device.tvalias}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

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
                {csvFile.botusers.map((botuser, index) => (
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
        
        </div>
      )}
    </div>
  );
}