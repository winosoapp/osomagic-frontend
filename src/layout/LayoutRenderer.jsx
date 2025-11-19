// LayoutRenderer.jsx
import React from "react";
import TopNav from "./TopNav.jsx";
import LeftSidebar from "./LeftSidebar.jsx";
import CanvasArea from "./CanvasArea.jsx";
import BottomChatPanel from "./BottomChatPanel.jsx";

/* ============================================================================
   🧱 LAYOUT PRINCIPAL DEL EDITOR — Fase 2 Final
   - Estructura tipo Lovable
   - Sidebar izquierda (chat)
   - Canvas centrado
   - Topbar completo
   - Chat inferior
   - Preparado para Fase 3 (IA) y Fase 4 (selección por clic)
============================================================================ */

const LayoutRenderer = () => {
  return (
    <div className="os-shell">

      {/* 🔶 TOP NAV */}
      <TopNav />

      {/* 🔶 ZONA CENTRAL */}
      <div className="os-main">

        {/* 🔸 Sidebar izquierda */}
        <LeftSidebar />

        {/* 🔸 Canvas principal */}
        <CanvasArea />
      </div>

      {/* 🔶 CHAT INFERIOR */}
      <BottomChatPanel />
    </div>
  );
};

export default LayoutRenderer;
