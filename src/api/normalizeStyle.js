/* ============================================================================
   OSOMAGIC — NORMALIZADOR DE ESTILOS (ESTÉTICA LOVABLE)
   Limpia, convierte y normaliza styles para hacerlos 100% seguros.
   ============================================================================ */

const DEFAULT_STYLE = {
  text: {
    fontSize: 16,
    fontWeight: 400,
    color: "#111827",
  },
  heading: {
    fontSize: 28,
    fontWeight: 700,
    color: "#111827",
  },
  button: {
    fontSize: 15,
    fontWeight: 600,
    color: "#ffffff",
    background: "#f97316",
    paddingX: 16,
    paddingY: 10,
    radius: 8,
  },
  card: {
    background: "#ffffff",
    radius: 12,
    border: "#e5e7eb",
    padding: 20,
  },
  hero: {
    textAlign: "center",
    background: "#ffffff",
  },
  section: {
    background: "#ffffff",
  },
  image: {
    radius: 12,
  },
};

/* ---------------------------------------------------------------------------
   LIMPIEZA Y TIPADO DE PROPIEDADES
--------------------------------------------------------------------------- */

/** Convierte "20px" → 20 y asegura números */
function toNumber(value, fallback = null) {
  if (value == null) return fallback;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = parseFloat(value.replace("px", "").trim());
    return isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
}

/** Asegura un color válido tipo HEX */
function sanitizeColor(value, fallback = "#111827") {
  if (!value || typeof value !== "string") return fallback;
  if (value.startsWith("#") && (value.length === 4 || value.length === 7)) {
    return value;
  }
  // Si IA manda "orange", lo convertimos al naranja OSOMAGIC
  if (["orange", "naranja", "primary"].includes(value.toLowerCase())) {
    return "#f97316";
  }
  return fallback;
}

/** Asegura radius seguro */
function sanitizeRadius(value, fallback = 8) {
  return toNumber(value, fallback);
}

/** Asegura alignment seguro */
function sanitizeTextAlign(value) {
  const allowed = ["left", "center", "right", "start", "end"];
  if (allowed.includes(value)) return value;
  return "left";
}

/* ---------------------------------------------------------------------------
   APLICACIÓN DE DEFAULTS POR TIPO DE COMPONENTE
--------------------------------------------------------------------------- */

function applyStyleDefaults(type, style = {}) {
  const base = DEFAULT_STYLE[type] || {};
  return {
    ...base,
    ...style,
  };
}

/* ---------------------------------------------------------------------------
   NORMALIZACIÓN PRINCIPAL
--------------------------------------------------------------------------- */

export function normalizeStyle(tree) {
  const walk = (node) => {
    if (!node || typeof node !== "object") return node;

    if (typeof node.style !== "object" || node.style == null) {
      node.style = {};
    }

    let s = node.style;

    /* =============================
       NORMALIZACIÓN UNIVERSAL
    ============================== */

    s.fontSize = toNumber(s.fontSize, undefined);
    s.fontWeight = s.fontWeight || undefined;

    s.color = sanitizeColor(s.color, undefined);
    s.background = sanitizeColor(s.background, undefined);

    s.padding = toNumber(s.padding, undefined);
    s.paddingX = toNumber(s.paddingX, undefined);
    s.paddingY = toNumber(s.paddingY, undefined);

    s.radius = sanitizeRadius(s.radius, undefined);

    s.border = sanitizeColor(s.border, undefined);

    s.textAlign = sanitizeTextAlign(s.textAlign, undefined);

    /* =============================
       APLICAR DEFAULTS POR TIPO
    ============================== */
    node.style = applyStyleDefaults(node.type, s);

    /* =============================
       RECURSIVIDAD
    ============================== */
    if (Array.isArray(node.children)) {
      node.children = node.children.map((child) => walk(child));
    }

    return node;
  };

  return walk(tree);
}
