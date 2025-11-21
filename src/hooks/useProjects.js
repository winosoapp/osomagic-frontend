import { supabase } from "../supabase/client";

export function useProjects() {
  // Crear un proyecto
  const createProject = async (userId, name = "Nuevo proyecto") => {
    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: userId,
        name,
        route: "/"
      })
      .select()
      .single();

    return { project: data, error };
  };

  // Guardar layout como nueva versión
  const saveVersion = async (projectId, layoutTree) => {
    const { data: versions } = await supabase
      .from("project_versions")
      .select("version_number")
      .eq("project_id", projectId);

    const nextVersion = versions.length + 1;

    const { error } = await supabase.from("project_versions").insert({
      project_id: projectId,
      version_number: nextVersion,
      layout_json: layoutTree,
    });

    return { error };
  };

  // Autosave
  const autoSave = async (userId, projectId, layoutTree) => {
    await supabase
      .from("project_autosave")
      .upsert({
        user_id: userId,
        project_id: projectId,
        layout_json: layoutTree,
        updated_at: new Date()
      });
  };

  // Cargar proyecto
  const loadProject = async (projectId) => {
    const { data, error } = await supabase
      .from("project_versions")
      .select("layout_json")
      .eq("project_id", projectId)
      .order("version_number", { ascending: false })
      .limit(1)
      .single();

    return { layout: data?.layout_json || null, error };
  };

  return {
    createProject,
    saveVersion,
    autoSave,
    loadProject,
  };
}
