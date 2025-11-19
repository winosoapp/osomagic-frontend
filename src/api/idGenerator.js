/* ============================================================
   OSOMAGIC — ID GENERATOR (Estilo LOVABLE)
   Crea IDs semánticos, únicos y estables para cada nodo UI.
   ============================================================ */

const usedIds = new Set();

/* --------------------------------------------
   Genera un hash corto de 6 caracteres
--------------------------------------------- */
function shortHash() {
  return Math.random().toString(16).slice(2, 8);
}

/* --------------------------------------------
   Normaliza el nombre del tipo
--------------------------------------------- */
function normalizeType(type) {
  if (!type) return "node";

  return String(type)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-") // espacios → guiones
    .replace(/[^a-z0-9\-]/g, ""); // limpia caracteres raros
}

/* --------------------------------------------
   Genera el ID final
--------------------------------------------- */
export function generateId(type = "node") {
  const base = normalizeType(type);
  let id = `${base}_${shortHash()}`;

  // Evitar colisiones
  while (usedIds.has(id)) {
    id = `${base}_${shortHash()}`;
  }

  usedIds.add(id);
  return id;
}

/* --------------------------------------------
   Resetea el generador (para tests o snapshots)
--------------------------------------------- */
export function resetIdGenerator() {
  usedIds.clear();
}

/* ------------------------------------------------------------
   Utilidad avanzada:
   Genera IDs para árboles completos (opcional)
------------------------------------------------------------- */
export function assignIdsRecursively(node) {
  if (!node) return null;

  // Si no tiene ID → generar uno nuevo
  if (!node.id) {
    node.id = generateId(node.type || "node");
  }

  // Si tiene children, asignar de forma recursiva
  if (Array.isArray(node.children)) {
    node.children = node.children.map(assignIdsRecursively);
  }

  return node;
}
