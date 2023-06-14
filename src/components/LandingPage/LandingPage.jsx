import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import LoginForm from "../LoginForm/LoginForm";
import Cookies from "js-cookie";
import { loginWithToken, logOut } from "../../redux/actions";
import Button from "@mui/material/Button";

export default function LandingPage() {
  const token = useSelector((state) => state.token);
  const role = useSelector((state) => state.userRole);

  console.log(role);

  const dispatch = useDispatch();

  const handleLogout = () => {
    // Eliminar el token de las cookies
    Cookies.remove("token");
    // Limpiar los estados globales
    dispatch(logOut());
  };

  if (token) {
    Cookies.set("token", token, { expires: 7 });
  }

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      // Realiza una solicitud al backend para el inicio de sesión automático
      dispatch(loginWithToken(token));
    }
  }, [dispatch]);

  const redirectToURL = (url) => {
    window.location.href = url;
  };

  return (
    <div>
      <h1>Sistema SIGES - Pagina Oficial</h1>
      {token ? (
        // El usuario tiene un token válido
        <div>
          <h2>Bienvenido, usuario</h2>
          {/* Renderizar contenido adicional basado en el rol o estado activo */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => redirectToURL("/recomendaciones")}
          >
            Recomendaciones SIGES
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => redirectToURL("/soporte")}
          >
            Soporte
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => redirectToURL("/manuales")}
          >
            Manuales / Capacitaciones
          </Button>
          {role === "SuperAdmin" && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => redirectToURL("/admin")}
            >
              Dashboard Admin
            </Button>
          )}
          {role === "Operador" && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => redirectToURL("/operador")}
            >
              Dashboard Operador
            </Button>
          )}
          {role === "Editor" && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => redirectToURL("/editor")}
            >
              Dashboard Editor
            </Button>
          )}
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
          >
            Cerrar sesión
          </Button>
        </div>
      ) : (
        // El usuario no tiene un token válido, mostrar el formulario de inicio de sesión
        <LoginForm />
      )}
    </div>
  );
}
