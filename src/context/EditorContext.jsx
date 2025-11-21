// ============================================================================
// EditorContext.jsx — FASE 2 + FASE 3 + FASE 5.7 (IA REAL)
// Sistema de IDs + Normalización + Árbol seguro + Layout Engines
// + Persistencia en Supabase (projects + project_versions)
// + Autosave, versiones, duplicar, borrar, realtime, lock local
// + Envío de prompts a IA REAL (useAIHandler)
// ============================================================================

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { supabase } from "../supabase/client.js";
import { useAIHandler } from "../ai/useAIHandler";

// ============================================================================
// ⚙️ UTILIDADES BASE
// ============================================================================

// Timestamp ISO
const now = () => new Date().toISOString();

// Autosave
const AUTO_SAVE_DELAY = 1500;

// Lock local
const LOCAL_LOCK_KEY = "osomagic-editor-lock";

// Canal realtime
const REALTIME_CHANNEL = "osomagic-project-channel";

// ============================================================================
// 💬 MENSAJES INICIALES
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
// 🧠 CONTEXTO GLOBAL
// ============================================================================

const EditorContext = createContext(null);

// ============================================================================
// 🆔 SISTEMA DE IDs
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
    ButtonGroup: "button-group",
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

  if (!cloned.id) {
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
// 🔧 NORMALIZACIÓN
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
// 🔍 HELPERS
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

// 🔁 MERGE DE LAYOUTS (NO BORRAR, SIEMPRE SUMAR)
function mergeLayouts(oldTree, newTree) {
  if (!oldTree) return newTree;
  if (!newTree) return oldTree;

  const merged = { ...oldTree };

  // Fusionar props, styles, layout
  merged.props = { ...(oldTree.props || {}), ...(newTree.props || {}) };
  merged.style = { ...(oldTree.style || {}), ...(newTree.style || {}) };
  merged.layout = { ...(oldTree.layout || {}), ...(newTree.layout || {}) };

  // Añadir nodos nuevos debajo de los antiguos
  merged.children = [
    ...(oldTree.children || []),
    ...(newTree.children || []),
  ];

  return merged;
}

// ============================================================================
// 🔶 GENERADORES DE PÁGINAS
// ============================================================================

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
// LANDING PAGE GENERATOR
// ==========================================================================*/

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
// PRICING PAGE GENERATOR
// ==========================================================================*/

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
// 🔶 DETECTAR TIPO DE PÁGINA
// ==========================================================================*/

const detectPageTypeFromPrompt = (prompt) => {
  const p = prompt.toLowerCase();
  if (p.includes("landing") || p.includes("home")) return "landing";
  if (p.includes("precio") || p.includes("pricing")) return "pricing";
  if (p.includes("dashboard") || p.includes("panel")) return "dashboard";
  return null;
};

/* ============================================================================
// 🔶 HELPERS FASE 3 — Secciones, hero, etc.
// ==========================================================================*/

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
    if (!found && n.component === "Section" && n.props?.variant === "hero") {
      found = n;
    }
  });
  return found;
};

/* ============================================================================
// 🔶 OPERACIONES DE EDICIÓN — TITULARES, HERO, BOTONES, TAMAÑOS
// ==========================================================================*/

const changeMainTitle = (tree, newTitle) => {
  const cloned = cloneTree(tree);
  const h1 = findFirstHeading1(cloned);

  if (!h1) {
    return {
      tree: cloned,
      success: false,
      message: "No encuentro un título principal (H1).",
    };
  }

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

  if (!h1) {
    return {
      tree: cloned,
      success: false,
      message: "No he encontrado ningún H1 para editar.",
    };
  }

  const current = parseInt(h1.style?.fontSize || 24, 10);
  const newSize =
    mode === "bigger" ? current + 4 : Math.max(14, current - 4);

  h1.style = { ...h1.style, fontSize: newSize };

  return {
    tree: cloned,
    success: true,
    message:
      mode === "bigger"
        ? "He aumentado el tamaño del H1."
        : "He reducido el tamaño del H1.",
  };
};

