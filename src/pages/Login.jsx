// ===============================
// Login.jsx — Pantalla mínima
// ===============================

import React, { useState } from "react";
import { supabase } from "../supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // Redirigimos al editor
    window.location.href = "/";
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>OSOMAGIC — Login</h2>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          {errorMsg && <p style={styles.error}>{errorMsg}</p>}

          <button type="submit" style={styles.btn}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f5f5",
  },
  card: {
    width: 340,
    padding: 30,
    borderRadius: 12,
    background: "white",
    boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 22,
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    border: "1px solid #ddd",
    fontSize: 15,
  },
  btn: {
    padding: "12px 0",
    background: "#ff7b00",
    border: "none",
    borderRadius: 8,
    color: "white",
    fontSize: 16,
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
  },
};
