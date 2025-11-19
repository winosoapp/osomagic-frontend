// ============================================================================
// EditorContext.jsx — FASE 2 + FASE 3 COMPLETA (VERSIÓN FINAL DEFINITIVA)
// Sistema de IDs profesionales + Normalización + Árbol seguro + Layout Engines
// ============================================================================

import React, { createContext, useContext, useState } from "react";

// ============================================================================
// ⚙️ UTILIDADES BASE
// ============================================================================

// Timestamp ISO (antes de initialMessages)
const now = () => new Date().toISOString();

// ============================================================================
// 💬 MENSAJES INICIALES DEL CHAT
// ============================================================================

const initialMessages = [
  {
    id: 1,
    role: "assistant",
    text: "Voy a crear un panel profesional con sidebar, métricas y gráficas.",
    createdAt: now(),
  },
  {
    id: 2,
    role: "assistant",
    text: "Diseño limpio estilo OSOMAGIC.",
    createdAt: now(),
  },
  {
    id: 3,
    role: "user",
    text: "Hazme un panel",
    createdAt: now(),
  },
];

// ============================================================================
// 🧠 CONTEXTO GLOBAL DEL EDITOR
// ============================================================================

const EditorContext = createContext(null);

// ============================================================================
// 🆔 SISTEMA DE IDs PROFESIONALES
// ============================================================================

function generateId(type, name = "item") {
  const cleanType = String(type || "node")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

  const cleanName = String(name || "item")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

  const rand = Math.floor(Math.random() * 99999);

  return `${cleanType}-${cleanName}-${rand}`;
}

function generateNodeId(component, hint = "item") {
  const map = {
    Page: "page",
    Section: "section",
    Heading: "heading",
    Text: "text",
    Button: "button",
    ButtonGroup: "buttongroup",
    HeroText: "hero-text",
    HeroMedia: "hero-media",
    KpiGrid: "kpi-grid",
    KpiCard: "kpi-card",
    ChartGrid: "chart-grid",
    Chart: "chart",
    FeatureGrid: "feature-grid",
    FeatureCard: "feature-card",
    PricingGrid: "pricing-grid",
    PricingCard: "pricing-card",
  };

  return generateId(map[component] || "node", hint);
}

function assignIdsDeep(node) {
  if (!node) return null;

  const cloned = { ...node };

  if (!cloned.id || !/^[a-z0-9-]+-\d{1,5}$/i.test(cloned.id)) {
    cloned.id = generateNodeId(cloned.component || "node", cloned.component);
  }

  if (cloned.children) {
    cloned.children = cloned.children.map(assignIdsDeep);
  }

  return cloned;
}

function validateNoDuplicateIds(tree) {
  const seen = new Set();
  let ok = true;

  const walk = (n) => {
    if (!n) return;

    if (seen.has(n.id)) ok = false;
    seen.add(n.id);

    n.children?.forEach(walk);
  };

  walk(tree);
  return ok;
}

// ============================================================================
// 🔧 NORMALIZACIÓN DEL ÁRBOL
// ============================================================================

const cloneTree = (n) => JSON.parse(JSON.stringify(n));

function sanitizeNode(n) {
  if (!n) return null;

  const node = { ...n };

  node.props = node.props || {};
  node.layout = node.layout || {};
  node.style = node.style || {};

  node.children = Array.isArray(node.children) ? node.children : [];
  node.children = node.children.map(sanitizeNode);

  return node;
}

function normalizeNode(node) {
  const n = sanitizeNode(node);

  if (n.component === "Page") {
    n.layout.padding ??= 24;
    n.layout.gap ??= 18;
  }

  if (n.component === "Section") {
    n.layout.gap ??= 16;
  }

  if (n.component === "Button") {
    n.props.variant ??= "primary";
  }

  n.children = n.children.map(normalizeNode);
  return n;
}

function normalizeLayoutTree(tree) {
  if (!tree) return tree;

  let t = assignIdsDeep(tree);
  t = normalizeNode(t);
  validateNoDuplicateIds(t);

  return t;
}

