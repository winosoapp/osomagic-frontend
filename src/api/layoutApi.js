// src/api/layoutApi.js
export async function generateLayoutFromAI(promptText, { deviceMode, currentLayout }) {
  const url = `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/generate-layout`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      prompt: promptText,
      deviceMode,
      currentLayout,
    }),
  });

  const data = await res.json();
  console.log("Respuesta función IA:", data);

  if (!data.success) {
    throw new Error(data.error || "Error generando layout");
  }

  return data.layout;
}
