import React, { useState } from "react";
import { useEditor } from "../context/EditorContext.jsx";
import { SendIcon } from "./Icons.jsx";

/* ----------------------------------------------------
   BOTTOM CHAT — MISMO ANCHO QUE EL SIDEBAR
---------------------------------------------------- */
const BottomChatPanel = () => {
  const { sendPrompt, loading } = useEditor();
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;             // ⬅ evitar doble envío
    if (!value.trim()) return;
    sendPrompt(value);
    setValue("");
  };

  return (
    <section className="os-bottom-chat">
      <form className="os-bottom-form" onSubmit={handleSubmit}>
        <input
          className="os-bottom-input"
          placeholder="Describe qué quieres que construya o modifique…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
        />

        <button type="submit" className="os-send-btn" disabled={loading}>
          {loading ? "•••" : <SendIcon />}
        </button>
      </form>
    </section>
  );
};

export default BottomChatPanel;
