import { analyzePromptRules } from "./rules";

export function getLayoutContext(layout) {
  return {
    totalElements: layout.length,
    components: layout.map((el) => el.type),
    lastElement: layout[layout.length - 1] || null,
  };
}

export function semanticEngine(prompt, layout) {
  const rules = analyzePromptRules(prompt);
  const context = getLayoutContext(layout);

  let intent = rules.action;
  let targetComponent = rules.component;
  let props = rules.props;
  let semantic = rules.semantic;

  if (semantic.themeAction) {
    intent = "THEME_UPDATE";
    targetComponent = "GLOBAL_THEME";
  }

  if (semantic.themeAction === "clean") {
    intent = "GLOBAL_CLEANUP";
  }

  if (targetComponent === "unknown" && context.lastElement) {
    targetComponent = context.lastElement.type;
  }

  if (intent === "MOVE" && targetComponent === "unknown" && context.lastElement) {
    targetComponent = context.lastElement.type;
  }

  if (intent === "DUPLICATE" && targetComponent === "unknown" && context.lastElement) {
    targetComponent = context.lastElement.type;
  }

  return {
    intent,
    targetComponent,
    props,
    semantic,
    layoutContext: context,
    rawPrompt: prompt,
  };
}
