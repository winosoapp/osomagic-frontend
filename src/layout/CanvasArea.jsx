// src/layout/CanvasArea.jsx
import React from "react";
import { useEditor } from "../context/EditorContext.jsx";
import { renderNode } from "../context/Renderer.jsx";

/*
  CanvasArea PRO
  -----------------------
  - Nunca se desborda
  - Siempre hace scroll
  - Respeta modo móvil/escritorio
  - Centrado igual que Lovable
*/

const CanvasArea = () => {
  const { viewMode, layoutTree } = useEditor();
  const isMobile = viewMode === "mobile";

  return (
    <main className="os-canvas">
      <div className="os-canvas-inner">
        <div
          className={
            "os-canvas-surface " +
            (isMobile ? "os-canvas-mobile" : "os-canvas-desktop")
          }
          style={{
            overflowY: "auto", // evita desbordamiento
            overflowX: "hidden",
          }}
        >
          {layoutTree && layoutTree.children?.length > 0
            ? renderNode(layoutTree)
            : null}
        </div>
      </div>
    </main>
  );
};

export default CanvasArea;
