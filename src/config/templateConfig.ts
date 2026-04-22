/**
 * Template Configuration System
 * Defines available templates and their layer configurations
 * Used by the Layers & Visibility panel to auto-generate UI
 */

export interface LayerConfig {
  id: string;
  label: string;
}

export interface TemplateConfig {
  id: string;
  name: string;
  availableLayers: LayerConfig[];
}

export const TEMPLATE_CONFIGS: Record<string, TemplateConfig> = {
  PUPPET_MASTER: {
    id: "PUPPET_MASTER",
    name: "Puppet Master",
    availableLayers: [
      { id: "hand", label: "Puppet Hand Rig" },
      { id: "brain", label: "Neural Brain" },
      { id: "text", label: "Kinetic Text" }
    ]
  },
  BAR_CHART: {
    id: "BAR_CHART",
    name: "Bar Chart",
    availableLayers: [
      { id: "bars", label: "Data Bars" },
      { id: "labels", label: "Data Labels" },
      { id: "text", label: "Title & Text" }
    ]
  },
  CHART_CRASH: {
    id: "CHART_CRASH",
    name: "Chart Crash",
    availableLayers: [
      { id: "chart", label: "Chart Visualization" },
      { id: "text", label: "Kinetic Text" }
    ]
  },
  CROWD_SCALE: {
    id: "CROWD_SCALE",
    name: "Crowd Scale",
    availableLayers: [
      { id: "crowd", label: "Crowd Elements" },
      { id: "text", label: "Text Overlay" }
    ]
  },
  PRODUCT_SHOWCASE: {
    id: "PRODUCT_SHOWCASE",
    name: "Product Showcase",
    availableLayers: [
      { id: "product", label: "Product Image" },
      { id: "text", label: "Title & Description" }
    ]
  },
  TRIPLE_BUILD: {
    id: "TRIPLE_BUILD",
    name: "Triple Build",
    availableLayers: [
      { id: "elements", label: "Build Elements" },
      { id: "text", label: "Kinetic Text" }
    ]
  },
  BOOK_REVEAL: {
    id: "BOOK_REVEAL",
    name: "Book Reveal",
    availableLayers: [
      { id: "book", label: "Book Imagery" },
      { id: "text", label: "Book Info" }
    ]
  },
  KINETIC_ROADMAP: {
    id: "KINETIC_ROADMAP",
    name: "Kinetic Roadmap",
    availableLayers: [
      { id: "roadmap", label: "Roadmap Path" },
      { id: "icons", label: "Milestone Icons" },
      { id: "text", label: "Labels & Text" }
    ]
  },
  MINDSET_FLOW: {
    id: "MINDSET_FLOW",
    name: "Mindset Flow",
    availableLayers: [
      { id: "images", label: "Flow Images" },
      { id: "text", label: "Text Overlay" }
    ]
  },
  DARK_WEALTH: {
    id: "DARK_WEALTH",
    name: "Dark Wealth",
    availableLayers: [
      { id: "card", label: "Credit Card" },
      { id: "coin", label: "Coin & Currency" },
      { id: "text", label: "Wealth Text" }
    ]
  },
  KINETIC_SPEAKER: {
    id: "KINETIC_SPEAKER",
    name: "Kinetic Speaker",
    availableLayers: [
      { id: "speaker", label: "Speaker" },
      { id: "text", label: "Text Animation" }
    ]
  },
  CAPITAL_VS_ATTENTION: {
    id: "CAPITAL_VS_ATTENTION",
    name: "Capital vs Attention",
    availableLayers: [
      { id: "comparison", label: "Comparison Visuals" },
      { id: "text", label: "Text Elements" }
    ]
  },
  CHRONO: {
    id: "CHRONO",
    name: "Chrono",
    availableLayers: [
      { id: "timeline", label: "Timeline" },
      { id: "text", label: "Time Labels" }
    ]
  },
  VERSUS: {
    id: "VERSUS",
    name: "Versus",
    availableLayers: [
      { id: "left", label: "Left Side" },
      { id: "right", label: "Right Side" },
      { id: "text", label: "Versus Text" }
    ]
  },
  LINE_CHART: {
    id: "LINE_CHART",
    name: "Line Chart",
    availableLayers: [
      { id: "line", label: "Line Graph" },
      { id: "grid", label: "Grid Background" },
      { id: "labels", label: "Data Labels" }
    ]
  },
  KINETIC_STOMP: {
    id: "KINETIC_STOMP",
    name: "Kinetic Stomp",
    availableLayers: [
      { id: "stomp", label: "Stomp Animation" },
      { id: "text", label: "Kinetic Text" }
    ]
  },
  CHASE_ATTENTION: {
    id: "CHASE_ATTENTION",
    name: "Chase Attention",
    availableLayers: [
      { id: "chase", label: "Chase Animation" },
      { id: "text", label: "Text Callout" }
    ]
  },
  FOCUS: {
    id: "FOCUS",
    name: "Focus",
    availableLayers: [
      { id: "focus", label: "Focus Element" },
      { id: "text", label: "Text Overlay" }
    ]
  },
  LISTICLE: {
    id: "LISTICLE",
    name: "Listicle",
    availableLayers: [
      { id: "text", label: "Main Title" },
      { id: "items", label: "List Items" }
    ]
  },
  TRIPLE_SHOWCASE: {
    id: "TRIPLE_SHOWCASE",
    name: "Triple Showcase",
    availableLayers: [
      { id: "cards", label: "Gallery Cards" },
      { id: "text", label: "Title & Text" }
    ]
  }
};

/**
 * Get template config by ID
 * Returns default template if not found
 */
export function getTemplateConfig(templateId: string): TemplateConfig {
  return TEMPLATE_CONFIGS[templateId] || TEMPLATE_CONFIGS.BAR_CHART;
}

/**
 * Get available layer IDs for a template
 * Useful for initializing active layers state
 */
export function getDefaultActiveLayers(templateId: string): Record<string, boolean> {
  const config = getTemplateConfig(templateId);
  const layers: Record<string, boolean> = {};
  config.availableLayers.forEach(layer => {
    layers[layer.id] = true;
  });
  return layers;
}
