// ==========================================================
// OSOMAGIC 2.0 — FASE 4.3 (VERSIÓN JAVASCRIPT PURO)
// CONTEXT ENGINE (Lectura profunda del layout)
// ==========================================================

export function analyzeLayout(layout) {
  const sections = [];
  const headings = [];
  const texts = [];
  const buttons = [];
  const inputs = [];
  const images = [];
  const cards = [];
  const forms = [];

  layout.forEach((el, index) => {
    const obj = { ...el, index };

    switch (el.type) {
      case "section":
        sections.push(obj);
        break;

      case "heading":
        headings.push(obj);
        break;

      case "text":
        texts.push(obj);
        break;

      case "button":
        buttons.push(obj);
        break;

      case "input":
        inputs.push(obj);
        break;

      case "image":
        images.push(obj);
        break;

      case "card":
        cards.push(obj);
        break;

      case "form":
        forms.push(obj);
        break;
    }
  });

  return {
    total: layout.length,
    tree: layout,
    sections,
    headings,
    texts,
    buttons,
    inputs,
    images,
    cards,
    forms,
    first: layout[0] || null,
    last: layout[layout.length - 1] || null,
  };
}

export function resolveIndexedTarget(prompt, ctx) {
  const text = prompt.toLowerCase();

  const indexMap = {
    primero: 0,
    primera: 0,
    segundo: 1,
    segunda: 1,
    tercero: 2,
    tercera: 2,
    cuarto: 3,
    quinta: 4,
  };

  for (const key in indexMap) {
    if (text.includes(key)) {
      const index = indexMap[key];

      if (text.includes("botón") || text.includes("button") || text.includes("cta"))
        return ctx.buttons[index] || null;

      if (text.includes("título") || text.includes("heading") || text.includes("headline"))
        return ctx.headings[index] || null;

      if (text.includes("sección") || text.includes("section") || text.includes("bloque"))
        return ctx.sections[index] || null;

      if (text.includes("texto") || text.includes("párrafo"))
        return ctx.texts[index] || null;

      if (text.includes("imagen") || text.includes("foto"))
        return ctx.images[index] || null;
    }
  }

  return null;
}

export function resolveTargetComponent(prompt, semanticOutput, ctx) {
  const text = prompt.toLowerCase();

  if (semanticOutput.intent === "THEME_UPDATE" || semanticOutput.intent === "GLOBAL_CLEANUP") {
    return { type: "GLOBAL", id: null };
  }

  const indexed = resolveIndexedTarget(prompt, ctx);
  if (indexed) {
    return { type: indexed.type, id: indexed.id, index: indexed.index };
  }

  if (semanticOutput.targetComponent !== "unknown") {
    const list = ctx[semanticOutput.targetComponent + "s"];
    if (list && list.length > 0) {
      return { type: list[0].type, id: list[0].id, index: list[0].index };
    }
  }

  if (ctx.last) {
    return { type: ctx.last.type, id: ctx.last.id, index: ctx.last.index };
  }

  return { type: semanticOutput.targetComponent || "unknown", id: null };
}
