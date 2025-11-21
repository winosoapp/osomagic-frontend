// ==========================================================
// OSOMAGIC 2.0 — FASE 4.1 (VERSION JAVASCRIPT PURO)
// SISTEMA DE REGLAS SEMÁNTICAS AVANZADAS
// ==========================================================

export const actionRules = [
  { keywords: ["añade", "agrega", "crea", "pon", "inserta"], action: "ADD" },
  { keywords: ["borra", "elimina", "quita", "suprime"], action: "DELETE" },
  { keywords: ["mueve", "coloca", "desplaza", "sube", "baja"], action: "MOVE" },
  { keywords: ["cambia", "modifica", "actualiza", "ajusta"], action: "UPDATE" },
  { keywords: ["duplica", "copia"], action: "DUPLICATE" },
  { keywords: ["limpia", "optimiza"], action: "CLEAN" },
];

export const componentRules = [
  { keywords: ["botón", "button", "cta", "call to action"], component: "button" },
  { keywords: ["título", "headline", "heading"], component: "heading" },
  { keywords: ["texto", "párrafo", "paragraph"], component: "text" },
  { keywords: ["imagen", "foto", "image"], component: "image" },
  { keywords: ["input", "campo", "text field"], component: "input" },
  { keywords: ["formulario", "form"], component: "form" },
  { keywords: ["sección", "bloque", "section"], component: "section" },
  { keywords: ["card", "tarjeta"], component: "card" },
];

export const propertyRules = [
  { keywords: ["azul", "blue", "celeste"], prop: { color: "#007bff" } },
  { keywords: ["rojo", "red"], prop: { color: "#ff0000" } },
  { keywords: ["verde", "green"], prop: { color: "#00cc66" } },
  { keywords: ["negro", "black"], prop: { color: "#000000" } },
  { keywords: ["blanco", "white"], prop: { color: "#ffffff" } },
  { keywords: ["gris", "gray"], prop: { color: "#6c757d" } },

  { keywords: ["grande", "gigante", "large"], prop: { size: "large" } },
  { keywords: ["mediano", "medium"], prop: { size: "medium" } },
  { keywords: ["pequeño", "small"], prop: { size: "small" } },

  { keywords: ["arriba", "top"], prop: { position: "top" } },
  { keywords: ["abajo", "bottom"], prop: { position: "bottom" } },
  { keywords: ["izquierda", "left"], prop: { position: "left" } },
  { keywords: ["derecha", "right"], prop: { position: "right" } },
  { keywords: ["centro", "centrado"], prop: { align: "center" } },

  { keywords: ["redondo", "radius", "curvo"], prop: { borderRadius: "12px" } },
  { keywords: ["moderno"], prop: { stylePreset: "modern" } },
  { keywords: ["minimalista", "minimal"], prop: { stylePreset: "minimal" } },
  { keywords: ["apple", "tipo apple", "estilo apple"], prop: { stylePreset: "apple" } },
  { keywords: ["profesional"], prop: { stylePreset: "professional" } },

  { keywords: ["más espacio", "espaciado", "spacing"], prop: { spacing: "increase" } },
  { keywords: ["menos espacio"], prop: { spacing: "decrease" } },
];

export const semanticRules = [
  { keywords: ["hazlo más moderno", "moderno"], effect: { themeAction: "modernize" } },
  { keywords: ["hazlo más profesional", "pro"], effect: { themeAction: "professionalize" } },
  { keywords: ["quita ruido", "limpia", "simplifica"], effect: { themeAction: "clean" } },
  { keywords: ["estilo apple", "apple"], effect: { themeAction: "appleStyle" } },
  { keywords: ["usa más color", "más color"], effect: { themeAction: "colorize" } },
];

export function analyzePromptRules(prompt) {
  const text = prompt.toLowerCase();

  let detectedAction = "UNKNOWN";
  for (const rule of actionRules) {
    if (rule.keywords.some((k) => text.includes(k))) {
      detectedAction = rule.action;
      break;
    }
  }

  let detectedComponent = "unknown";
  for (const rule of componentRules) {
    if (rule.keywords.some((k) => text.includes(k))) {
      detectedComponent = rule.component;
      break;
    }
  }

  let detectedProps = {};
  for (const rule of propertyRules) {
    if (rule.keywords.some((k) => text.includes(k))) {
      detectedProps = { ...detectedProps, ...rule.prop };
    }
  }

  let semanticEffects = {};
  for (const rule of semanticRules) {
    if (rule.keywords.some((k) => text.includes(k))) {
      semanticEffects = { ...semanticEffects, ...rule.effect };
    }
  }

  return {
    action: detectedAction,
    component: detectedComponent,
    props: detectedProps,
    semantic: semanticEffects,
  };
}
