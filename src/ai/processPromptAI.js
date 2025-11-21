// =====================================================
// OSOMAGIC 2.0 — MOTOR PRINCIPAL DEL PROMPT (Fase 5)
// Convierte un prompt del usuario → instrucciones IA 
// → actualización del layout
// =====================================================

import { sendToOpenAI } from "./openaiClient.js";
import { saveMemory } from "./memoryEngine.js";
import { generateLayout } from "../api/generateLayout.js";
import { normalizeLayout } from "../api/normalizeLayout.js";
import { patchLayout } from "../api/patchEngine.js";
import { getProject } from "../api/projects.js";

// -----------------------------------------------------
//  PROCESAR PROMPT COMPLETO
// -----------------------------------------------------
export async function processPromptAI({ projectId, prompt }) {
  try {
    console.log("🧠 Procesando prompt:", prompt);

    // 1️⃣ Obtener datos del proyecto
    const project = await getProject(projectId);
    if (!project) {
      console.error("❌ No existe el proyecto:", projectId);
      return null;
    }

    // 2️⃣ Enviar prompt a OpenAI
    const aiResponse = await sendToOpenAI(prompt, project);
    console.log("🤖 Respuesta IA:", aiResponse);

    if (!aiResponse || !aiResponse.layout) {
      console.error("❌ IA no devolvió layout");
      return null;
    }

    // 3️⃣ Normalizar layout (reestructurar nombres + props)
    const normalized = normalizeLayout(aiResponse.layout);

    // 4️⃣ Aplicar parches finales al layout
    const patched = patchLayout(normalized);

    // 5️⃣ Guardar memoria (para mejorar futuras respuestas)
    await saveMemory(
      projectId,
      prompt,
      aiResponse.instruction || "",
      patched
    );

    // 6️⃣ 🚀 Devolver layout final al frontend
    return {
      ok: true,
      instruction: aiResponse.instruction || "Diseño actualizado",
      layout: patched,
    };

  } catch (err) {
    console.error("❌ ERROR EN processPromptAI:", err);
    return { ok: false, error: err };
  }
}
