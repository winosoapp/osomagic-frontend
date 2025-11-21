// ==========================================================
// OSOMAGIC 2.0 — FASE 5.4 (Fusion Engine)
// Fusión inteligente: memoria + embeddings + contexto
// ==========================================================

/**
 * Fusión inteligente de contexto IA:
 * - Memoria relevante del proyecto
 * - Embedding actual del layout
 * - Instrucción final generada por el motor semántico
 * - Layout procesado (limpio y optimizado)
 */
export function fuseContext({ 
  prompt, 
  memory, 
  embedding, 
  finalInstruction, 
  finalLayout 
}) {

  // 1. Procesar memoria (si existe)
  const memoryContext = memory
    ? {
        lastPrompt: memory.prompt,
        lastInstruction: memory.instruction,
        lastLayout: memory.layout
      }
    : null;

  // 2. Crear bloque de contexto enriquecido
  const fusion = {
    currentPrompt: prompt,
    finalInstruction,
    finalLayout,
    embeddingVector: embedding || null,
    memoryContext,
    timestamp: Date.now()
  };

  // 3. Preparar texto compacto para OpenAI (mucho más eficiente)
  const summarized = {
    summary: `
Contexto fusionado OSOMAGIC:
- Prompt actual: ${prompt}
- Acción: ${finalInstruction.intent}
- Target: ${finalInstruction.targetComponent}
- Props: ${JSON.stringify(finalInstruction.props)}
- Memoria previa: ${memoryContext ? "Sí" : "No"}
    `.trim(),
    memoryContext,
    finalLayout,
    finalInstruction,
    embedding
  };

  // 4. Devolver ambas versiones
  return {
    fusion,
    summarized
  };
}
