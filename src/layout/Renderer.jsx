// ==========================================================
// OSOMAGIC 2.0 — Renderer.jsx
// Motor de renderizado LOVABLE++ ULTRA
// ==========================================================
import React from "react";

// ----------------------------------------------------------
// TOKENS DE DISEÑO
// ----------------------------------------------------------
const COLOR = {
  bgPage: "#f9fafb",
  bgSection: "#ffffff",
  bgSectionAlt: "#f3f4ff",
  bgSectionDark: "#020617",
  textMain: "#0f172a",
  textSoft: "#6b7280",
  textInverse: "#f9fafb",
  accent: "#ff8a3c",
  accentSoft: "rgba(255,138,60,0.16)",
  accentDark: "#ea580c",
  borderSoft: "rgba(148,163,184,0.35)",
};

const RADIUS = {
  xl: 32,
  lg: 24,
  md: 16,
  sm: 10,
};

const SHADOW = {
  soft: "0 18px 45px rgba(15,23,42,0.08)",
  card: "0 12px 32px rgba(15,23,42,0.08)",
};

const SPACING = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// ----------------------------------------------------------
// HELPERS
// ----------------------------------------------------------
function mergeStyles(base, override) {
  return { ...(base || {}), ...(override || {}) };
}

function nodeId(node, prefix) {
  if (node && node.id) return node.id;
  return `${prefix || "node"}-${Math.random().toString(36).slice(2)}`;
}

function safeArray(value) {
  if (!Array.isArray(value)) return [];
  return value.filter(Boolean);
}

// ----------------------------------------------------------
// COMPONENTES BASE
// ----------------------------------------------------------

// PAGE
function PageComponent({ node, children }) {
  const props = node?.props || {};
  const style = node?.style || {};
  const pageType = props.pageType || "landing";
  const theme = props.theme || "light";

  const isDark = theme === "dark" || pageType === "dashboard";

  const baseStyle = {
    minHeight: "100%",
    padding: "32px 40px",
    backgroundColor: isDark ? "#020617" : COLOR.bgPage,
    display: "flex",
    flexDirection: "column",
    gap: SPACING.xl,
    boxSizing: "border-box",
    borderRadius: RADIUS.xl,
    color: isDark ? COLOR.textInverse : COLOR.textMain,
  };

  const backgroundStyle = isDark
    ? {
        background:
          "radial-gradient(circle at 0% 0%, #1e293b 0, #020617 50%, #000000 100%)",
      }
    : {
        background:
          "radial-gradient(circle at 0% -10%, #ffffff 0, #f9fafb 55%, #e5e7eb 100%)",
      };

  const finalStyle = mergeStyles(mergeStyles(baseStyle, backgroundStyle), style);

  return <div style={finalStyle}>{children}</div>;
}

// SECTION
function SectionComponent({ node, children }) {
  const props = node?.props || {};
  const style = node?.style || {};
  const content = node?.content || "";

  const sectionType = props.sectionType || props.variant || "generic";

  let bg = COLOR.bgSection;
  let padding = "32px 32px";
  let radius = RADIUS.lg;
  let shadow = SHADOW.soft;
  let border = `1px solid ${COLOR.borderSoft}`;
  let marginBottom = SPACING.lg;

  if (sectionType === "navbar" || sectionType === "footer") {
    bg = "transparent";
    padding = "0 8px";
    radius = 0;
    shadow = "none";
    border = "none";
    marginBottom = SPACING.md;
  } else if (sectionType === "hero") {
    bg = COLOR.bgSection;
    padding = "40px 40px";
    radius = 28;
  } else if (
    sectionType === "metrics" ||
    sectionType === "dashboard-metrics"
  ) {
    bg = COLOR.bgSection;
  } else if (sectionType === "cta-final") {
    bg = COLOR.accentSoft;
  }

  const baseStyle = {
    borderRadius: radius,
    padding,
    backgroundColor: bg,
    boxSizing: "border-box",
    boxShadow: shadow,
    border,
    display: "flex",
    flexDirection: "column",
    gap: SPACING.lg,
    marginBottom,
  };

  const finalStyle = mergeStyles(baseStyle, style);

  return (
    <section style={finalStyle}>
      {content ? (
        <p
          style={{
            margin: 0,
            color: COLOR.textSoft,
            fontSize: 14,
          }}
        >
          {content}
        </p>
      ) : null}
      {children}
    </section>
  );
}

