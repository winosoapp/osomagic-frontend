// ==========================================================
// OSOMAGIC 2.0 — FASE 4.8
// SCHEMA FINAL — Motor IA unificado
// ==========================================================

import { semanticEngine } from "./semanticEngine";
import { analyzeLayout, resolveTargetComponent } from "./contextEngine";
import { autoAdjustTree } from "./treeAdjustments";
import { cleanLayout } from "./smartLayoutCleaner";
import { applySnapping } from "./snapEngine";
import { optimizeTree } from "./treeOptimizer";

/**
 * Recibe:
 * - prompt (string del usuario)
 * - layout actual
 * 
 * Devuelve:
 * - finalInstruction (intención perfecta)
 * - finalLayout (layout procesado y optimizado)
 */
export function buildFinalSchema(prompt, layout) {
  let workingLayout = [...layout];

  // ======================================================
  // 1. ANALIZAR SEMÁNTICA (4.2)
  // ======================================================
  const semanticOutput = semanticEngine(prompt, workingLayout);

  // ======================================================
  // 2. ANALIZAR CONTEXTO (4.3)
  // ======================================================
  const ctx = analyzeLayout(workingLayout);

  // Resolver componente objetivo real
  const target = resolveTargetComponent(prompt, semanticOutput, ctx);

  // ======================================================
  // 3. CONSTRUIR INSTRUCCIÓN FINAL
  // ======================================================
  const finalInstruction = {
    intent: semanticOutput.intent,
    targetComponent: target.type,
    targetId: target.id || null,
    props: semanticOutput.props,
    semantic: semanticOutput.semantic,
    rawPrompt: prompt
  };

  // ======================================================
  // 4. AJUSTAR EL ÁRBOL (4.4)
  // ======================================================
  workingLayout = autoAdjustTree(workingLayout, finalInstruction);

  // ======================================================
  // 5. LIMPIEZA AVANZADA (4.5)
  // ======================================================
  workingLayout = cleanLayout(workingLayout);

  // ======================================================
  // 6. SNAPPING INTELIGENTE (4.6)
  // ======================================================
  workingLayout = applySnapping(workingLayout, finalInstruction);

  // ======================================================
  // 7. OPTIMIZACIÓN UX (4.7)
  // ======================================================
  workingLayout = optimizeTree(workingLayout);

  // ======================================================
  // 8. SALIDA FINAL (FASE 4 COMPLETA)
  // ======================================================
  return {
    finalInstruction,
    finalLayout: workingLayout
  };
}
