// ============================================================
// constants.js — Shared Colors and Module Definitions
// ============================================================
// Instead of repeating color values in every file, we define
// them once here and import them wherever needed.
// ============================================================

// Color palette for the entire app
export const COLORS = {
  bg:          "#0a0f1e",   // Dark navy background
  card:        "#111827",   // Slightly lighter card background
  cardBorder:  "#1e2d45",   // Subtle border color
  accent:      "#38bdf8",   // Sky blue  → Doubt Solver
  accent2:     "#818cf8",   // Indigo    → Quiz Generator
  accent3:     "#34d399",   // Green     → Study Planner
  warn:        "#fbbf24",   // Amber     → Progress Tracker
  pink:        "#f472b6",   // Pink      → Summarizer
  text:        "#e2e8f0",   // Light grey text
  muted:       "#64748b",   // Dimmed/secondary text
  inputBg:     "#0d1528",   // Input field background
};

// Navigation modules shown in the sidebar
export const MODULES = [
  { id: "doubt",    icon: "💡", label: "Doubt Solver",    color: COLORS.accent  },
  { id: "quiz",     icon: "🧪", label: "Quiz Generator",  color: COLORS.accent2 },
  { id: "planner",  icon: "📅", label: "Study Planner",   color: COLORS.accent3 },
  { id: "progress", icon: "📊", label: "Progress",        color: COLORS.warn    },
  { id: "summary",  icon: "🗂️", label: "Summarizer",      color: COLORS.pink    },
];
