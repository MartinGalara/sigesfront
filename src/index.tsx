import "./index.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { HeroUIProvider } from "@heroui/react";
import { App } from "./App";
import { AuthProvider } from "./contexts/AuthContext";

const container = document.getElementById("root");
if (!container) throw new Error("Could not find root element");

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <HeroUIProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HeroUIProvider>
  </React.StrictMode>
);
