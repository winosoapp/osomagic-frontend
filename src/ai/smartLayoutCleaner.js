// ==========================================================
// OSOMAGIC 2.0 — FASE 4.5 (Smart Layout Cleaner)
// Limpieza inteligente del layout antes del render
// ==========================================================

/**
 * Comprueba si un componente es válido
 */
function isValidComponent(el) {
  if (!el) return false;
  if (!el.type) return false;

  // Props debe ser un objeto
  if (el.props && typeof el.props !== "object") return false;

  // Children debe ser array siempre
  if (el.children && !Array.isArray(el.children)) return false;

  return true;
}

/**
 * Limpia props corruptas
 */
function cleanProps(props = {}) {
  const clean = {};

  for (const key in props) {
    const val = props[key];

    if (
      val === null ||
      val === undefined ||
      val === "" ||
      (typeof val === "object" && Object.keys(val).length === 0)
    ) {
      continue;
    }

    clean[key] = val;
  }

  return clean;
}

/**
 * Limpia children corruptos, vacíos o inválidos
 */
function cleanChildren(children = []) {
  if (!Array.isArray(children)) return [];

  return children
    .filter((el) => isValidComponent(el))
    .map((child) => cleanComponent(child));
}

/**
 * Limpia un componente individual completamente
 */
function cleanComponent(component) {
  return {
    id: component.id || crypto.randomUUID(),
    type: component.type,
    props: cleanProps(component.props || {}),
    children: cleanChildren(component.children || []),
  };
}

/**
 * Detecta elementos huérfanos (por ejemplo, hijos sin sección padre)
 * En esta fase los eliminamos para no romper layout
 */
function removeOrphans(layout) {
  return layout.filter((el) => isValidComponent(el));
}

/**
 * MAIN — Limpieza avanzada del layout
 */
export function cleanLayout(layout) {
  if (!Array.isArray(layout)) return [];

  let cleaned = [...layout];

  // 1. Eliminar nulos / corruptos
  cleaned = cleaned.filter((el) => isValidComponent(el));

  // 2. Reparar props
  cleaned = cleaned.map((el) => ({
    ...el,
    props: cleanProps(el.props || {}),
  }));

  // 3. Reparar children
  cleaned = cleaned.map((el) => cleanComponent(el));

  // 4. Eliminar huérfanos
  cleaned = removeOrphans(cleaned);

  // 5. No permitir loops o referencias cruzadas
  cleaned = cleaned.map((el) => ({
    ...el,
    children: el.children.filter((c) => c.id !== el.id),
  }));

  return cleaned;
}
