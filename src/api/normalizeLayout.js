/* ============================================================================
   OSOMAGIC — NORMALIZADOR DE LAYOUT (ESTILO LOVABLE)
   Limpia y estandariza todas las propiedades de layout.
   ============================================================================ */

const DEFAULTS = {
  container: {
    direction: "vertical",
    padding: 24,
    gap: 20,
    align: "start",
    justify: "start",
  },
  section: {
    direction: "vertical",
    padding: 32,
    gap: 24,
    align: "start",
    justify: "start",
  },
  row: {
    direction: "horizontal",
    padding: 0,
    gap: 16,
    align: "center",
    justify: "start",
  },
  column: {
    direction: "vertical",
    padding: 0,
    gap: 16,
    align: "start",
    justify: "start",
  },
  hero: {
    direction: "vertical",
    padding: 48,
    gap: 28,
    align: "center",
    justify: "center",
  },
  card: {
    direction: "vertical",
    padding: 20,
    gap: 14,
    align: "start",
    justify: "start",
  },
  grid: {
    columns: 3,
    gap: 20,
    padding: 16,
  },
  button: {
    align: "center",
    justify: "center",
  },
};

/* ---------------------------------------------------------------------------
   Mezcla de defaults con el nodo actual
--------------------------------------------------------------------------- */
function applyDefaults(type, layout) {
  const base = DEFAULTS[type] || DEFAULTS.container;
  return {
    ...base,
    ...layout,
  };
}

/* ---------------------------------------------------------------------------
   Normaliza los valores del layout para que sean seguros
--------------------------------------------------------------------------- */
function sanitizeLayout(layout) {
  const clean = {};

  for (const key in layout) {
    const val = layout[key];

    if (val == null) continue;

    switch (key) {
      case "padding":
      case "gap":
      case "columns":
        clean[key] = Number(val) || 0;
        break;

      case "direction":
        clean[key] =
          val === "horizontal" || val === "vertical" ? val : "vertical";
        break;

      case "align":
      case "justify":
        clean[key] = val;
        break;

      default:
        // Ignorar cosas raras enviadas por la IA
        break;
    }
  }

  return clean;
}

/* ---------------------------------------------------------------------------
   PROCESO PRINCIPAL
--------------------------------------------------------------------------- */
export function normalizeLayout(tree) {
  const walk = (node) => {
    if (!node || typeof node !== "object") return node;

    /* --- Normalizar layout --- */
    if (typeof node.layout !== "object" || node.layout === null) {
      node.layout = {};
    }

    const sanitized = sanitizeLayout(node.layout);
    const withDefaults = applyDefaults(node.type, sanitized);

    node.layout = withDefaults;

    /* --- Recursividad --- */
    if (Array.isArray(node.children)) {
      node.children = node.children.map((child) => walk(child));
    }

    return node;
  };

  return walk(tree);
}
