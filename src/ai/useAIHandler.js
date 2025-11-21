// ==========================================================
// OSOMAGIC 2.0 — useAIHandler (FIX DEFINITIVO CANVAS)
// ==========================================================

import { useState } from "react";
import { saveMemory, saveRuntimeMemory } from "./memoryEngine.js";
import { generateLayout } from "../api/generateLayout.js";

// -----------------------------------------------------------
// CONVERSOR GLOBAL → SIEMPRE DEVUELVE "component"
// + merge de estilos (style + props.style)
// -----------------------------------------------------------
function convertToEngineLayout(node) {
  if (!node || typeof node !== "object") return null;

  const typeMap = {
    Page: "Page",
    Section: "Section",
    Row: "Row",
    Column: "Column",
    Heading: "Heading",
    Text: "Text",
    Button: "Button",
    Image: "Image",
    Grid: "Grid",
    Card: "Card",
    PricingCard: "PricingCard",
    FeatureCard: "FeatureCard",
    Chart: "Chart",
  };

  const rawType = node.component || node.type || "Section";

  const normalized =
    typeof rawType === "string" ? rawType : String(rawType || "");

  const component =
    typeMap[normalized] ||
    normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();

  // 🔥 Merge de estilos: style y props.style
  const rawProps = node.props || {};
  const mergedStyle = {
    ...(node.style || {}),
    ...(rawProps.style || {}),
  };

  const cleanProps = { ...rawProps };
  delete cleanProps.style;

  return {
    id: node.id || (typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2)),
    component,
    props: cleanProps,
    style: mergedStyle,
    content: node.content || "",
    children: Array.isArray(node.children)
      ? node.children.map(convertToEngineLayout)
      : [],
  };
}

// -----------------------------------------------------------
// VALIDACIÓN (más tolerante)
// -----------------------------------------------------------
function looksLikePage(obj) {
  const comp = obj?.component || obj?.type;
  if (!comp) return true;
  const c = String(comp).toLowerCase();
  return c === "page" || c === "page-root" || c.endsWith("-page");
}

function isValidEngineLayout(obj) {
  return (
    obj &&
    typeof obj === "object" &&
    Array.isArray(obj.children) &&
    looksLikePage(obj)
  );
}

// -----------------------------------------------------------
// HOOK PRINCIPAL
// -----------------------------------------------------------
export function useAIHandler({
  layout,
  setLayout,
  projectId,
  addChatMessage,
}) {
  const [loading, setLoading] = useState(false);

  const sendPrompt = async (promptText) => {
    if (!promptText?.trim()) return;

    setLoading(true);

    try {
      const layoutArray = Array.isArray(layout) ? layout : [layout];

      // 1. IA
      const rawLayout = await generateLayout(
        promptText,
        "desktop",
        layoutArray
      );

      console.log("🟦 RAW desde IA:", rawLayout);

      // 2. Conversión segura
      const converted = convertToEngineLayout(rawLayout);

      console.log("🟩 Convertido FIX:", converted);

      // 3. Validación
      if (!isValidEngineLayout(converted)) {
        console.error("❌ Layout inválido tras conversión:", converted);
        addChatMessage({
          role: "assistant",
          text: "⚠ La IA generó un layout inválido.",
        });
        return null;
      }

      // 4. Renderizar
      setLayout(converted);

      // 5. Memoria
      try {
        if (projectId) {
          await saveMemory(
            projectId,
            promptText,
            "update_layout",
            converted
          );
        }
        saveRuntimeMemory(promptText, "update_layout", converted);
      } catch (err) {
        console.warn("⚠ No se guardó memoria:", err);
      }

      addChatMessage({
        role: "assistant",
        text: "✓ Diseño actualizado",
      });

      return converted;
    } catch (err) {
      console.error("❌ Error en sendPrompt:", err);
      addChatMessage({
        role: "assistant",
        text: "⚠ No he podido aplicar los cambios.",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendPrompt };
}