const addButtonToHero = (tree, label) => {
  const cloned = cloneTree(tree);
  const group = findFirstButtonGroup(cloned);

  if (!group) {
    return {
      tree: cloned,
      success: false,
      message: "No existe ningún grupo de botones en el hero.",
    };
  }

  group.children = group.children || [];
  group.children.push({
    id: generateNodeId("Button", "extra"),
    component: "Button",
    props: { variant: "primary" },
    content: label || "Nuevo botón",
  });

  return {
    tree: cloned,
    success: true,
    message: "Botón añadido correctamente.",
  };
};

const setAllButtonsPrimary = (tree) => {
  const cloned = cloneTree(tree);

  forEachNode(cloned, (n) => {
    if (n.component === "Button") {
      n.props = n.props || {};
      n.props.variant = "primary";
    }
  });

  return {
    tree: cloned,
    success: true,
    message: "Todos los botones han sido pintados en naranja.",
  };
};

const setHeroBackground = (tree, mode) => {
  const cloned = cloneTree(tree);
  const hero = findHeroSection(cloned);

  if (!hero) {
    return {
      tree: cloned,
      success: false,
      message: "No encuentro la sección de hero.",
    };
  }

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

  return {
    tree: cloned,
    success: true,
    message: "He actualizado el fondo del hero.",
  };
};

/* ============================================================================
// 🔶 OPERACIONES DE SECCIONES — MOVER, DUPLICAR, ELIMINAR
// ==========================================================================*/

const moveSectionInTree = (tree, targetId, direction) => {
  const cloned = cloneTree(tree);

  if (!Array.isArray(cloned.children)) {
    return {
      tree: cloned,
      success: false,
      message: "No hay secciones para mover.",
    };
  }

  const index = cloned.children.findIndex((s) => s.id === targetId);
  if (index === -1) {
    return {
      tree: cloned,
      success: false,
      message: "No encuentro la sección indicada.",
    };
  }

  if (direction === "up") {
    if (index === 0) {
      return {
        tree: cloned,
        success: false,
        message: "Esa sección ya está arriba del todo.",
      };
    }

    [cloned.children[index - 1], cloned.children[index]] = [
      cloned.children[index],
      cloned.children[index - 1],
    ];

    return {
      tree: cloned,
      success: true,
      message: "Sección movida hacia arriba.",
    };
  }

  if (direction === "down") {
    if (index === cloned.children.length - 1) {
      return {
        tree: cloned,
        success: false,
        message: "Esa sección ya está abajo del todo.",
      };
    }

    [cloned.children[index + 1], cloned.children[index]] = [
      cloned.children[index],
      cloned.children[index + 1],
    ];

    return {
      tree: cloned,
      success: true,
      message: "Sección movida hacia abajo.",
    };
  }

  return {
    tree: cloned,
    success: false,
    message: "No he entendido la dirección del movimiento.",
  };
};

const duplicateSectionInTree = (tree, id) => {
  const cloned = cloneTree(tree);

  const idx = cloned.children.findIndex((x) => x.id === id);
  if (idx === -1) {
    return {
      tree: cloned,
      success: false,
      message: "No encuentro la sección para duplicar.",
    };
  }

  const copy = assignIdsDeep(cloneTree(cloned.children[idx]));
  cloned.children.splice(idx + 1, 0, copy);

  return {
    tree: cloned,
    success: true,
    message: "Sección duplicada correctamente.",
  };
};

const removeLastSection = (tree) => {
  const cloned = cloneTree(tree);

  if (!cloned.children.length) {
    return {
      tree: cloned,
      success: false,
      message: "No hay secciones para eliminar.",
    };
  }

  cloned.children.pop();

  return {
    tree: cloned,
    success: true,
    message: "Última sección eliminada.",
  };
};

/* ============================================================================
// 🔶 MOTOR DE INTERPRETACIÓN DE PROMPTS (EDICIONES LOCALES)
// ==========================================================================*/

