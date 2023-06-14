import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import Box from "@mui/material/Box";

import EditorRecomendaciones from "./EditorRecomendaciones";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
}));

const OptionWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  marginRight: theme.spacing(2),
}));

const NovedadesComponent = () => {
  return <div>Componente de Novedades</div>;
};

const ManualesComponent = () => {
  return <div>Componente de Manuales</div>;
};

export default function EditorDashboard() {
  const [selectedOption, setSelectedOption] = useState("recomendaciones");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  let componentToRender;

  if (selectedOption === "recomendaciones") {
    componentToRender = <EditorRecomendaciones />;
  } else if (selectedOption === "novedades") {
    componentToRender = <NovedadesComponent />;
  } else if (selectedOption === "manuales") {
    componentToRender = <ManualesComponent />;
  }

  return (
    <div>
      <StyledAppBar position="static">
        <Toolbar>
          <OptionWrapper onClick={() => handleOptionClick("recomendaciones")}>
            <Typography variant="h6">Recomendaciones</Typography>
          </OptionWrapper>
          <OptionWrapper onClick={() => handleOptionClick("novedades")}>
            <Typography variant="h6">Novedades</Typography>
          </OptionWrapper>
          <OptionWrapper onClick={() => handleOptionClick("manuales")}>
            <Typography variant="h6">Manuales</Typography>
          </OptionWrapper>
          <Title variant="h6" component="div" align="right">
            Dashboard Editor
          </Title>
        </Toolbar>
      </StyledAppBar>

      {componentToRender}
    </div>
  );
}
