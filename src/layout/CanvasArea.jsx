// ============================================================================
// OSOMAGIC 2.0 — CanvasArea.jsx (VERSIÓN CORRECTA Y FINAL)
// ============================================================================

import React from "react";
import CanvasFrame from "./CanvasFrame.jsx";
import { useEditor } from "../context/EditorContext.jsx";

export default function CanvasArea() {

  const { layoutTree, viewMode } = useEditor();

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <CanvasFrame 
        layout={layoutTree}
        deviceMode={viewMode}
      />
    </div>
  );
}
