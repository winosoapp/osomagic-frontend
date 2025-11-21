// ==========================================================
// OSOMAGIC 2.0 — FASE 5.3 (Memory Engine)
// Memoria persistente (Supabase) + memoria temporal
// ==========================================================

import { supabase } from "../supabase/client";

// Memoria temporal en runtime
let runtimeMemory = [];

// -----------------------------------------------
// 1. Guardar memoria en Supabase
// -----------------------------------------------
export async function saveMemory(projectId, prompt, instruction, layout) {
  // Obtener usuario actual
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const userId = user?.id || "00000000-0000-0000-0000-000000000000";

  const memoryEntry = {
    user_id: userId,
    project_id: projectId,
    memory_key: prompt,
    memory_value: JSON.stringify({
      instruction,
      layout,
    }),
  };

  const { data, error } = await supabase
    .from("ai_prompt_memory")
    .insert(memoryEntry);

  if (error) {
    console.error("Error saving memory:", error);
    return null;
  }

  return data;
}

// -----------------------------------------------
// 2. Guardar memoria en runtime (RAM)
// -----------------------------------------------
export function saveRuntimeMemory(prompt, instruction, layout) {
  runtimeMemory.push({
    prompt,
    instruction,
    layout,
  });

  if (runtimeMemory.length > 30) {
    runtimeMemory.shift();
  }
}

// -----------------------------------------------
// 3. Obtener memoria de Supabase por proyecto
// -----------------------------------------------
export async function getProjectMemory(projectId) {
  const { data, error } = await supabase
    .from("ai_prompt_memory")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading memory:", error);
    return [];
  }

  return data;
}

// -----------------------------------------------
// 4. Obtener memoria combinada (Supabase + RAM)
// -----------------------------------------------
export async function getCombinedMemory(projectId) {
  const dbMemory = await getProjectMemory(projectId);

  return [
    ...runtimeMemory,
    ...dbMemory.map((entry) => ({
      prompt: entry.memory_key,
      instruction: JSON.parse(entry.memory_value).instruction,
      layout: JSON.parse(entry.memory_value).layout,
    })),
  ];
}

// -----------------------------------------------
// 5. Buscar memoria “relevante” para el contexto
// -----------------------------------------------
export async function findRelevantMemory(projectId, prompt) {
  const combined = await getCombinedMemory(projectId);

  const relevant = combined.filter((m) =>
    prompt.toLowerCase().includes(m.prompt.toLowerCase().split(" ")[0])
  );

  if (relevant.length > 0) return relevant[0];

  return combined[0] || null;
}
