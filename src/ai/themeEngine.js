// ==========================================================
// OSOMAGIC 2.0 — FASE 5.5 (Theme Engine Pro)
// Cambios globales de estilo: Modern, Minimal, Professional,
// Apple, Dark, Colorful
// ==========================================================

// ----------------------------------------------
// 1. Definir presets
// ----------------------------------------------
const presets = {
  modern: {
    primary: "#6C5CE7",
    secondary: "#A29BFE",
    background: "#FFFFFF",
    text: "#2D3436",
    radius: "12px",
    shadow: "0px 6px 20px rgba(0,0,0,0.06)",
    spacing: 32,
    font: "Inter, sans-serif"
  },

  minimal: {
    primary: "#000000",
    secondary: "#555555",
    background: "#FFFFFF",
    text: "#222222",
    radius: "4px",
    shadow: "none",
    spacing: 24,
    font: "Helvetica, sans-serif"
  },

  professional: {
    primary: "#0052CC",
    secondary: "#4C9AFF",
    background: "#F4F5F7",
    text: "#172B4D",
    radius: "6px",
    shadow: "0px 4px 16px rgba(0,0,0,0.08)",
    spacing: 28,
    font: "Segoe UI, sans-serif"
  },

  apple: {
    primary: "#0071E3",
    secondary: "#5AC8FA",
    background: "#FFFFFF",
    text: "#1C1C1E",
    radius: "16px",
    shadow: "0px 12px 30px rgba(0,0,0,0.08)",
    spacing: 36,
    font: "-apple-system, BlinkMacSystemFont, sans-serif"
  },

  dark: {
    primary: "#0A84FF",
    secondary: "#5E5CE6",
    background: "#1C1C1E",
    text: "#FFFFFF",
    radius: "10px",
    shadow: "0px 8px 24px rgba(0,0,0,0.4)",
    spacing: 30,
    font: "Inter, sans-serif"
  },

  colorful: {
    primary: "#FF6B6B",
    secondary: "#FFD93D",
    background: "#FFFFFF",
    text: "#333333",
    radius: "14px",
    shadow: "0px 8px 24px rgba(0,0,0,0.08)",
    spacing: 34,
    font: "Poppins, sans-serif"
  }
};

// ----------------------------------------------
// 2. Aplicar preset global al layout
// ----------------------------------------------
export function applyThemePreset(layout, presetName) {
  const preset = presets[presetName];
  if (!preset) return layout;

  return layout.map((el) => ({
    ...el,
    props: {
      ...el.props,
      style: {
        ...(el.props?.style || {}),
        color: preset.text,
        backgroundColor: preset.background,
        borderRadius: preset.radius,
        boxShadow: preset.shadow,
        fontFamily: preset.font,
        marginTop: preset.spacing
      }
    }
  }));
}

// ----------------------------------------------
// 3. Detectar preset según semántica
// ----------------------------------------------
export function detectThemeIntent(semantic) {
  if (!semantic) return null;

  const text = JSON.stringify(semantic).toLowerCase();

  if (text.includes("modern")) return "modern";
  if (text.includes("minimal")) return "minimal";
  if (text.includes("apple")) return "apple";
  if (text.includes("professional")) return "professional";
  if (text.includes("dark")) return "dark";
  if (text.includes("color")) return "colorful";
  if (text.includes("colores")) return "colorful";

  return null;
}
