// ==========================================================
// OSOMAGIC 2.0 — FASE 4.4 (Auto-Tree Adjustments)
// Ajustes automáticos del árbol de componentes
// ==========================================================

/**
 * Normaliza un componente básico
 */
function normalizeComponent(component) {
  return {
    id: component.id || crypto.randomUUID(),
    type: component.type,
    props: component.props || {},
    children: component.children || [],
  };
}

/**
 * Evita duplicaciones excesivas de secciones o héroes
 * (Por ejemplo: no queremos 3 HERO seguidos)
 */
function dedupeSections(layout) {
  const cleaned = [];
  let lastType = null;

  layout.forEach((el) => {
    if (el.type === "section" && lastType === "section") {
      // Evitar duplicados seguidos
      return;
    }
    cleaned.push(el);
    lastType = el.type;
  });

  return cleaned;
}

/**
 * Cuando la IA añade un nuevo elemento
 * revisamos dónde debería ir para no romper layout.
 */
function insertSmart(layout, newElement) {
  const normalized = normalizeComponent(newElement);

  // Insertar debajo del último elemento SIEMPRE
  layout.push(normalized);

  return layout;
}

/**
 * Reordenar secciones si la IA las mueve
 */
function moveElement(layout, elementId, direction) {
  const index = layout.findIndex((el) => el.id === elementId);
  if (index === -1) return layout;

  const target = layout[index];

  if (direction === "up" && index > 0) {
    const temp = layout[index - 1];
    layout[index - 1] = target;
    layout[index] = temp;
  }

  if (direction === "down" && index < layout.length - 1) {
    const temp = layout[index + 1];
    layout[index + 1] = target;
    layout[index] = temp;
  }

  return layout;
}

/**
 * Limpieza automática básica:
 * - elimina nulos
 * - elimina elementos corruptos
 * - ordena por prioridad si hiciera falta
 */
function basicCleanup(layout) {
  return layout.filter((el) => el && el.type);
}

/**
 * MAIN — Ajustes automáticos del árbol
 */
export function autoAdjustTree(layout, instruction) {
  let updated = [...layout];

  // 1. Limpieza básica
  updated = basicCleanup(updated);

  // 2. Evitar duplicados de secciones seguidas
  updated = dedupeSections(updated);

  // 3. Si es ADD
  if (instruction.intent === "ADD") {
    updated = insertSmart(updated, {
      type: instruction.targetComponent,
      props: instruction.props,
    });
  }

  // 4. Si es MOVE
  if (instruction.intent === "MOVE") {
    const direction = instruction.props.position === "up" ? "up" : "down";
    updated = moveElement(updated, instruction.targetId, direction);
  }

  // 5. Si es UPDATE
  if (instruction.intent === "UPDATE") {
    updated = updated.map((el) => {
      if (el.type === instruction.targetComponent) {
        return {
          ...el,
          props: { ...el.props, ...instruction.props },
        };
      }
      return el;
    });
  }

  // 6. Si es DELETE
  if (instruction.intent === "DELETE") {
    updated = updated.filter((el) => el.type !== instruction.targetComponent);
  }

  return updated;
}