// ============================================================================
// 🔍 HELPERS DE RECORRIDO Y BÚSQUEDA
// ============================================================================

const forEachNode = (n, fn) => {
  fn(n);
  n.children?.forEach((c) => forEachNode(c, fn));
};

export const findNodeById = (n, id) => {
  if (n.id === id) return n;

  for (const child of n.children || []) {
    const r = findNodeById(child, id);
    if (r) return r;
  }

  return null;
};

export const findAllByType = (n, type) => {
  const res = [];
  forEachNode(n, (x) => {
    if (x.component === type) res.push(x);
  });
  return res;
};

/* ============================================================================
   🔶 GENERADORES DE PÁGINA — Dashboard, Landing, Pricing
============================================================================ */

const generateDashboardTree = () => ({
  id: generateNodeId("Page", "dashboard"),
  component: "Page",
  children: [
    {
      id: generateNodeId("Section", "kpis"),
      component: "Section",
      children: [
        {
          id: generateNodeId("KpiGrid", "grid"),
          component: "KpiGrid",
          children: [
            {
              id: generateNodeId("KpiCard", "1"),
              component: "KpiCard",
              props: { title: "Ingresos", value: "$45,231", change: "+12%" },
            },
            {
              id: generateNodeId("KpiCard", "2"),
              component: "KpiCard",
              props: { title: "Usuarios", value: "8.932", change: "+4%" },
            },
          ],
        },
      ],
    },
    {
      id: generateNodeId("Section", "charts"),
      component: "Section",
      children: [
        {
          id: generateNodeId("ChartGrid", "charts"),
          component: "ChartGrid",
          children: [
            {
              id: generateNodeId("Chart", "revenue"),
              component: "Chart",
              props: { title: "Ingresos mensuales", variant: "gradient" },
            },
            {
              id: generateNodeId("Chart", "activity"),
              component: "Chart",
              props: { title: "Actividad", variant: "bars" },
            },
          ],
        },
      ],
    },
  ],
});

/* ============================================================================
   LANDING PAGE GENERATOR
============================================================================ */
const generateLandingTree = () => ({
  id: generateNodeId("Page", "landing"),
  component: "Page",
  children: [
    {
      id: generateNodeId("Section", "hero"),
      component: "Section",
      props: { variant: "hero" },
      children: [
        {
          id: generateNodeId("HeroText", "text"),
          component: "HeroText",
          children: [
            {
              id: generateNodeId("Text", "kicker"),
              component: "Text",
              props: { variant: "kicker" },
              content: "PLATAFORMA TODO EN UNO",
            },
            {
              id: generateNodeId("Heading", "h1"),
              component: "Heading",
              props: { level: 1 },
              content: "Lanza y gestiona tu proyecto sin escribir código",
            },
            {
              id: generateNodeId("Text", "sub"),
              component: "Text",
              props: { variant: "subtitle" },
              content: "Editor inteligente por prompts.",
            },
            {
              id: generateNodeId("ButtonGroup", "grp"),
              component: "ButtonGroup",
              children: [
                {
                  id: generateNodeId("Button", "pri"),
                  component: "Button",
                  props: { variant: "primary" },
                  content: "Empezar",
                },
                {
                  id: generateNodeId("Button", "sec"),
                  component: "Button",
                  props: { variant: "ghost" },
                  content: "Ver demo",
                },
              ],
            },
          ],
        },
        {
          id: generateNodeId("HeroMedia", "media"),
          component: "HeroMedia",
        },
      ],
    },
  ],
});

