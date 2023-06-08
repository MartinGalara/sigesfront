import React from "react";
import { AppBar, Toolbar, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Soporte() {
  const phoneNumber = "3512275549"; // Número de teléfono para el chat de soporte

  const openWhatsAppChat = () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    let url;
    if (isMobile) {
      url = `https://api.whatsapp.com/send?phone=${phoneNumber}`;
    } else {
      url = `https://web.whatsapp.com/send?phone=${phoneNumber}`;
    }

    window.open(url, "_blank");
  };

  const openFreshdesk = () => {
    window.open("https://sistemasiges.freshdesk.com/support/home", "_blank");
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" onClick={openWhatsAppChat}>
            Generar Ticket de Soporte
          </Button>
          <Button color="inherit" component={Link} to="/blog">
            Blog
          </Button>
          <Button color="inherit" onClick={openFreshdesk}>
            Freshdesk
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
