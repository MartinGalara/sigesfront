import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  useEffect(() => {
    window.location.href = "/media/Aviso de Privacidad.docx";
    // Redirige al home después de 2 segundos (ajusta el tiempo si lo deseas)
    const timeout = setTimeout(() => {
      navigate("/");
    }, 1000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return null;
}