/* ============================================================================
   PRICING PAGE GENERATOR
============================================================================ */
const generatePricingTree = () => ({
  id: generateNodeId("Page", "pricing"),
  component: "Page",
  children: [
    {
      id: generateNodeId("Section", "header"),
      component: "Section",
      children: [
        {
          id: generateNodeId("Heading", "h1"),
          component: "Heading",
          props: { level: 1 },
          content: "Planes y precios",
        },
        {
          id: generateNodeId("Text", "sub"),
          component: "Text",
          props: { variant: "subtitle" },
          content: "Elige el plan que mejor se adapte a tu proyecto",
        },
      ],
    },
    {
      id: generateNodeId("Section", "grid"),
      component: "Section",
      children: [
        {
          id: generateNodeId("PricingGrid", "pricing-grid"),
          component: "PricingGrid",
          children: [
            {
              id: generateNodeId("PricingCard", "start"),
              component: "PricingCard",
              props: {
                label: "Starter",
                price: "0€",
                subtitle: "Para empezar",
                features: ["1 proyecto", "500 usuarios"],
              },
            },
            {
              id: generateNodeId("PricingCard", "pro"),
              component: "PricingCard",
              props: {
                label: "Pro",
                price: "29€",
                subtitle: "Todo lo necesario",
                highlight: true,
                features: ["Proyectos ilimitados", "IA avanzada"],
              },
            },
          ],
        },
      ],
    },
  ],
});

/* ============================================================================
   🔶 DETECTAR TIPO DE PÁGINA
============================================================================ */
const detectPageTypeFromPrompt = (prompt) => {
  const p = prompt.toLowerCase();
  if (p.includes("landing") || p.includes("home")) return "landing";
  if (p.includes("precio") || p.includes("pricing")) return "pricing";
  if (p.includes("dashboard") || p.includes("panel")) return "dashboard";
  return null;
};

/* ============================================================================
   🔶 HELPERS FASE 3 — Secciones, hero, etc.
============================================================================ */
const findSections = (root) => {
  const out = [];
  forEachNode(root, (n) => {
    if (n.component === "Section") out.push(n);
  });
  return out;
};

const findFirstHeading1 = (n) => {
  let found = null;
  forEachNode(n, (x) => {
    if (!found && x.component === "Heading" && x.props?.level === 1) {
      found = x;
    }
  });
  return found;
};

const findFirstButtonGroup = (n) => {
  let found = null;
  forEachNode(n, (x) => {
    if (!found && x.component === "ButtonGroup") found = x;
  });
  return found;
};

const findHeroSection = (tree) => {
  let found = null;
  forEachNode(tree, (n) => {
    if (!found && n.component === "Section" && n.props?.variant === "hero")
      found = n;
  });
  return found;
};
/* ============================================================================
   🔶 OPERACIONES DE EDICIÓN — TITULARES, HERO, BOTONES, TAMAÑOS, ETC.
============================================================================ */

const changeMainTitle = (tree, newTitle) => {
  const cloned = cloneTree(tree);
  const h1 = findFirstHeading1(cloned);

  if (!h1)
    return { tree: cloned, success: false, message: "No encuentro un título principal (H1)." };

  h1.content = newTitle;
  return {
    tree: cloned,
    success: true,
    message: `He actualizado el título principal a: "${newTitle}".`,
  };
};

const changeHeadingSize = (tree, mode) => {
  const cloned = cloneTree(tree);
  const h1 = findFirstHeading1(cloned);

  if (!h1)
    return { tree: cloned, success: false, message: "No he encontrado ningún H1 para editar." };

  const current = parseInt(h1.style?.fontSize || 24, 10);
  const newSize = mode === "bigger" ? current + 4 : Math.max(14, current - 4);

  h1.style = { ...h1.style, fontSize: newSize };

  return {
    tree: cloned,
    success: true,
    message: mode === "bigger" ? "He aumentado el tamaño del H1." : "He reducido el tamaño del H1.",
  };
};

const addButtonToHero = (tree, label) => {
  const cloned = cloneTree(tree);
  const group = findFirstButtonGroup(cloned);

  if (!group)
    return {
      tree: cloned,
      success: false,
      message: "No existe ningún grupo de botones en el hero.",
    };

  group.children.push({
    id: generateNodeId("Button", "extra"),
    component: "Button",
    props: { variant: "primary" },
    content: label || "Nuevo botón",
  });

  return { tree: cloned, success: true, message: "Botón añadido correctamente." };
};

