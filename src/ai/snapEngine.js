// ==========================================================
// OSOMAGIC 2.0 – FASE 4.6 (Smart Snap Engine)
// Alineación automática, espaciados y snapping inteligente
// ==========================================================

/**
 * Ajusta margenes automáticos para mantener coherencia entre elementos
 */
function autoSpacing(layout) {
  const defaultSpacing = 32; // px

  return layout.map((el, index) => {
    const isFirst = index === 0;

    const marginTop = isFirst ? 0 : defaultSpacing;

    return {
      ...el,
      props: {
        ...el.props,
        style: {
          ...(el.props?.style || {}),
          marginTop,
        },
      },
    };
  });
}

/**
 * Normaliza posiciones: evita "mover arriba/abajo" de forma incorrecta
 */
function normalizeMove(props) {
  const mapping = {
    up: -1,
    arriba: -1,
    down: 1,
    abajo: 1,
  };

  for (const key in mapping) {
    if (props.position === key) return mapping[key];
  }

  return 0;
}

/**
 * Previene solapamientos asegurando mínimo espacio
 */
function preventOverlap(layout) {
  const minHeight = 50; // px mínimo para un componente básico
  let runningOffset = 0;

  return layout.map((el) => {
    const newEl = {
      ...el,
      props: {
        ...el.props,
        style: {
          ...(el.props?.style || {}),
          top: runningOffset,
        },
      },
    };

    runningOffset += minHeight + 20;
    return newEl;
  });
}

/**
 * Alineación horizontal simple
 */
function autoAlign(layout) {
  return layout.map((el) => {
    return {
      ...el,
      props: {
        ...el.props,
        style: {
          ...(el.props?.style || {}),
          left: "50%",
          transform: "translateX(-50%)",
        },
      },
    };
  });
}

/**
 * MAIN SNAP ENGINE
 */
export function applySnapping(layout, instruction) {
  let updated = [...layout];

  // 1. Alineación central
  updated = autoAlign(updated);

  // 2. Distribución vertical
  updated = autoSpacing(updated);

  // 3. Prevenir solapamientos
  updated = preventOverlap(updated);

  // 4. Ajustes de movimiento
  if (instruction.intent === "MOVE") {
    const delta = normalizeMove(instruction.props);

    if (delta !== 0) {
      const targetIndex = updated.findIndex((el) => el.id === instruction.targetId);
      const newIndex = targetIndex + delta;

      if (newIndex >= 0 && newIndex < updated.length) {
        const temp = updated[newIndex];
        updated[newIndex] = updated[targetIndex];
        updated[targetIndex] = temp;
      }
    }
  }

  return updated;
}
