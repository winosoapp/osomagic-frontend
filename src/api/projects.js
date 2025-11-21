// ============================================================================
// API — FASE 3: Persistencia de Proyectos en Supabase
// ============================================================================

import { supabase } from "../supabase/client";

// ---------------------------------------------------------------------------
// Guarda proyecto (forzado o normal)
// ---------------------------------------------------------------------------
export async function saveProjectToSupabase(projectId, layoutTree) {
  if (!projectId) throw new Error("No hay projectId para guardar.");
  if (!layoutTree) throw new Error("No hay layoutTree para guardar.");

  const payload = {
    layout: layoutTree,
    updated_at: new Date().toISOString(),
  };

  // Si existe → update
  // Si no existe → insert
  const { data, error } = await supabase
    .from("projects")
    .upsert([
      {
        id: projectId,
        layout: payload.layout,
        updated_at: payload.updated_at,
      },
    ])
    .select();

  if (error) {
    console.error("❌ Error guardando proyecto:", error);
    throw error;
  }

  return data?.[0];
}

// ---------------------------------------------------------------------------
// Cargar un proyecto completo
// ---------------------------------------------------------------------------
export async function loadProjectFromSupabase(projectId) {
  if (!projectId) throw new Error("No hay projectId para cargar.");

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error) {
    console.error("❌ Error cargando proyecto:", error);
    return null;
  }

  return data || null;
}

// ---------------------------------------------------------------------------
// Crear nuevo proyecto vacío
// ---------------------------------------------------------------------------
export async function createNewProject(name = "Nuevo Proyecto") {
  const { data, error } = await supabase
    .from("projects")
    .insert([
      {
        name,
        layout: { id: "page-empty", component: "Page", children: [] },
      },
    ])
    .select();

  if (error) {
    console.error("❌ Error creando proyecto:", error);
    throw error;
  }

  return data?.[0];
}
