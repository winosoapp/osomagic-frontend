import React, { useEffect, useRef, useState } from "react";
import { useEditor } from "../context/EditorContext.jsx";

/* ----------------------------------------------------
   FORMATEO DEL TIMESTAMP (hora estilo Lovable)
---------------------------------------------------- */
const formatTimestamp = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* ----------------------------------------------------
   SIDEBAR COMPLETO + MODO COLAPSADO (1/5 ancho)
---------------------------------------------------- */
const LeftSidebar = () => {
  const { messages } = useEditor();
  const scrollRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);

  // Auto-scroll hacia abajo
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <aside className={`os-sidebar ${collapsed ? "os-sidebar-collapsed" : ""}`}>
      {/* HEADER */}
      <div className="os-sidebar-header">
        <h2 className="os-sidebar-title">Historial</h2>

        {/* Botón colapsar */}
        <button
          className="os-sidebar-collapse-btn"
          onClick={() => setCollapsed((v) => !v)}
        >
          {collapsed ? "⟩" : "⟨"}
        </button>
      </div>

      {/* CHAT SCROLL */}
      {!collapsed && (
        <div className="os-sidebar-chat-scroll" ref={scrollRef}>
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              role={msg.role}
              text={msg.text}
              createdAt={msg.createdAt}
            />
          ))}
        </div>
      )}

      {/* FOOTER */}
      {!collapsed && (
        <div className="os-sidebar-footer">
          <button className="os-pill-btn">＋</button>
          <button className="os-pill-btn">Visual edits</button>
        </div>
      )}
    </aside>
  );
};

/* ----------------------------------------------------
   BURBUJA DE CHAT (estilo LOVABLE)
---------------------------------------------------- */
const ChatBubble = ({ role, text, createdAt }) => {
  const isUser = role === "user";

  return (
    <div className={`os-chat-row ${isUser ? "os-chat-user" : "os-chat-ai"}`}>
      {!isUser && <div className="os-chat-avatar">IA</div>}

      <div
        className={`os-chat-bubble-wrapper ${
          isUser ? "os-chat-bubble-user-wrap" : "os-chat-bubble-ai-wrap"
        }`}
      >
        <div
          className={`os-chat-bubble ${
            isUser ? "os-chat-bubble-user" : "os-chat-bubble-ai"
          }`}
        >
          <p className="os-chat-text">{text}</p>
          <span className="os-chat-time">{formatTimestamp(createdAt)}</span>
        </div>
      </div>

      {isUser && (
        <div className="os-chat-avatar os-chat-avatar-user">Tú</div>
      )}
    </div>
  );
};

export default LeftSidebar;
