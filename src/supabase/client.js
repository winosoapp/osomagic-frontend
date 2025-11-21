import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// ----------------------------------------------
// AUTOLOGIN DEMO USER (usuario real de Supabase)
// ----------------------------------------------
export async function ensureDemoUser() {
  const { data: session } = await supabase.auth.getSession();

  if (session?.session) {
    // Ya logueado → nada que hacer
    return session.session.user;
  }

  // 🔐 Login automático del usuario demo real
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "alvaro@osomagic.com",
    password: "12345678",
  });

  if (error) {
    console.error("Error haciendo login automático DEMO:", error);
    return null;
  }

  return data.user;
}