const applyEditCommand = (tree, prompt) => {
  const txt = prompt.toLowerCase();

  if (!tree.children?.length) {
    return {
      tree,
      changed: false,
      message: "No hay ningún layout cargado aún.",
    };
  }

  // Cambiar tamaño del H1
  if (txt.includes("h1") && txt.includes("más grande")) {
    return changeHeadingSize(tree, "bigger");
  }
  if (txt.includes("h1") && txt.includes("más pequeño")) {
    return changeHeadingSize(tree, "smaller");
  }

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
  if (txt.includes("botones") && txt.includes("naranja")) {
    return setAllButtonsPrimary(tree);
  }

  // Añadir botón al hero
  if (txt.includes("añade") && txt.includes("botón")) {
    const match = prompt.match(/"([^"]+)"/);
    return addButtonToHero(tree, match?.[1] || "Nuevo botón");
  }

  // Mover secciones
  if (txt.includes("mueve") || txt.includes("sube") || txt.includes("baja")) {
    const allSections = findSections(tree);
    if (!allSections.length) {
      return {
        tree,
        changed: false,
        message: "No encuentro secciones en el diseño.",
      };
    }

    const target = allSections[allSections.length - 1]; // la última
    const dir = txt.includes("arriba") ? "up" : "down";

    return moveSectionInTree(tree, target.id, dir);
  }

  // Duplicar sección
  if (txt.includes("duplica") || txt.includes("clona")) {
    const allSections = findSections(tree);
    if (!allSections.length) {
      return {
        tree,
        changed: false,
        message: "No hay secciones que duplicar.",
      };
    }
    return duplicateSectionInTree(tree, allSections[0].id);
  }

  // Eliminar última sección
  if (txt.includes("elimina") && txt.includes("sección")) {
    return removeLastSection(tree);
  }

  return {
    tree,
    changed: false,
    message:
      "He recibido tu instrucción, pero no está soportada todavía. Puedes cambiar el fondo del hero, mover secciones, duplicar, añadir botones, cambiar el título, etc.",
  };
};

/* ============================================================================
   🔶 ESTADO GLOBAL DEL EDITOR + PROVIDER (FASE 2 + FASE 3 + FASE 5.7)
============================================================================ */

