// ==========================================================
// OSOMAGIC 2.0 — openaiClient.js (VERSIÓN FINAL FUNCIONANDO)
// Cliente para llamar a Supabase Edge Function /openai
// ==========================================================

// 1️⃣ Variables sin Vite, formato CRA/React
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ Faltan variables REACT_APP_SUPABASE_URL o REACT_APP_SUPABASE_ANON_KEY");
}

// 2️⃣ Convertimos la URL de Supabase al dominio correcto de funciones
// Ejemplo:
// https://xxxx.supabase.co  →  https://xxxx.functions.supabase.co/openai
const FUNCTIONS_URL = SUPABASE_URL
  .replace(".supabase.co", ".functions.supabase.co") + "/openai";

export async function callOpenAI({ prompt, context }) {
  try {
    const response = await fetch(FUNCTIONS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`, // 🔥 NECESARIO
      },
      body: JSON.stringify({ prompt, context }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error en llamada IA:", errorText);
      return null;
    }

    // Devuelve el JSON que genera la Edge Function
    return await response.json();

  } catch (err) {
    console.error("❌ Fallo en callOpenAI:", err);
    return null;
  }
}
