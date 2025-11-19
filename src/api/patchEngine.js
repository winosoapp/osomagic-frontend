/* ============================================================================
   OSOMAGIC — MOTOR DE PATCHES INCREMENTALES
   Aplica cambios al árbol sin reescribirlo entero (estilo LOVABLE).
   ============================================================================ */

/**
 * Mezcla profunda (deep merge) entre objetos, sin perder claves.
 */
function deepMerge(target, patch) {
  if (typeof patch !== "object" || patch === null) return patch;

  if (Array.isArray(patch)) return patch;

  const result = { ...target };

  for (const key in patch) {
    if (
      typeof patch[key] === "object" &&
      patch[key] !== null &&
      !Array.isArray(patch[key])
    ) {
      result[key] = deepMerge(target[key] || {}, patch[key]);
    } else {
      result[key] = patch[key];
    }
  }

  return result;
}

/**
 * Busca un nodo por ID dentro de un árbol.
 */
export function findNodeById(node, id) {
  if (!node) return null;
  if (node.id === id) return node;

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Aplica un patch sobre un nodo específico.
 */
function applyPatchToNode(node, patch) {
  if (!node || typeof patch !== "object") return node;

  // Mezcla profunda de propiedades
  const updated = deepMerge(node, patch);

  // Nunca permitir borrar id ni type
  updated.id = node.id;
  updated.type = node.type;

  return updated;
}

/**
 * Aplica un patch dentro de un array de hijos
 */
function applyPatchToChildren(children, patchNode) {
  if (!Array.isArray(children)) return children;

  return children.map((child) => {
    if (child.id === patchNode.id) {
      return applyPatchToNode(child, patchNode);
    }
    return {
      ...child,
      children: applyPatchToChildren(child.children, patchNode),
    };
  });
}

/**
 * PATCH ENGINE PRINCIPAL:
 * patch = { id, ...propsModificadas }
 */
export function applyPatch(tree, patch) {
  if (!patch || !patch.id) {
    console.warn("Patch inválido:", patch);
    return tree;
  }

  // Si el patch es para la raíz
  if (tree.id === patch.id) {
    return applyPatchToNode(tree, patch);
  }

  // Buscar hijo y mezclar
  return {
    ...tree,
    children: applyPatchToChildren(tree.children, patch),
  };
}

/* ============================================================================
   MÚLTIPLES PATCHES (cola de modificaciones IA)
   ============================================================================ */

export function applyPatches(tree, patchList = []) {
  let updated = tree;

  for (const p of patchList) {
    updated = applyPatch(updated, p);
  }

  return updated;
}

/* ============================================================================
   GENERACIÓN DE PATCH POR CAMBIOS DE PROPIEDADES
   (Usado por IA y por acciones de UI en el futuro)
   ============================================================================ */

export function createPropertyPatch(nodeId, propPath, value) {
  const obj = { id: nodeId };

  let pointer = obj;
  const parts = propPath.split(".");

  for (let i = 0; i < parts.length - 1; i++) {
    pointer[parts[i]] = {};
    pointer = pointer[parts[i]];
  }

  pointer[parts[parts.length - 1]] = value;

  return obj;
}

/* ============================================================================
   PATCH PARA REEMPLAZAR COMPLETAMENTE LOS HIJOS
   ============================================================================ */

export function createReplaceChildrenPatch(nodeId, newChildren) {
  return {
    id: nodeId,
    children: newChildren,
  };
}

/* ============================================================================
   PATCH PARA INSERTAR UN NODO NUEVO
   ============================================================================ */

export function createInsertPatch(parentId, newNode) {
  return {
    id: parentId,
    children: (oldChildren = []) => [...oldChildren, newNode],
  };
}

/* ============================================================================
   PATCH PARA ELIMINAR UN NODO
   ============================================================================ */

export function createDeletePatch(nodeId) {
  return {
    delete: nodeId,
  };
}
