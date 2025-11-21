// ============================================================================
// OSOMAGIC 2.0 — LayoutRenderer.jsx (VERSIÓN FINAL, usando TopNav PRO)
// ============================================================================

import React from "react";
import TopNav from "./TopNav.jsx";             // <-- AQUÍ TU TOPNAV REAL
import LeftSidebar from "./LeftSidebar.jsx";
import CanvasArea from "./CanvasArea.jsx";
import BottomChatPanel from "./BottomChatPanel.jsx";

export default function LayoutRenderer() {
  return (
    <div className="os-shell">

      {/* ================= TOPBAR (Tu versión PRO) ================= */}
      <TopNav />

      {/* ================= MAIN (Sidebar + Canvas) ================= */}
      <div className="os-main">

        {/* SIDEBAR IZQUIERDA */}
        <LeftSidebar />

        {/* CANVAS */}
        <div className="os-canvas">
          <div className="os-canvas-inner">
            <div className="os-canvas-surface os-canvas-desktop">
              <CanvasArea />
            </div>
          </div>
        </div>

      </div>

      {/* ================= PROMPT BOTTOM ================= */}
      <BottomChatPanel />
    </div>
  );
}
