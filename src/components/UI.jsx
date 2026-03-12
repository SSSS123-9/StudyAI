// ============================================================
// UI.jsx — Shared Reusable UI Components
// ============================================================
// These are small building-block components used across all
// the feature modules. Keeping them here avoids repetition.
//
// Components:
//   Card      — a styled container box
//   Btn       — a styled button with hover effects
//   Input     — a styled text input or textarea
//   Spinner   — a loading indicator
//   Badge     — a small colored tag/label
// ============================================================

import { useState } from "react";
import { COLORS as C } from "../utils/constants";

// ─── Card ────────────────────────────────────────────────────
// A styled box used to group related content.
// Props:
//   children — content inside the card
//   style    — optional extra styles
export function Card({ children, style }) {
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 16,
        padding: "24px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Btn ─────────────────────────────────────────────────────
// A styled button with hover fill effect.
// Props:
//   children — button label
//   onClick  — click handler function
//   color    — border/text/hover-fill color
//   disabled — disables the button when true
//   style    — optional extra styles
export function Btn({ children, onClick, color = C.accent, disabled, style }) {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover && !disabled ? color : "transparent",
        border: `1.5px solid ${color}`,
        color: hover && !disabled ? "#0a0f1e" : color,
        borderRadius: 10,
        padding: "10px 22px",
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 600,
        fontSize: 14,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "all 0.18s ease",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ─── Input ───────────────────────────────────────────────────
// A styled input field or textarea.
// Props:
//   value       — controlled value
//   onChange    — setter function (receives string, not event)
//   placeholder — placeholder text
//   multiline   — if true, renders a <textarea> instead
//   rows        — number of rows for textarea (default 4)
//   style       — optional extra styles
export function Input({ value, onChange, placeholder, multiline, rows = 4, style }) {
  const baseStyle = {
    background: C.inputBg,
    border: `1.5px solid ${C.cardBorder}`,
    borderRadius: 10,
    color: C.text,
    padding: "12px 16px",
    fontFamily: "'Outfit', sans-serif",
    fontSize: 14,
    width: "100%",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
    ...style,
  };

  return multiline ? (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={baseStyle}
    />
  ) : (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={baseStyle}
    />
  );
}

// ─── Spinner ─────────────────────────────────────────────────
// A loading indicator shown while waiting for Claude's response.
export function Spinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, color: C.muted, fontSize: 14 }}>
      <div
        style={{
          width: 18,
          height: 18,
          border: `2px solid ${C.cardBorder}`,
          borderTop: `2px solid ${C.accent}`,
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      Thinking...
    </div>
  );
}

// ─── Badge ───────────────────────────────────────────────────
// A small colored label/tag.
// Props:
//   text  — label text
//   color — badge accent color
export function Badge({ text, color }) {
  return (
    <span
      style={{
        background: color + "22",
        color,
        border: `1px solid ${color}44`,
        borderRadius: 6,
        padding: "2px 10px",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {text}
    </span>
  );
}
