// src/context/Renderer.jsx
import React from "react";

/*
  Renderer LOVABLE PRO — Versión estable
  --------------------------------------
  - Respeta props.style (incluye fondo dinámico hero)
  - Renderiza todos los componentes soportados por el motor
  - No genera duplicados ni layouts corruptos
*/

export const renderNode = (node) => {
  if (!node) return null;

  const {
    component,
    children = [],
    content,
    props = {},
    style = {},
  } = node;

  const renderChildren = () =>
    children.map((c) => (
      <React.Fragment key={c.id}>{renderNode(c)}</React.Fragment>
    ));

  /* =========================================================================
     PAGE WRAPPER
  ========================================================================= */
  if (component === "Page") {
    return (
      <div
        className="os-canvas-content"
        style={{
          ...style,
        }}
      >
        {renderChildren()}
      </div>
    );
  }

  /* =========================================================================
     SECTION — con soporte de estilo dinámico
  ========================================================================= */
  if (component === "Section") {
    // HERO especial estilo Lovable
    if (
      props?.variant === "hero" ||
      node.id?.includes("hero") ||
      style?.background
    ) {
      const textBlock = children.find((c) => c.component === "HeroText");
      const media = children.find((c) => c.component === "HeroMedia");

      return (
        <section
          className="os-landing-hero"
          style={{
            ...style, // permite cambiar fondo/color por IA
            padding: "26px 24px",
            borderRadius: "14px",
          }}
        >
          <div className="os-landing-text">
            {textBlock?.children?.map((c) => (
              <React.Fragment key={c.id}>{renderNode(c)}</React.Fragment>
            ))}
          </div>

          {media && (
            <div className="os-landing-hero-card" style={media.style || {}} />
          )}
        </section>
      );
    }

    return (
      <section className="os-section" style={style}>
        {renderChildren()}
      </section>
    );
  }

  /* =========================================================================
     HEADINGS
  ========================================================================= */
  if (component === "Heading") {
    const level = props.level || 2;
    const Tag = `h${Math.min(Math.max(level, 1), 3)}`;

    const className =
      level === 1
        ? "os-heading-1"
        : level === 2
        ? "os-heading-2"
        : "os-heading-3";

    return (
      <Tag className={className} style={style}>
        {content}
      </Tag>
    );
  }

  /* =========================================================================
     TEXT
  ========================================================================= */
  if (component === "Text") {
    let className = "os-text";
    if (props.variant === "subtitle") className += " os-text-sub";
    if (props.variant === "kicker") className += " os-text-kicker";

    return (
      <p className={className} style={style}>
        {content}
      </p>
    );
  }

  /* =========================================================================
     BUTTONS
  ========================================================================= */
  if (component === "ButtonGroup") {
    return (
      <div className="os-landing-actions" style={style}>
        {renderChildren()}
      </div>
    );
  }

  if (component === "Button") {
    let className = "os-small-btn";
    if (props.variant === "primary") className += " os-small-btn-primary";
    if (props.variant === "ghost") className += " os-small-btn-ghost";
    if (props.variant === "outline") className += " os-small-btn-outline";

    return (
      <button className={className} style={style}>
        {content}
      </button>
    );
  }

  /* =========================================================================
     KPI CARDS
  ========================================================================= */
  if (component === "KpiGrid") {
    return <div className="os-kpi-grid">{renderChildren()}</div>;
  }

  if (component === "KpiCard") {
    const { title, value, change, tone } = props;
    return (
      <article className="os-kpi-card">
        <h3>{title}</h3>
        <p className="os-kpi-value">{value}</p>
        <p className={`os-kpi-change ${tone || ""}`}>{change}</p>
      </article>
    );
  }

  /* =========================================================================
     CHARTS
  ========================================================================= */
  if (component === "ChartGrid") {
    return <div className="os-charts-grid">{renderChildren()}</div>;
  }

  if (component === "Chart") {
    const { title, variant } = props;
    return (
      <div className="os-chart-card">
        <h2>{title}</h2>
        <div
          className={
            "os-chart-placeholder " +
            (variant === "bars" ? "bars" : "gradient")
          }
        />
      </div>
    );
  }

  /* =========================================================================
     FEATURES
  ========================================================================= */
  if (component === "FeatureGrid") {
    return <div className="os-feature-grid">{renderChildren()}</div>;
  }

  if (component === "FeatureCard") {
    const { title, text } = props;
    return (
      <article className="os-feature-card">
        <h3>{title}</h3>
        <p>{text}</p>
      </article>
    );
  }

  /* =========================================================================
     PRICING
  ========================================================================= */
  if (component === "PricingGrid") {
    return <div className="os-pricing-grid">{renderChildren()}</div>;
  }

  if (component === "PricingCard") {
    const { label, price, subtitle, highlight, features = [] } = props;
    return (
      <article
        className={
          "os-pricing-card " +
          (highlight ? "os-pricing-card-highlight" : "")
        }
      >
        <h3>{label}</h3>
        <p className="os-pricing-price">{price}</p>
        <p className="os-pricing-sub">{subtitle}</p>

        <ul className="os-pricing-list">
          {features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>

        <button className="os-small-btn os-small-btn-primary">
          Empezar con {label}
        </button>
      </article>
    );
  }

  /* =========================================================================
     DEFAULT (nodos desconocidos)
  ========================================================================= */
  return null;
};
