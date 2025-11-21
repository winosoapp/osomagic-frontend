// ==========================================================
// OSOMAGIC 2.0 — FASE 4.7 (Tree Optimizer)
// Optimizador del árbol de componentes (nivel Lovable)
// ==========================================================

/**
 * Fusiona headings consecutivos en uno solo con spacing correcto
 */
function mergeHeadings(layout) {
  const newLayout = [];
  let buffer = null;

  layout.forEach((el) => {
    if (el.type === "heading") {
      if (!buffer) buffer = el;
      else {
        // Fusiona contenido si vienen dos headings seguidos
        buffer.props.text =
          (buffer.props?.text || "") +
          " " +
          (el.props?.text || "");
      }
    } else {
      if (buffer) {
        newLayout.push(buffer);
        buffer = null;
      }
      newLayout.push(el);
    }
  });

  if (buffer) newLayout.push(buffer);

  return newLayout;
}

/**
 * Elimina elementos repetidos que no aportan nada
 */
function removeRedundant(layout) {
  return layout.filter((el, index) => {
    const prev = layout[index - 1];
    if (!prev) return true;

    // Duplicado exacto
    if (
      prev.type === el.type &&
      JSON.stringify(prev.props) === JSON.stringify(el.props)
    ) {
      return false;
    }

    return true;
  });
}

/**
 * Repara anidaciones incorrectas:
 * - un button no debe tener children
 * - un image tampoco
 * - una section sí puede tener children
 */
function fixInvalidNesting(layout) {
  return layout.map((el) => {
    if (el.type === "button" || el.type === "image" || el.type === "input") {
      return {
        ...el,
        children: [],
      };
    }

    return el;
  });
}

/**
 * Ordena automáticamente por prioridades de UX:
 * 1. Hero / Heading / Imagen principal
 * 2. Texto descriptivo
 * 3. Botones
 * 4. Inputs / Formularios
 * 5. Secciones secundarias
 */
function sortByUXPriority(layout) {
  const priority = {
    hero: 1,
    heading: 2,
    image: 3,
    text: 4,
    button: 5,
    input: 6,
    form: 7,
    section: 8,
    card: 9,
  };

  return layout.sort((a, b) => {
    const pa = priority[a.type] || 99;
    const pb = priority[b.type] || 99;
    return pa - pb;
  });
}

/**
 * MAIN — Tree Optimizer
 */
export function optimizeTree(layout) {
  let optimized = [...layout];

  // 1. Fusionar headings consecutivos
  optimized = mergeHeadings(optimized);

  // 2. Eliminar repetidos exactos
  optimized = removeRedundant(optimized);

  // 3. Reorganización por UX
  optimized = sortByUXPriority(optimized);

  // 4. Arreglar anidaciones inválidas
  optimized = fixInvalidNesting(optimized);

  return optimized;
}
