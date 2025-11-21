// ==========================================================
// OSOMAGIC 2.0 — AI BRAIN FINAL (Fase 5.8)
// Funciona 100% con Supabase Edge Function /openai
// Mantiene memoria, embeddings, fusion, recommender y themes
// ==========================================================

import { callOpenAI } from "./openaiClient";
import { buildFinalSchema } from "./schemaEngine";
import { processEmbedding } from "./embeddings";
import { fuseContext } from "./fusionEngine";
import { applyThemePreset, detectThemeIntent } from "./themeEngine";
import { analyzeLayoutForRecommendations } from "./recommender";

import {
  saveMemory,
  saveRuntimeMemory,
  findRelevantMemory
} from "./memoryEngine";

export async function processPromptAI(prompt, layout, projectId) {
  try {
    // -------------------------------------------------------
    // 1. Memoria relevante
    // -------------------------------------------------------
    const memory = await findRelevantMemory(projectId, prompt);

    // -------------------------------------------------------
    // 2. Schema Engine (estructura final del layout)
    // -------------------------------------------------------
    const { finalInstruction, finalLayout } = buildFinalSchema(prompt, layout);

    // -------------------------------------------------------
    // 3. Embeddings del layout
    // -------------------------------------------------------
    const embeddingData = await processEmbedding(projectId, finalLayout);

    // -------------------------------------------------------
    // 4. Fusion Engine (memoria + embeddings + prompt)
    // -------------------------------------------------------
    const { summarized } = fuseContext({
      prompt,
      memory,
      embedding: embeddingData.embedding,
      finalInstruction,
      finalLayout
    });

    // -------------------------------------------------------
    // 5. Recommender (sugerencias previas)
    // -------------------------------------------------------
    summarized.recommendations =
      analyzeLayoutForRecommendations(finalLayout);

    // -------------------------------------------------------
    // 6. Llamada REAL al backend (Supabase Edge Function)
    // -------------------------------------------------------
    const aiResponse = await callOpenAI({
      prompt,
      context: summarized
    });

    if (!aiResponse) {
      return {
        notes: "⚠️ No hubo respuesta de la IA.",
        newLayout: null
      };
    }

    // -------------------------------------------------------
    // 7. Procesar salida IA (ya viene en JSON)
    // -------------------------------------------------------
    const aiOutput = { ...aiResponse };

    // -------------------------------------------------------
    // 8. Detectar theme global
    // -------------------------------------------------------
    const themeName =
      detectThemeIntent(aiOutput.semantic || aiOutput.intent);

    if (themeName && aiOutput.newLayout) {
      aiOutput.newLayout = applyThemePreset(
        aiOutput.newLayout,
        themeName
      );
    }

    // -------------------------------------------------------
    // 9. Guardar memoria a corto y largo plazo
    // -------------------------------------------------------
    saveRuntimeMemory(prompt, aiOutput, aiOutput.newLayout);
    saveMemory(projectId, prompt, aiOutput, aiOutput.newLayout);

    return aiOutput;

  } catch (err) {
    console.error("AI Brain Error:", err);
    return {
      notes: "⚠️ Error procesando instrucción.",
      newLayout: null
    };
  }
}

// ==========================================================
// SYSTEM MESSAGE DEFINITIVO
// ==========================================================
export function systemMessage() {
  return `
Eres el motor de inteligencia OSOMAGIC 2.0.

Funciones:
- Analizar layout
- Detectar problemas de UX/UI
- Sugerir cambios al diseño
- Modificar estructura del layout
- Aplicar temas y estilos globales
- Usar memoria y embeddings
- Mantener coherencia visual profesional

REGLAS:
1. Devuelve SIEMPRE JSON.
2. Nada fuera de JSON.
3. Si el prompt es ambiguo → devuelve "action": "suggest".
4. Optimiza el diseño según buenas prácticas.
5. Respeta el estilo memorizado del proyecto.
`;
}
