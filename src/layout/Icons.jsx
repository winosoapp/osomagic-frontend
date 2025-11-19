import React from "react";

const baseProps = {
  width: 16,
  height: 16,
  strokeWidth: 1.6,
  stroke: "#475569",
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const ChevronDownIcon = () => (
  <svg {...baseProps} viewBox="0 0 24 24">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const PlayIcon = () => (
  <svg {...baseProps} viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const CloudIcon = () => (
  <svg {...baseProps} viewBox="0 0 24 24">
    <path d="M7 18a4 4 0 010-8 5 5 0 019.6-1.5A4 4 0 1117 18H7z" />
  </svg>
);

export const CodeIcon = () => (
  <svg {...baseProps} viewBox="0 0 24 24">
    <path d="M9 18L5 12l4-6M15 6l4 6-4 6" />
  </svg>
);

export const ChartIcon = () => (
  <svg {...baseProps} viewBox="0 0 24 24">
    <path d="M4 19h16" />
    <path d="M8 17V9" />
    <path d="M12 17V5" />
    <path d="M16 17v-7" />
  </svg>
);

export const DesktopIcon = () => (
  <svg {...baseProps} viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="13" rx="2" />
    <path d="M9 21h6M12 17v4" />
  </svg>
);

export const MobileIcon = () => (
  <svg {...baseProps} viewBox="0 0 24 24">
    <rect x="8" y="3" width="8" height="18" rx="2" />
    <path d="M12 18h.01" />
  </svg>
);

export const ShareIcon = () => (
  <svg {...baseProps} viewBox="0 0 24 24">
    <path d="M18 8a3 3 0 10-3-3 3 3 0 003 3zM6 14a3 3 0 10-3-3 3 3 0 003 3zM18 22a3 3 0 10-3-3 3 3 0 003 3z" />
    <path d="M8.6 12.8l6.8-3.6M8.6 13.2l6.8 3.6" />
  </svg>
);

export const PublishIcon = () => (
  <svg {...baseProps} viewBox="0 0 24 24">
    <path d="M12 3v14" />
    <path d="M7 8l5-5 5 5" />
    <path d="M5 19h14" />
  </svg>
);

export const SendIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ffffff"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9" />
  </svg>
);
/* ============================================================
   ICONOS MODERNOS PARA SELECTOR DE PÁGINAS (Estilo Lovable)
============================================================ */

export const HomeModernIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 10L12 3L21 10V20C21 20.55 20.55 21 20 21H4C3.45 21 3 20.55 3 20V10Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DashboardModernIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 3H10V10H3V3ZM14 3H21V14H14V3ZM3 14H10V21H3V14ZM14 17H21V21H14V17Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PricingModernIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 1L21 6V17L12 22L3 17V6L12 1Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 8V12"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx="12" cy="16" r="1.3" fill="currentColor" />
  </svg>
);
