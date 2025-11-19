import React from "react";
import { useEditor } from "../context/EditorContext.jsx";

const RightSidebar = () => {
  const { currentPage, viewMode } = useEditor();

  return (
    <aside className="sidebar right-sidebar">
      <div className="sidebar-header">
        <h2>Propiedades</h2>
        <span className="page-pill">
          {currentPage} · {viewMode === "desktop" ? "Escritorio" : "Móvil"}
        </span>
      </div>

      <div className="sidebar-section">
        <h3>Layout</h3>
        <div className="form-group">
          <label>Ancho máximo</label>
          <input className="input" defaultValue="960px" />
        </div>
        <div className="form-group">
          <label>Padding vertical</label>
          <input className="input" defaultValue="80px" />
        </div>
        <div className="form-group">
          <label>Esquinas</label>
          <input className="input" defaultValue="16px" />
        </div>
      </div>

      <div className="sidebar-section">
        <h3>Tipografía</h3>
        <div className="form-group">
          <label>Fuente</label>
          <input className="input" defaultValue="System UI / Inter" />
        </div>
        <div className="form-group">
          <label>Tamaño título</label>
          <input className="input" defaultValue="36px" />
        </div>
        <div className="form-group">
          <label>Color texto</label>
          <input className="input" defaultValue="#E2E8F0" />
        </div>
      </div>

      <div className="sidebar-section">
        <h3>Acciones rápidas</h3>
        <button className="btn-ghost full-width">Duplicar sección</button>
        <button className="btn-ghost full-width">Guardar como plantilla</button>
      </div>
    </aside>
  );
};

export default RightSidebar;