export const EditorProvider = ({ children }) => {
  // Datos del proyecto "lógico" (nombre / tipo)
  const [currentProject, setCurrentProject] = useState({
    id: null, // id uuid en Supabase
    name: "OSOMAGIC demo",
    description: "Proyecto demo del editor OSOMAGIC",
    type: "ai",
  });

  // ID real en Supabase (projects.id uuid)
  const [projectId, setProjectId] = useState(null);

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

  // Estado Fase 3
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [isLockedByOther, setIsLockedByOther] = useState(false);
  const [hasRemoteChanges, setHasRemoteChanges] = useState(false);

  const saveTimeoutRef = useRef(null);
  const clientIdRef = useRef(`client-${Math.random().toString(36).slice(2)}`);

  // ================================
  // IA REAL (FASE 5.7) — CHAT
  // ================================
  const addChatMessage = (msg) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: msg.role,
        text: msg.text,
        createdAt: now(),
      },
    ]);
  };

  const { loading, sendPrompt: sendPromptAI } = useAIHandler({
    layout: layoutTree,
    setLayout: setLayoutTree,
    projectId,
    addChatMessage,
  });

  // --------------------------------------
  // LOCK LOCAL (misma máquina / navegador)
  // --------------------------------------
  const acquireLocalLock = () => {
    try {
      const existing = window.localStorage.getItem(LOCAL_LOCK_KEY);

      if (existing && existing !== clientIdRef.current) {
        setIsLockedByOther(true);
        console.warn(
          "OSOMAGIC: este proyecto ya se está editando en otra pestaña."
        );
        return false;
      }

      window.localStorage.setItem(LOCAL_LOCK_KEY, clientIdRef.current);

      window.addEventListener("beforeunload", () => {
        window.localStorage.removeItem(LOCAL_LOCK_KEY);
      });

      setIsLockedByOther(false);
      return true;
    } catch (err) {
      console.error("Error en acquireLocalLock:", err);
      return true;
    }
  };

  const releaseLocalLock = () => {
    try {
      const existing = window.localStorage.getItem(LOCAL_LOCK_KEY);

      if (existing && existing === clientIdRef.current) {
        window.localStorage.removeItem(LOCAL_LOCK_KEY);
      }
    } catch (err) {
      console.error("Error en releaseLocalLock:", err);
    }
  };

  // --------------------------------------
  // 3.4 / 3.7 — GUARDAR PROYECTO EN SUPABASE
  // --------------------------------------
  const saveProjectToSupabase = async (treeToSave) => {
    try {
      setIsSaving(true);

      // 1️⃣ Obtener usuario autenticado (obligatorio para RLS)
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      if (!userId) {
        console.error("No hay usuario autenticado — no se puede guardar.");
        return;
      }

      // 2️⃣ Payload con user_id obligatorio para RLS
      const payload = {
        user_id: userId,
        name: currentProject.name,
        description: currentProject.description,
        type: currentProject.type,
        layout_tree: treeToSave,
        route,
        view_mode: viewMode,
        updated_at: new Date().toISOString(),
      };

      // 3️⃣ INSERT
      if (!projectId) {
        const { data, error } = await supabase
          .from("projects")
          .insert([payload])
          .select(
            "id, name, description, type, layout_tree, route, view_mode"
          )
          .single();

        if (error) {
          console.error("Error insertando proyecto:", error);
          return;
        }

        setProjectId(data.id);
        setCurrentProject((prev) => ({
          ...prev,
          id: data.id,
        }));
      } else {
        // 4️⃣ UPDATE (también debe incluir user_id)
        const { error } = await supabase
          .from("projects")
          .update(payload)
          .eq("id", projectId);

        if (error) {
          console.error("Error actualizando proyecto:", error);
          return;
        }
      }

      const ts = new Date().toISOString();
      setLastSavedAt(ts);
      setHasRemoteChanges(false);
    } catch (err) {
      console.error("Error inesperado guardando proyecto:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // --------------------------------------
  // Debounce autosave
  // --------------------------------------
  const scheduleAutosave = (treeToSave) => {
    if (isLockedByOther) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveProjectToSupabase(treeToSave);
    }, AUTO_SAVE_DELAY);
  };

  // --------------------------------------
  // 3.4 — CREAR VERSIÓN (project_versions)
  // --------------------------------------
  const createVersionSnapshot = async (treeToSave) => {
    if (!projectId) return;

    try {
      const { data: last } = await supabase
        .from("project_versions")
        .select("version_number")
        .eq("project_id", projectId)
        .order("version_number", { ascending: false })
        .limit(1);

      const lastVersion = last?.[0]?.version_number || 0;
      const nextVersion = lastVersion + 1;

      const payload = {
        project_id: projectId,
        version_number: nextVersion,
        changes: {
          layout_tree: treeToSave,
          route,
          view_mode: viewMode,
          saved_at: now(),
        },
      };

      await supabase.from("project_versions").insert(payload);
    } catch (err) {
      console.error("Error creando versión:", err);
    }
  };

  // --------------------------------------
  // DUPLICAR / BORRAR PROYECTO
  // --------------------------------------
  const duplicateCurrentProject = async () => {
    if (!projectId) return null;

    try {
      const payload = {
        name: `${currentProject.name} (copia)`,
        description: currentProject.description,
        type: currentProject.type,
        layout_tree: layoutTree,
        route,
        view_mode: viewMode,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("projects")
        .insert([payload])
        .select("id")
        .single();

      if (error) {
        console.error("Error duplicando proyecto:", error);
        return null;
      }

      return data.id;
    } catch (err) {
      console.error("Error inesperado duplicando proyecto:", err);
      return null;
    }
  };

  const deleteCurrentProject = async () => {
    if (!projectId) return;

    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) {
        console.error("Error borrando proyecto:", error);
        return;
      }

      // Reset
      setProjectId(null);
      setCurrentProject({
        id: null,
        name: "OSOMAGIC demo",
        description: "Proyecto demo del editor OSOMAGIC",
        type: "ai",
      });

      setLayoutTree({
        id: generateNodeId("Page", "empty"),
        component: "Page",
        children: [],
      });

      setRoute("/");
      setViewMode("desktop");
    } catch (err) {
      console.error("Error inesperado borrando proyecto:", err);
    }
  };

  // --------------------------------------
  // 3.4 — CARGAR PROYECTO al entrar
  // --------------------------------------
  const loadProjectFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, description, type, layout_tree, route, view_mode")
        .order("created_at", { ascending: true })
        .limit(1);

      if (error) {
        console.warn("No he podido cargar el proyecto:", error.message);
        return;
      }

      const row = data?.[0];

      if (!row) {
        // Insertar proyecto inicial
        const initPayload = {
          name: "OSOMAGIC demo",
          description: "Proyecto demo del editor OSOMAGIC",
          type: "ai",
          layout_tree: null,
          route: "/",
          view_mode: "desktop",
        };

        const { data: created, error: errInsert } = await supabase
          .from("projects")
          .insert([initPayload])
          .select(
            "id, name, description, type, layout_tree, route, view_mode"
          )
          .single();

        if (errInsert) {
          console.error("Error creando proyecto inicial:", errInsert);
          return;
        }

        setProjectId(created.id);

        if (created.layout_tree) {
          setLayoutTree(normalizeLayoutTree(created.layout_tree));
        }

        setRoute(created.route || "/");
        setViewMode(created.view_mode || "desktop");
        return;
      }

      // YA EXISTE → cargarlo
      setProjectId(row.id);

      setCurrentProject((prev) => ({
        ...prev,
        id: row.id,
        name: row.name || prev.name,
        description: row.description || prev.description,
        type: row.type || prev.type,
      }));

      if (row.layout_tree) {
        setLayoutTree(normalizeLayoutTree(row.layout_tree));
      }
      if (row.route) setRoute(row.route);
      if (row.view_mode) setViewMode(row.view_mode);
    } catch (err) {
      console.error("Error cargando proyecto:", err);
    }
  };

  // Cargar proyecto + lock local al montar
  useEffect(() => {
    acquireLocalLock();
    loadProjectFromSupabase();

    return () => {
      releaseLocalLock();
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------------------------
  // REALTIME — escuchar cambios remotos
  // --------------------------------------
  useEffect(() => {
    if (!projectId) return;

    const channel = supabase
      .channel(`${REALTIME_CHANNEL}-${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "projects",
          filter: `id=eq.${projectId}`,
        },
        (payload) => {
          const newTree = payload.new?.layout_tree;
          if (!newTree) return;

          setHasRemoteChanges(true);

          setLayoutTree(normalizeLayoutTree(newTree));
          if (payload.new.route) setRoute(payload.new.route);
          if (payload.new.view_mode) setViewMode(payload.new.view_mode);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  // --------------------------------------
  // ENVÍO DE PROMPT (FASE 5.7 — IA REAL) — SIEMPRE ACUMULA
  // --------------------------------------
  const sendPrompt = async (text) => {
    if (!text?.trim()) return;

    if (isLockedByOther) {
      console.warn("OSOMAGIC: proyecto bloqueado en otra pestaña.");
      return;
    }

    // 1️⃣ Añadir mensaje del usuario al chat
    addChatMessage({ role: "user", text });

    // 2️⃣ Enviar prompt a la IA (siempre con el layout actual)
    const aiLayout = await sendPromptAI(text);

    if (!aiLayout) return; // si falla, no seguimos

    // 3️⃣ Normalizar respuesta IA → árbol válido
    const normalizedAI = normalizeLayoutTree(aiLayout);

    // 4️⃣ MERGE REAL: NO BORRES, AÑADE
    const merged = mergeLayouts(layoutTree, normalizedAI);

    // 5️⃣ Guardar en estado
    setLayoutTree(merged);

    // 6️⃣ Autosave
    scheduleAutosave(merged);

    // 7️⃣ Versión
    createVersionSnapshot(merged);

    // 8️⃣ Mensaje de confirmación
    addChatMessage({
      role: "assistant",
      text: "✓ Diseño actualizado",
    });
  };

  // --------------------------------------
  // RETURN FINAL DEL PROVIDER
  // --------------------------------------
  return (
    <EditorContext.Provider
      value={{
        // Proyecto actual
        currentProject,
        projectId,

        // Navegación / vista
        route,
        setRoute,
        viewMode,
        setViewMode,
        isPreviewActive,
        setIsPreviewActive,

        // Chat + motor prompts
        messages,
        sendPrompt,

        // Layout
        layoutTree,
        setLayoutTree,
        layoutHistory,

        // Fase 3
        isSaving,
        lastSavedAt,
        isLockedByOther,
        hasRemoteChanges,
        reloadProject: loadProjectFromSupabase,
        forceSave: () => saveProjectToSupabase(layoutTree),
        createVersionSnapshot: () => createVersionSnapshot(layoutTree),
        duplicateCurrentProject,
        deleteCurrentProject,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

// --------------------------------------
// HOOK PUBLICO
// --------------------------------------
export const useEditor = () => {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
};
