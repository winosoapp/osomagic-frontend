// ==========================================================
// UTILIDAD UNIVERSAL — Convertir árbol de layout en array plano
// ==========================================================

export function flattenLayout(node) {
  if (!node) return [];

  const list = [node];

  if (Array.isArray(node.children)) {
    node.children.forEach(child => {
      list.push(...flattenLayout(child));
    });
  }

  return list;
}
