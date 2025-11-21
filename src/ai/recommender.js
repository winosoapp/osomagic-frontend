// ==========================================================
// OSOMAGIC 2.0 — FASE 5.6 (UI Recommender Pro)
// Motor de sugerencias UI avanzado estilo LOVABLE
// ==========================================================

/**
 * Analiza el layout y genera sugerencias iniciales antes de IA.
 */
export function analyzeLayoutForRecommendations(layout) {
  const suggestions = [];

  // 1. Hero ausente
  const hasHero =
    layout.some((el) => el.type === "hero" || el.props?.isHero);

  if (!hasHero) {
    suggestions.push("Falta una sección Héroe. Sugiero añadir un hero al inicio.");
  }

  // 2. CTA insuficiente
  const buttons = layout.filter((el) => el.type === "button");
  if (buttons.length < 1) {
    suggestions.push("No encuentro CTAs. Añadir un botón principal mejoraría conversión.");
  }

  // 3. Demasiados botones
  if (buttons.length > 3) {
    suggestions.push("Hay demasiados botones. Sugiero simplificar los CTAs.");
  }

  // 4. Formularios sin contexto
  const forms = layout.filter((el) => el.type === "form");
  if (forms.length > 0 && !layout.some((e) => e.type === "heading")) {
    suggestions.push("Un formulario sin título puede confundir. Añadir un heading.");
  }

  // 5. Texto insuficiente
  const textBlocks = layout.filter((el) => el.type === "text");
  if (textBlocks.length < 1) {
    suggestions.push("No detecto secciones de texto. Añade contenido descriptivo.");
  }

  // 6. Demasiado vacío
  if (layout.length < 3) {
    suggestions.push("El layout está muy vacío. Sugiero añadir más contenido.");
  }

  // 7. Densidad excesiva
  if (layout.length > 12) {
    suggestions.push("Demasiados elementos en la página. Sugiero simplificar.");
  }

  // 8. Falta contraste si tema claro
  const bg = layout[0]?.props?.style?.backgroundColor;
  if (bg === "#FFFFFF") {
    suggestions.push("El fondo blanco requiere buen contraste. Revisa colores de texto.");
  }

  return suggestions;
}
