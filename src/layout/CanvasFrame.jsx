// ============================================================================
// OSOMAGIC 2.0 — CanvasFrame.jsx (DESKTOP + MOBILE REAL)
// ============================================================================

import React from "react";
import Renderer from "./Renderer.jsx";

export default function CanvasFrame({ layout, deviceMode = "desktop" }) {
  const isMobile = deviceMode === "mobile";

  // 📱 vs 💻
  const outerPadding = isMobile ? 16 : 28;
  const canvasMaxWidth = isMobile ? 430 : 1220;      // ancho "móvil" vs desktop
  const canvasMinHeight = isMobile ? 780 : 780;      // puedes bajar en móvil si quieres

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#f3f4f6",           // gris MUY claro (fondo general)
        padding: `${outerPadding}px`,
        boxSizing: "border-box",
        overflow: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      {/* ===================== CANVAS BLANCO ====================== */}
      <div
        style={{
          width: "100%",
          maxWidth: `${canvasMaxWidth}px`,
          minHeight: `${canvasMinHeight}px`,
          background: "#ffffff",
          borderRadius: isMobile ? "26px" : "22px",
          padding: isMobile ? "20px" : "32px",
          boxShadow: "0 18px 45px rgba(15,23,42,0.08)",
          boxSizing: "border-box",
          overflow: "visible",
          border: "none",
          transition: "all 0.18s ease",   // animación suave al cambiar de modo
        }}
      >
        <Renderer layout={layout} />
      </div>
    </div>
  );
}
