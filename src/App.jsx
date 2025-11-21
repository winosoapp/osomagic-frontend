import React, { useEffect } from "react";
import { EditorProvider } from "./context/EditorContext";
import { ensureDemoUser } from "./supabase/client";

// Estilos globales + layout
import "./index.css";
import "./layout/layout.css";

// Layout principal del editor (Topbar + sidebars + canvas + chat)
import LayoutRenderer from "./layout/LayoutRenderer";

function App() {
  useEffect(() => {
    ensureDemoUser().then((user) => {
      if (user) {
        console.log("Usuario DEMO autenticado:", user.email);
      } else {
        console.warn("No se pudo autenticar al demo user.");
      }
    });
  }, []);

  return (
    <EditorProvider>
      <div className="app-root">
        <LayoutRenderer />
      </div>
    </EditorProvider>
  );
}

export default App;