// ROW
function RowComponent({ node, children }) {
  const props = node?.props || {};
  const style = node?.style || {};

  const columnsCount =
    props.columns || safeArray(children).length || props.cols || 2;

  const baseStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${columnsCount}, minmax(0, 1fr))`,
    gap: SPACING.lg,
    alignItems: "stretch",
  };

  const finalStyle = mergeStyles(baseStyle, style);

  return <div style={finalStyle}>{children}</div>;
}

// COLUMN
function ColumnComponent({ node, children }) {
  const props = node?.props || {};
  const style = node?.style || {};

  const width = props.width;
  let basis = "0";
  let flexGrow = 1;

  if (width === "1/2") basis = "50%";
  else if (width === "1/3") basis = "33.3333%";
  else if (width === "2/3") basis = "66.6666%";
  else if (width === "1/4") basis = "25%";

  const baseStyle = {
    display: "flex",
    flexDirection: "column",
    gap: SPACING.md,
    flexBasis: basis,
    flexGrow,
    minWidth: 0,
  };

  const finalStyle = mergeStyles(baseStyle, style);

  return <div style={finalStyle}>{children}</div>;
}

// ----------------------------------------------------------
// TEXTO Y TIPOGRAFÍA
// ----------------------------------------------------------
function HeadingComponent({ node }) {
  const props = node?.props || {};
  const style = node?.style || {};
  const content = node?.content || "";

  const level = props.level || 2;
  const align = props.align || "left";
  const variant = props.variant || (level === 1 ? "heroTitle" : "sectionTitle");

  let fontSize = 24;
  let fontWeight = 700;
  let lineHeight = 1.2;
  let color = COLOR.textMain;
  let letterSpacing = "-0.03em";

  if (variant === "heroTitle") {
    fontSize = 40;
    fontWeight = 800;
  } else if (variant === "sectionTitle") {
    fontSize = 26;
  } else if (variant === "eyebrow") {
    fontSize = 13;
    fontWeight = 600;
    letterSpacing = "0.12em";
    color = COLOR.accent;
  }

  const Tag = "h" + Math.min(Math.max(level, 1), 6);

  const baseStyle = {
    margin: 0,
    fontSize,
    fontWeight,
    lineHeight,
    textAlign: align,
    color,
    letterSpacing,
  };

  const finalStyle = mergeStyles(baseStyle, style);

  return React.createElement(Tag, { style: finalStyle }, content);
}

function TextComponent({ node }) {
  const props = node?.props || {};
  const style = node?.style || {};
  const content = node?.content || "";

  const variant = props.variant || "paragraph";
  const align = props.align || "left";

  let fontSize = 15;
  let color = COLOR.textSoft;
  let fontWeight = 400;

  if (variant === "subtitle") fontSize = 16;
  else if (variant === "caption") fontSize = 12;
  else if (variant === "eyebrow") {
    fontSize = 12;
    fontWeight = 600;
    color = COLOR.accent;
  }

  const baseStyle = {
    margin: 0,
    fontSize,
    fontWeight,
    color,
    textAlign: align,
  };

  const finalStyle = mergeStyles(baseStyle, style);

  return <p style={finalStyle}>{content}</p>;
}

// ----------------------------------------------------------
// BUTTONS
// ----------------------------------------------------------
function ButtonComponent({ node }) {
  const props = node?.props || {};
  const style = node?.style || {};
  const content = node?.content || props.text || "Button";

  const variant = props.variant || "primary";
  const size = props.size || "md";

  let padding = "10px 18px";
  let fontSize = 14;
  let bg = COLOR.accent;
  let color = "#ffffff";
  let border = "1px solid transparent";

  if (size === "sm") {
    padding = "6px 12px";
    fontSize = 13;
  } else if (size === "lg") {
    padding = "12px 20px";
    fontSize = 15;
  }

  if (variant === "secondary") {
    bg = "#ffffff";
    color = COLOR.textMain;
    border = "1px solid " + COLOR.borderSoft;
  } else if (variant === "ghost") {
    bg = "transparent";
    color = COLOR.textMain;
    border = "1px solid transparent";
  } else if (variant === "outline") {
    bg = "transparent";
    color = COLOR.accent;
    border = "1px solid " + COLOR.accent;
  }

  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding,
    fontSize,
    fontWeight: 600,
    borderRadius: 999,
    backgroundColor: bg,
    color,
    border,
    cursor: "pointer",
    gap: 8,
    textDecoration: "none",
    boxShadow: variant === "primary" ? SHADOW.card : "none",
    transition:
      "transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",
  };

  const finalStyle = mergeStyles(baseStyle, style);

  return (
    <button
      style={finalStyle}
      type="button"
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      {content}
    </button>
  );
}

// ----------------------------------------------------------
// CARDS
// ----------------------------------------------------------
function CardBase({ children, style, variant }) {
  let bg = "#ffffff";
  let border = "1px solid " + COLOR.borderSoft;
  let shadow = SHADOW.card;

  const baseStyle = {
    borderRadius: RADIUS.md,
    padding: "18px 18px",
    backgroundColor: bg,
    boxShadow: shadow,
    border,
    display: "flex",
    flexDirection: "column",
    gap: SPACING.sm,
    boxSizing: "border-box",
  };

  const finalStyle = mergeStyles(baseStyle, style);

  return <div style={finalStyle}>{children}</div>;
}

function GenericCardComponent({ node, children }) {
  const props = node?.props || {};
  const style = node?.style || {};
  const content = node?.content || "";
  const variant = props.variant || "generic";

  return (
    <CardBase style={style} variant={variant}>
      {props.title ? (
        <HeadingComponent
          node={{
            props: { level: 3, variant: "sectionTitle" },
            content: props.title,
          }}
        />
      ) : null}
      {props.subtitle ? (
        <TextComponent
          node={{
            props: { variant: "subtitle" },
            content: props.subtitle,
          }}
        />
      ) : null}
      {content ? <TextComponent node={{ content }} /> : null}
      {children}
    </CardBase>
  );
}

// (FeatureCard, PricingCard, Image, Chart, Form, Input)
// --- para ahorrar espacio, mantenemos tus implementaciones tal cual ---
// (cópiate aquí las mismas que ya tenías, no hace falta tocarlas)
// ⬇️ ⬇️ ⬇️
/* PEGAR AQUÍ SIN CAMBIAR:
   FeatureCardComponent
   PricingCardComponent
   ImageComponent
   ChartComponent
   FormComponent
   InputComponent
*/
function FeatureCardComponent({ node }) {
  const props = node && node.props ? node.props : {};
  const style = node && node.style ? node.style : {};
  const content = node && node.content ? node.content : "";
  const title = props.title;
  const subtitle = props.subtitle;
  const icon = props.icon;

  return (
    <CardBase style={style} variant="feature">
      {icon ? (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 999,
            backgroundColor: COLOR.accentSoft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 600,
            color: COLOR.accentDark,
          }}
        >
          {icon.toString().slice(0, 2).toUpperCase()}
        </div>
      ) : null}
      {title ? (
        <HeadingComponent
          node={{
            props: { level: 3, variant: "sectionTitle" },
            content: title,
          }}
        />
      ) : null}
      {subtitle || content ? (
        <TextComponent
          node={{
            props: { variant: "paragraph" },
            content: subtitle || content,
          }}
        />
      ) : null}
    </CardBase>
  );
}

function PricingCardComponent({ node }) {
  const props = node && node.props ? node.props : {};
  const style = node && node.style ? node.style : {};
  const label = props.label;
  const price = props.price;
  const period = props.period;
  const subtitle = props.subtitle;
  const highlight = !!props.highlight;
  const features = Array.isArray(props.features) ? props.features : [];
  const ctaText = props.ctaText || "Empezar ahora";

  const baseStyle = {
    border: highlight
      ? "2px solid " + COLOR.accent
      : "1px solid " + COLOR.borderSoft,
    position: "relative",
    overflow: "hidden",
  };

  return (
    <CardBase
      style={mergeStyles(baseStyle, style)}
      variant={highlight ? "pricing-highlight" : "pricing"}
    >
      {highlight ? (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 8px",
            borderRadius: 999,
            backgroundColor: COLOR.accent,
            color: "#ffffff",
          }}
        >
          Más popular
        </div>
      ) : null}
      {label ? (
        <HeadingComponent
          node={{
            props: { level: 3, variant: "sectionTitle" },
            content: label,
          }}
        />
      ) : null}
      {subtitle ? (
        <TextComponent
          node={{
            props: { variant: "subtitle" },
            content: subtitle,
          }}
        />
      ) : null}
      {price || period ? (
        <div
          style={{
            marginTop: SPACING.sm,
            marginBottom: SPACING.sm,
            display: "flex",
            alignItems: "baseline",
            gap: 6,
          }}
        >
          {price ? (
            <span
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: COLOR.textMain,
              }}
            >
              {price}
            </span>
          ) : null}
          {period ? (
            <span
              style={{
                fontSize: 13,
                color: COLOR.textSoft,
              }}
            >
              / {period}
            </span>
          ) : null}
        </div>
      ) : null}
      {features.length > 0 ? (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            fontSize: 13,
            color: COLOR.textSoft,
          }}
        >
          {features.map(function (f, idx) {
            return (
              <li
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    marginTop: 6,
                    backgroundColor: COLOR.accent,
                    flexShrink: 0,
                  }}
                />
                <span>{f}</span>
              </li>
            );
          })}
        </ul>
      ) : null}
      {ctaText ? (
        <div style={{ marginTop: SPACING.md }}>
          <ButtonComponent
            node={{
              props: {
                variant: highlight ? "primary" : "secondary",
                size: "md",
              },
              content: ctaText,
            }}
          />
        </div>
      ) : null}
    </CardBase>
  );
}

// ----------------------------------------------------------
// IMAGE & CHART (placeholders bonitos tipo dashboard)
// ----------------------------------------------------------
function ImageComponent({ node }) {
  const props = node && node.props ? node.props : {};
  const style = node && node.style ? node.style : {};
  const src = props.src;
  const alt = props.alt || "Imagen de ejemplo";

  const baseStyle = {
    width: "100%",
    height: 260,
    borderRadius: RADIUS.md,
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,250,252,1))",
    border: "1px solid " + COLOR.borderSoft,
    boxShadow: SHADOW.card,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: COLOR.textSoft,
    fontSize: 13,
    fontWeight: 500,
    overflow: "hidden",
  };

  const finalStyle = mergeStyles(baseStyle, style);

  return (
    <div style={finalStyle}>
      {src ? <span>{alt}</span> : <span>Vista previa / mockup</span>}
    </div>
  );
}

function ChartComponent({ node }) {
  const props = node && node.props ? node.props : {};
  const style = node && node.style ? node.style : {};
  const title = props.title;
  const chartType = props.chartType || props.variant || "bar";
  const metric = props.metric;

  const baseStyle = {
    borderRadius: RADIUS.md,
    padding: "16px 16px 12px 16px",
    background:
      "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,64,175,0.95))",
    color: "#e5e7eb",
    boxShadow: SHADOW.card,
    display: "flex",
    flexDirection: "column",
    gap: SPACING.sm,
  };

  const finalStyle = mergeStyles(baseStyle, style);

  return (
    <div style={finalStyle}>
      {title ? (
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {title}
        </div>
      ) : null}
      {metric ? (
        <div
          style={{
            fontSize: 11,
            color: "rgba(226,232,240,0.85)",
          }}
        >
          {metric}
        </div>
      ) : null}
      <div
        style={{
          marginTop: 8,
          height: 140,
          borderRadius: 10,
          background:
            "repeating-linear-gradient(to right, rgba(15,23,42,0.4) 0, rgba(15,23,42,0.4) 1px, transparent 1px, transparent 14px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "flex-end",
            gap: 6,
            padding: "6px 10px",
            boxSizing: "border-box",
          }}
        >
          {Array.from({ length: 8 }).map(function (_, i) {
            const heightPercent = 35 + ((i * 13) % 55);
            const color =
              chartType === "line" || chartType === "area"
                ? "rgba(56,189,248,0.9)"
                : "rgba(251,191,36,0.95)";
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  borderRadius: 999,
                  backgroundColor: color,
                  height: heightPercent + "%",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------
// FORM / INPUT (para apps de contabilidad, roles, etc.)
// ----------------------------------------------------------
function FormComponent({ node, children }) {
  const style = node && node.style ? node.style : {};

  const baseStyle = {
    display: "flex",
    flexDirection: "column",
    gap: SPACING.md,
  };

  const finalStyle = mergeStyles(baseStyle, style);

  return <form style={finalStyle}>{children}</form>;
}

function InputComponent({ node }) {
  const props = node && node.props ? node.props : {};
  const style = node && node.style ? node.style : {};
  const label = props.label;
  const placeholder = props.placeholder || "";
  const type = props.type || "text";

  const wrapperStyle = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  };

  const labelStyle = {
    fontSize: 13,
    fontWeight: 500,
    color: COLOR.textMain,
  };

  const inputStyle = mergeStyles(
    {
      padding: "8px 10px",
      borderRadius: 10,
      border: "1px solid " + COLOR.borderSoft,
      fontSize: 14,
      outline: "none",
      backgroundColor: "#ffffff",
    },
    style
  );

  return (
    <div style={wrapperStyle}>
      {label ? <label style={labelStyle}>{label}</label> : null}
      <input
        type={type}
        placeholder={placeholder}
        style={inputStyle}
        readOnly
      />
    </div>
  );
}
// ----------------------------------------------------------
// REGISTRO DE COMPONENTES
// ----------------------------------------------------------
const componentMap = {
  Page: PageComponent,
  page: PageComponent,
  Section: SectionComponent,
  section: SectionComponent,
  Row: RowComponent,
  row: RowComponent,
  Column: ColumnComponent,
  column: ColumnComponent,
  Heading: HeadingComponent,
  heading: HeadingComponent,
  Text: TextComponent,
  text: TextComponent,
  Button: ButtonComponent,
  button: ButtonComponent,
  Image: ImageComponent,
  image: ImageComponent,
  Card: GenericCardComponent,
  card: GenericCardComponent,
  FeatureCard: FeatureCardComponent,
  featureCard: FeatureCardComponent,
  PricingCard: PricingCardComponent,
  pricingCard: PricingCardComponent,
  Chart: ChartComponent,
  chart: ChartComponent,
  Form: FormComponent,
  form: FormComponent,
  Input: InputComponent,
  input: InputComponent,
};

// ----------------------------------------------------------
// RENDER RECURSIVO
// ----------------------------------------------------------
export function RenderNode({ node, depth }) {
  if (!node || typeof node !== "object") return null;

  // Reparar nodos vacíos enviados por la IA
  if (!node.component || node.component === "" || node.component === null) {
    node.component = "Column";
  }

  const children = safeArray(node.children);

  let rawName = (node.component || node.type || "Card").toString().trim();

  // Normalización OSOMAGIC
  const normalizeMap = {
    "page-root": "Page",
    "hero-section": "Section",
    "hero-row": "Row",
    "grid-row": "Row",
    "grid-col": "Column",
    "kpi-grid": "Row",
    "kpi-card": "Card",
  };

  if (normalizeMap[rawName]) rawName = normalizeMap[rawName];

  // fallback si el componente no existe
  let Comp = componentMap[rawName];
  if (!Comp) {
    Comp = ({ children }) => (
      <div style={{ padding: 16, border: "1px dashed #ddd" }}>{children}</div>
    );
  }

  return (
    <Comp node={node}>
      {children.map((child, i) => (
        <RenderNode
          key={nodeId(child, rawName.toLowerCase()) + "-" + i}
          node={child}
          depth={(depth || 0) + 1}
        />
      ))}
    </Comp>
  );
}


// ----------------------------------------------------------
// RENDERER PRINCIPAL
// ----------------------------------------------------------
export default function Renderer({ layout }) {
  let root = layout;

  // 1) Si es string JSON
  if (typeof root === "string") {
    try {
      root = JSON.parse(root);
    } catch {
      root = null;
    }
  }

  // 2) Si es array → lo convertimos en página
  if (Array.isArray(root)) {
    if (root.length === 1) {
      root = root[0];
    } else {
      root = {
        component: "Page",
        props: {},
        children: root,
      };
    }
  }

  // 3) Si no hay nada todavía → canvas blanco vacío
  if (!root || typeof root !== "object") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#ffffff",
          borderRadius: RADIUS.lg,
        }}
      />
    );
  }

  // 4) Caso especial: la IA manda "page-root"
  if (
    (root.component === "page-root" || root.type === "page-root") &&
    Array.isArray(root.children) &&
    root.children.length === 1
  ) {
    root = root.children[0];
  }

  return <RenderNode node={root} depth={0} />;
}