const setAllButtonsPrimary = (tree) => {
  const cloned = cloneTree(tree);

  forEachNode(cloned, (n) => {
    if (n.component === "Button") {
      n.props.variant = "primary";
    }
  });

  return { tree: cloned, success: true, message: "Todos los botones han sido pintados en naranja." };
};

const setHeroBackground = (tree, mode) => {
  const cloned = cloneTree(tree);
  const hero = findHeroSection(cloned);

  if (!hero)
    return { tree: cloned, success: false, message: "No encuentro la sección de hero." };

  const themes = {
    dark: { background: "#020617", color: "#f8fafc" },
    light: { background: "#ffffff", color: "#0f172a" },
    orange: { background: "#fff7ed", color: "#7c2d12" },
    gradient: {
      background: "linear-gradient(135deg,#f97316,#ea580c)",
      color: "#ffffff",
    },
  };

  hero.style = { ...hero.style, ...(themes[mode] || themes.dark) };

  return { tree: cloned, success: true, message: "He actualizado el fondo del hero." };
};

/* ============================================================================
   🔶 OPERACIONES DE SECCIONES — MOVER, DUPLICAR, ELIMINAR, CREAR NUEVA
============================================================================ */

const moveSectionInTree = (tree, targetId, direction) => {
  const cloned = cloneTree(tree);

  if (!Array.isArray(cloned.children))
    return { tree: cloned, success: false, message: "No hay secciones para mover." };

  const index = cloned.children.findIndex((s) => s.id === targetId);
  if (index === -1)
    return { tree: cloned, success: false, message: "No encuentro la sección indicada." };

  if (direction === "up") {
    if (index === 0)
      return { tree: cloned, success: false, message: "Esa sección ya está arriba del todo." };

    [cloned.children[index - 1], cloned.children[index]] = [
      cloned.children[index],
      cloned.children[index - 1],
    ];

    return { tree: cloned, success: true, message: "Sección movida hacia arriba." };
  }

  if (direction === "down") {
    if (index === cloned.children.length - 1)
      return { tree: cloned, success: false, message: "Esa sección ya está abajo del todo." };

    [cloned.children[index + 1], cloned.children[index]] = [
      cloned.children[index],
      cloned.children[index + 1],
    ];

    return { tree: cloned, success: true, message: "Sección movida hacia abajo." };
  }

  return { tree: cloned, success: false, message: "No he entendido la dirección del movimiento." };
};

const duplicateSectionInTree = (tree, id) => {
  const cloned = cloneTree(tree);

  const idx = cloned.children.findIndex((x) => x.id === id);
  if (idx === -1)
    return { tree: cloned, success: false, message: "No encuentro la sección para duplicar." };

  const copy = assignIdsDeep(cloneTree(cloned.children[idx]));
  cloned.children.splice(idx + 1, 0, copy);

  return { tree: cloned, success: true, message: "Sección duplicada correctamente." };
};

const removeLastSection = (tree) => {
  const cloned = cloneTree(tree);

  if (!cloned.children.length)
    return { tree: cloned, success: false, message: "No hay secciones para eliminar." };

  cloned.children.pop();

  return { tree: cloned, success: true, message: "Última sección eliminada." };
};

/* ============================================================================
   🔶 MOTOR DE INTERPRETACIÓN DE PROMPTS
============================================================================ */

