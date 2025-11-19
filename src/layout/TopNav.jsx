import React, { useState } from "react";
import { useEditor } from "../context/EditorContext.jsx";

import {
  ChevronDownIcon,
  PlayIcon,
  CloudIcon,
  CodeIcon,
  ChartIcon,
  DesktopIcon,
  MobileIcon,
  ShareIcon,
  PublishIcon,
  HomeModernIcon,
  DashboardModernIcon,
  PricingModernIcon,
} from "./Icons.jsx";

/* ============================================================
   ICONOS MODERNOS PARA MENÚ DEL PROYECTO
============================================================ */

const IconSettings = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="9" cy="9" r="7" />
    <path d="M9 5v4l2 2" strokeLinecap="round" />
  </svg>
);

const IconDashboard = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="3" width="5" height="5" rx="1.5" />
    <rect x="10" y="3" width="5" height="3" rx="1.5" />
    <rect x="3" y="10" width="3" height="5" rx="1.5" />
    <rect x="8" y="10" width="7" height="5" rx="1.5" />
  </svg>
);

const IconCredits = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="9" cy="9" r="7" />
    <path d="M5 9h8M9 5v8" strokeLinecap="round" />
  </svg>
);

const IconDuplicate = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="5" y="5" width="10" height="10" rx="2" />
    <rect x="3" y="3" width="10" height="10" rx="2" opacity="0.5" />
  </svg>
);

const IconRename = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M3 15h12M5 12l8-8 3 3-8 8H5v-3z" strokeLinecap="round" />
  </svg>
);

const IconAppearance = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="9" cy="9" r="7" />
    <path d="M9 2v14M2 9h14" strokeLinecap="round" />
  </svg>
);

const IconHelp = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="9" cy="9" r="7" />
    <path
      d="M7.5 7a1.5 1.5 0 013 0c0 1.5-1.5 1.5-1.5 3"
      strokeLinecap="round"
    />
    <circle cx="9" cy="12.5" r="0.8" fill="currentColor" />
  </svg>
);

/* ============================================================
   TOP NAV BAR — VERSIÓN FINAL PRO (Lovable Style)
============================================================ */

const TopNav = () => {
  const {
    currentProject,
    route,
    setRoute,
    viewMode,
    setViewMode,
    isPreviewActive,
    setIsPreviewActive,
  } = useEditor();

  const [openProjectMenu, setOpenProjectMenu] = useState(false);
  const [openPageMenu, setOpenPageMenu] = useState(false);

  const pages = [
    { id: "/", name: "Landing", icon: <HomeModernIcon /> },
    { id: "/dashboard", name: "Dashboard", icon: <DashboardModernIcon /> },
    { id: "/pricing", name: "Pricing", icon: <PricingModernIcon /> },
  ];

  const currentPage = pages.find((p) => p.id === route) || pages[0];

  return (
    <header className="os-topbar">

      {/* IZQUIERDA — LOGO + PROJECT MENU */}
      <div className="os-topbar-left">
        <div className="os-logo-mark" />

        <button
          className="os-project-button-modern"
          onClick={() => setOpenProjectMenu(v => !v)}
        >
          <span className="os-project-name-modern">{currentProject.name}</span>
          <ChevronDownIcon className={openProjectMenu ? "rotate" : ""} />
        </button>

        {/* MENÚ DEL PROYECTO MODERNO */}
        {openProjectMenu && (
          <div className="os-project-menu-modern">

            {/* Grupo 1 */}
            <div className="os-project-menu-group">
              <button className="os-project-menu-item-modern">
                <IconDashboard />
                <span>Dashboard del proyecto</span>
              </button>

              <button className="os-project-menu-item-modern">
                <IconCredits />
                <span>Créditos (2,8 left)</span>
              </button>
            </div>

            {/* Grupo 2 */}
            <div className="os-project-menu-group">
              <button className="os-project-menu-item-modern">
                <IconSettings />
                <span>Settings</span>
              </button>

              <button className="os-project-menu-item-modern">
                <IconDuplicate />
                <span>Duplicar proyecto</span>
              </button>

              <button className="os-project-menu-item-modern">
                <IconRename />
                <span>Renombrar</span>
              </button>

              <button className="os-project-menu-item-modern">
                <IconAppearance />
                <span>Apariencia</span>
              </button>
            </div>

            {/* Grupo 3 */}
            <div className="os-project-menu-group">
              <button className="os-project-menu-item-modern">
                <IconHelp />
                <span>Ayuda</span>
              </button>
            </div>

          </div>
        )}
      </div>

      {/* CENTRO — PREVIEW | SELECTOR | VIEW MODE */}
      <div className="os-topbar-center">
        <div className="os-topbar-controls">

          {/* PREVIEW */}
          <button
            className={
              "os-btn-modern-outline " +
              (isPreviewActive ? "os-btn-modern-active" : "")
            }
            onClick={() => setIsPreviewActive(v => !v)}
          >
            <PlayIcon />
            <span>Preview</span>
          </button>

          {/* ICON BUTTONS */}
          <button className="os-icon-btn-modern"><CloudIcon /></button>
          <button className="os-icon-btn-modern"><CodeIcon /></button>
          <button className="os-icon-btn-modern"><ChartIcon /></button>

          {/* SELECTOR DE PÁGINAS MODERNO */}
          <div className="os-page-selector-wrapper">
            <button
              className="os-page-selector-trigger-modern"
              onClick={() => setOpenPageMenu(v => !v)}
            >
              <div className="os-page-selector-label-modern">
                {currentPage.icon}
                <span>{currentPage.name}</span>
              </div>
              <ChevronDownIcon className={openPageMenu ? "rotate" : ""} />
            </button>

            {openPageMenu && (
              <div className="os-page-selector-menu-modern">
                {pages.map(p => (
                  <button
                    key={p.id}
                    className={
                      "os-page-selector-item-modern " +
                      (p.id === route ? "os-page-selector-item-modern-active" : "")
                    }
                    onClick={() => {
                      setRoute(p.id);
                      setOpenPageMenu(false);
                    }}
                  >
                    <span className="os-page-item-icon-modern">{p.icon}</span>
                    <span className="os-page-item-name-modern">{p.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* VISTA DESKTOP / MOBILE */}
          <div className="os-view-toggle-modern">
            <button
              className={
                "os-view-btn-modern " +
                (viewMode === "desktop" ? "os-view-btn-modern-active" : "")
              }
              onClick={() => setViewMode("desktop")}
            >
              <DesktopIcon />
            </button>

            <button
              className={
                "os-view-btn-modern " +
                (viewMode === "mobile" ? "os-view-btn-modern-active" : "")
              }
              onClick={() => setViewMode("mobile")}
            >
              <MobileIcon />
            </button>
          </div>

        </div>
      </div>

      {/* DERECHA — SHARE + PUBLISH */}
      <div className="os-topbar-right">
        <button className="os-btn-modern-soft">
          <ShareIcon />
          <span>Share</span>
        </button>

        <button className="os-btn-modern-primary">
          <PublishIcon />
          <span>Publish</span>
        </button>
      </div>

    </header>
  );
};

export default TopNav;
