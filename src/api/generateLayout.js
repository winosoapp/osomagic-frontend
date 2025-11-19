// src/api/generateLayout.js

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indsa3Jjd3J0d3JtdWF1dWhiaXpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNDQ0NzMsImV4cCI6MjA3ODcyMDQ3M30.ZrVjbhVO5UCNzIraEdi0Ip6OPTq0pp3j2WczHo26nfY";

export async function generateLayout(prompt, deviceMode, currentLayout) {
  try {
    const response = await fetch(
      "https://wlkrcwrtwrmuauuhbizj.supabase.co/functions/v1/generate-layout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          prompt,
          deviceMode,
          currentLayout,
        }),
      }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Error procesando IA");
    }

    return data.layout;
  } catch (err) {
    console.error("❌ Error generateLayout:", err);
    throw err;
  }
}
