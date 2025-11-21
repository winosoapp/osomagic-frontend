// ============================================================================
// OSOMAGIC 2.0 — LeftSidebar.jsx (Versión final, ANCHO REAL COMO LOVABLE)
// ============================================================================
import React, { useEffect, useRef, useState } from "react";
import { useEditor } from "../context/EditorContext.jsx";

// ------------------------------------------------------------
// FORMATEO DEL TIMESTAMP
// ------------------------------------------------------------
const formatTimestamp = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ------------------------------------------------------------
// SIDEBAR COMPLETO (ANCHO 340px real, SIN CORTES, SCROLL PERFECTO)
// ------------------------------------------------------------
const LeftSidebar = () => {
  const { messages } = useEditor();
  const scrollRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <aside
      style={{
        width: collapsed ? "62px" : "340px", // 340px exacto como LOVABLE ❤️
        transition: "width 0.25s ease",
        height: "100vh",
        background: "#f8fafc",
        borderRight: "1px solid rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "18px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        {!collapsed && (
          <h2
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: "700",
              color: "#0f172a",
              textTransform: "uppercase",
            }}
          >
            Historial
          </h2>
        )}

        <button
          onClick={() => setCollapsed((v) => !v)}
          style={{
            border: "none",
            background: "transparent",
            fontSize: "18px",
            cursor: "pointer",
            color: "#475569",
          }}
        >
          {collapsed ? "⟩" : "⟨"}
        </button>
      </div>

      {/* SCROLL AREA */}
      {!collapsed && (
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "18px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            boxSizing: "border-box",
          }}
        >
          {messages.map((msg, index) => (
            <ChatBubble
              key={`${msg.createdAt || "no-date"}-${index}`}
              role={msg.role}
              text={msg.text}
              createdAt={msg.createdAt}
            />
          ))}
        </div>
      )}

      {/* FOOTER */}

      {!collapsed && (
        <div
          style={{
            padding: "14px 16px",
            borderTop: "1px solid rgba(0,0,0,0.06)",
            display: "flex",
            gap: "12px",
            background: "#f8fafc",
          }}
        >
          <button style={pillBtnStyle}>＋</button>
          <button style={pillBtnStyle}>Visual edits</button>
        </div>
      )}
    </aside>
  );
};

// ------------------------------------------------------------
// BOTONES "Píldora"
// ------------------------------------------------------------
const pillBtnStyle = {
  padding: "6px 14px",
  borderRadius: "999px",
  background: "#020617",
  color: "#ffffff",
  border: "none",
  fontSize: "13px",
  cursor: "pointer",
};

// ------------------------------------------------------------
// BURBUJAS DE CHAT — estilo LOVABLE
// ------------------------------------------------------------
const ChatBubble = ({ role, text, createdAt }) => {
  const isUser = role === "user";

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        alignItems: "flex-end",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      {/* Avatar IA */}
      {!isUser && (
        <div
          style={{
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            background: "#0f172a",
            color: "#fff",
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          IA
        </div>
      )}

      {/* Burbuja */}
      <div
        style={{
          maxWidth: "78%",
          background: isUser ? "#ff8a3c" : "#0f172a",
          color: "#ffffff",
          padding: "10px 14px",
          borderRadius: "14px",
          fontSize: "14px",
          lineHeight: "1.45",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <span>{text}</span>
        <span
          style={{
            fontSize: "11px",
            opacity: 0.7,
            alignSelf: "flex-end",
          }}
        >
          {formatTimestamp(createdAt)}
        </span>
      </div>

      {/* Avatar usuario */}
      {isUser && (
        <div
          style={{
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            background: "#ff8a3c",
            color: "#fff",
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Tú
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
