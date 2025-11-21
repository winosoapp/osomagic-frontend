// ======================================================================
// COMPONENT SCHEMA — OSOMAGIC (versión simplificada, estilo Lovable)
// ======================================================================

export const COMPONENT_SCHEMA = {
  page: {
    allowedChildren: ["section"],
    defaults: {
      layout: { direction: "vertical", gap: 24, padding: 24 },
      style: { backgroundColor: "#ffff" },
    },
  },

  section: {
    allowedChildren: [
      "heading",
      "text",
      "button",
      "card",
      "grid",
      "image",
      "pricingCard",
      "featureCard",
      "chart",
    ],
    defaults: {
      layout: { direction: "vertical", gap: 20, padding: 20 },
      style: {},
    },
  },

  heading: {
    allowedChildren: [],
    defaults: {
      layout: { direction: "vertical", gap: 0, padding: 0 },
      style: { fontSize: 24, fontWeight: 600, color: "#111827" },
      props: { text: "Heading" },
    },
  },

  text: {
    allowedChildren: [],
    defaults: {
      layout: { direction: "vertical", gap: 0, padding: 0 },
      style: { fontSize: 14, color: "#374151" },
      props: { text: "Texto" },
    },
  },

  button: {
    allowedChildren: [],
    defaults: {
      layout: {},
      style: {
        backgroundColor: "#fb923c",
        color: "#ffffff",
        paddingV: 10,
        paddingH: 18,
        borderRadius: 8,
      },
      props: { text: "Click me" },
    },
  },

  card: {
    allowedChildren: ["heading", "text", "button"],
    defaults: {
      layout: { direction: "vertical", gap: 12, padding: 16 },
      style: {
        backgroundColor: "#ffffff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
      },
    },
  },

  grid: {
    allowedChildren: [
      "card",
      "featureCard",
      "pricingCard",
      "chart",
      "heading",
      "text",
    ],
    defaults: {
      layout: { columns: 3, gap: 14 },
      style: {},
    },
  },

  image: {
    allowedChildren: [],
    defaults: {
      layout: {},
      style: {
        width: "100%",
        borderRadius: 12,
      },
      props: { src: "https://via.placeholder.com/1200x600" },
    },
  },

  featureCard: {
    allowedChildren: ["heading", "text"],
    defaults: {
      layout: { direction: "vertical", gap: 10, padding: 14 },
      style: {
        backgroundColor: "#ffffff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#fee2e2",
      },
    },
  },

  pricingCard: {
    allowedChildren: ["heading", "text", "button"],
    defaults: {
      layout: { direction: "vertical", gap: 12, padding: 16 },
      style: {
        backgroundColor: "#ffffff",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#e5e7eb",
      },
    },
  },

  chart: {
    allowedChildren: [],
    defaults: {
      layout: { height: 130 },
      style: {
        backgroundColor: "#eef2ff",
        borderRadius: 10,
      },
      props: { type: "line" },
    },
  },
};
