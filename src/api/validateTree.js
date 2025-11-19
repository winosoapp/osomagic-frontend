/* ============================================================
   OSOMAGIC — TREE VALIDATOR (Estilo LOVABLE)
   Limpia, valida y repara todo el árbol antes del render.
   ============================================================ */

import { generateId } from "./idGenerator";

/* --------------------------------------------
   LOGS internos para debug / IA / Admin
--------------------------------------------- */
export const validationLog = [];

/* --------------------------------------------
   Añadir log
--------------------------------------------- */
function log(message, extra = null) {
  validationLog.push({
    message,
    extra,
    timestamp: Date.now(),
  });
}

/* --------------------------------------------
   Validación de un nodo individual
--------------------------------------------- */
function validateNode(node) {
  if (!node || typeof node !== "object") {
    log("Nodo inválido → convertido en nodo vacío", node);
    return {
      id: generateId("node"),
      type: "container",
      layout: {},
      style: {},
      children: [],
    };
  }

  /* --- Normalizar ID --- */
  if (!node.id) {
    node.id = generateId(node.type || "node");
    log("ID generado para nodo sin ID", node.id);
  }

  /* --- Normalizar type --- */
  if (!node.type || typeof node.type !== "string") {
    log("Nodo sin type → asignado 'container'", node.id);
    node.type = "container";
  }

  node.type = node.type.trim().toLowerCase();

  /* --- Normalizar layout --- */
  if (typeof node.layout !== "object" || node.layout === null) {
    log("layout inválido → reemplazado", { id: node.id, layout: node.layout });
    node.layout = {};
  }

  /* --- Normalizar style --- */
  if (typeof node.style !== "object" || node.style === null) {
    log("style inválido → reemplazado", { id: node.id, style: node.style });
    node.style = {};
  }

  /* --- Normalizar children --- */
  if (!Array.isArray(node.children)) {
    log("children corrupto → convertido a array", { id: node.id, children: node.children });
    node.children = [];
  }

  return node;
}

/* --------------------------------------------
   Validación profunda (recursiva)
--------------------------------------------- */
export function validateTree(root) {
  validationLog.length = 0; // limpiar logs

  if (!root) {
    log("Árbol vacío → creado nodo root por defecto");
    return {
      id: generateId("root"),
      type: "page",
      layout: {},
      style: {},
      children: [],
    };
  }

  const walk = (node) => {
    const cleanNode = validateNode(node);

    if (Array.isArray(cleanNode.children)) {
      cleanNode.children = cleanNode.children.map((child) => walk(child));
    }

    return cleanNode;
  };

  const validated = walk(root);

  log("Validación finalizada correctamente", validated.id);

  return validated;
}

/* --------------------------------------------
   API pública para obtener logs
--------------------------------------------- */
export function getValidationLog() {
  return [...validationLog];
}
