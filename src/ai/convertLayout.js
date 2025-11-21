// Convierte layouts del Edge Function → Formato OSOMAGIC interno

export function convertEdgeLayoutToOsomagic(raw) {
  if (!raw || typeof raw !== "object") return null;

  const mapComponent = (type) => {
    const table = {
      page: "Page",
      section: "Section",
      text: "Text",
      heading: "Heading",
      button: "Button",
    };
    return table[type] || "Div";
  };

  const walk = (node) => {
    if (!node) return null;

    return {
      id: node.id || crypto.randomUUID(),
      component: mapComponent(node.type),
      props: node.props || {},
      style: node.style || {},
      content: node.props?.text || null,
      children: (node.children || []).map(walk),
    };
  };

  return walk(raw);
}
