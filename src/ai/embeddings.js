// ==========================================================
// OSOMAGIC 2.0 — embeddings.js (Fase 5.8)
// Genera embeddings llamando a la Edge Function /openai
// ==========================================================

import { callOpenAI } from "./openaiClient";

export async function processEmbedding(projectId, finalLayout) {
  try {
    const prompt = `
Genera un embedding representativo del layout actual.
Devuelve SOLO JSON:
{
  "embedding": [números...]
}
`;

    const result = await callOpenAI({
      prompt,
      context: {
        projectId,
        layout: finalLayout
      }
    });

    if (!result || !result.embedding) {
      console.warn("⚠️ No se pudo generar embedding");
      return { embedding: [] };
    }

    return {
      embedding: result.embedding
    };

  } catch (err) {
    console.error("Embedding Error:", err);
    return { embedding: [] };
  }
}