const applyEditCommand = (tree, prompt) => {
  const txt = prompt.toLowerCase();

  if (!tree.children?.length)
    return { tree, changed: false, message: "No hay ningún layout cargado aún." };

  // Cambiar tamaño del H1
  if (txt.includes("h1") && txt.includes("más grande")) return changeHeadingSize(tree, "bigger");
  if (txt.includes("h1") && txt.includes("más pequeño")) return changeHeadingSize(tree, "smaller");

  // Cambiar título principal
  if (txt.includes("cambia") && txt.includes("título")) {
    const idx = txt.lastIndexOf(" a ");
    const newTitle = idx !== -1 ? prompt.substring(idx + 3).trim() : prompt;
    return changeMainTitle(tree, newTitle);
  }

  // Fondo hero
  if (txt.includes("fondo") && txt.includes("hero")) {
    const mode =
      txt.includes("oscuro") || txt.includes("negro")
        ? "dark"
        : txt.includes("claro") || txt.includes("blanco")
        ? "light"
        : txt.includes("naranja")
        ? "orange"
        : txt.includes("degrad") || txt.includes("gradient")
        ? "gradient"
        : "dark";

    return setHeroBackground(tree, mode);
  }

  // Botones primarios
  if (txt.includes("botones") && txt.includes("naranja"))
    return setAllButtonsPrimary(tree);

  // Añadir botón al hero
  if (txt.includes("añade") && txt.includes("botón")) {
    const match = prompt.match(/"([^"]+)"/);
    return addButtonToHero(tree, match?.[1] || "Nuevo botón");
  }

  // Mover secciones
  if (txt.includes("mueve") || txt.includes("sube") || txt.includes("baja")) {
    const allSections = findSections(tree);
    if (!allSections.length)
      return { tree, changed: false, message: "No encuentro secciones en el diseño." };

    const target = allSections[allSections.length - 1]; // siempre la que está "abajo"
    const dir = txt.includes("arriba") ? "up" : "down";

    return moveSectionInTree(tree, target.id, dir);
  }

  // Duplicar sección
  if (txt.includes("duplica") || txt.includes("clona"))
    return duplicateSectionInTree(tree, findSections(tree)[0].id);

  // Eliminar última sección
  if (txt.includes("elimina") && txt.includes("sección"))
    return removeLastSection(tree);

  return {
    tree,
    changed: false,
    message:
      "He recibido tu instrucción, pero no está soportada todavía. Puedes cambiar el fondo del hero, mover secciones, duplicar, añadir botones, cambiar el título, etc.",
  };
};

/* ============================================================================
   🔶 ESTADO GLOBAL DEL EDITOR + PROVIDER
============================================================================ */

export const EditorProvider = ({ children }) => {
  const [currentProject] = useState({ id: "demo", name: "OSOMAGIC" });
  const [route, setRoute] = useState("/");
  const [viewMode, setViewMode] = useState("desktop");
  const [isPreviewActive, setIsPreviewActive] = useState(true);
  const [messages, setMessages] = useState(initialMessages);
  const [layoutHistory, setLayoutHistory] = useState([]);

  const [layoutTree, setLayoutTree] = useState({
    id: generateNodeId("Page", "empty"),
    component: "Page",
    children: [],
  });

  const sendPrompt = (text) => {
    if (!text?.trim()) return;

    const promptText = text.trim();
    const lower = promptText.toLowerCase();
    const pageType = detectPageTypeFromPrompt(promptText);

    const isEdit =
      lower.includes("cambia") ||
      lower.includes("mueve") ||
      lower.includes("duplica") ||
      lower.includes("añade") ||
      lower.includes("modifica") ||
      lower.includes("sube") ||
      lower.includes("baja") ||
      lower.includes("sección");

    let newTree = layoutTree;
    let responseMessage = "";

    if (pageType && !isEdit) {
      // Crear nueva página
      if (pageType === "landing") newTree = generateLandingTree();
      if (pageType === "dashboard") newTree = generateDashboardTree();
      if (pageType === "pricing") newTree = generatePricingTree();

      responseMessage = `He generado una página base tipo ${pageType}.`;
    } else {
      // Editar página existente
      const edit = applyEditCommand(layoutTree, promptText);
      newTree = edit.tree;
      responseMessage = edit.message;
    }

    setLayoutHistory((prev) => [...prev.slice(-9), layoutTree]);

    const cleaned = normalizeLayoutTree(newTree);
    setLayoutTree(cleaned);

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text: promptText, createdAt: now() },
      { id: Date.now() + 1, role: "assistant", text: responseMessage, createdAt: now() },
    ]);
  };

  return (
    <EditorContext.Provider
      value={{
        currentProject,
        route,
        setRoute,
        viewMode,
        setViewMode,
        isPreviewActive,
        setIsPreviewActive,
        messages,
        sendPrompt,
        layoutTree,
        setLayoutTree,
        layoutHistory,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
};
