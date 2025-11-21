// ======================================================================
// OSOMAGIC 2.0 — generateLayout (VERSIÓN FINAL CORRECTA)
// Frontend → Supabase Edge Function → OpenAI → JSON limpio
// ======================================================================

const SUPABASE_URL = "https://wlkrcwrtwrmuauuhbizj.supabase.co";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indsa3Jjd3J0d3JtdWF1dWhiaXpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNDQ0NzMsImV4cCI6MjA3ODcyMDQ3M30.ZrVjbhVO5UCNzIraEdi0Ip6OPTq0pp3j2WczHo26nfY";

export async function generateLayout(prompt, deviceMode, currentLayout) {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/openai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 🔥 OBLIGATORIO — si falta → 401 Missing authorization header
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        action: "generateLayout",
        prompt,
        deviceMode,
        currentLayout,
      }),
    });

    // A veces Edge devuelve texto aunque sea JSON → lo leemos como texto
    const raw = await response.text();
    console.log("🟦 RAW desde Edge:", raw);

    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      console.error("❌ Edge devolvió algo que NO es JSON válido:", raw);
      throw new Error("Respuesta inválida desde la función Edge");
    }

    // Si la Edge function devolvió error
    if (!data || data.error) {
      console.error("❌ Error IA:", data?.error);
      throw new Error(data?.error || "Error procesando IA");
    }

    // 👇 Lo único que enviamos al canvas
    return data.layout;

  } catch (err) {
    console.error("❌ Error generateLayout:", err);
    throw err;
  }
}
