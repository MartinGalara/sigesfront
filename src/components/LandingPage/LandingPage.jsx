import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import LoginForm from "../LoginForm/LoginForm";
import Cookies from "js-cookie";

export default function LandingPage() {
  const token = useSelector((state) => state.token);
  const active = useSelector((state) => state.userActive);
  const role = useSelector((state) => state.userRole);

  const dispatch = useDispatch();

  if(token) {
    Cookies.set("token", token, { expires: 7 });
  }

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      // Realiza una solicitud al backend para el inicio de sesión automático
      //dispatch(login({ token }));
      console.log("entre aca xq hay cookies")
    }
  }, [dispatch]);

  return (
    <div>
      <h1>Sistema SIGES - Pagina Oficial</h1>
      {token ? (
        // El usuario tiene un token válido
        <div>
          <h2>Bienvenido, usuario</h2>
          {/* Renderizar contenido adicional basado en el rol o estado activo */}
          {console.log(role)}
          {console.log(active)}
          {role === "Admin" && <p>¡Eres un administrador!</p>}
          {active && <p>Tu cuenta está activa</p>}
        </div>
      ) : (
        // El usuario no tiene un token válido, mostrar el formulario de inicio de sesión
        <LoginForm />
      )}
      
    </div>
  );
}