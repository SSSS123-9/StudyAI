// ============================================================
// Sidebar.jsx — Navigation Sidebar
// ============================================================
// Displays the list of modules on the left side.
// Highlights the currently active module.
// Shows a badge count on Progress when quizzes are done.
//
// Props:
//   active    — id of the currently selected module
//   setActive — function to change the active module
//   scores    — array of quiz scores (for badge count)
// ============================================================

import { COLORS as C, MODULES } from "../utils/constants";

export default function Sidebar({ active, setActive, scores }) {
  return (
    <div
      style={{
        width: 200,
        background: C.card,
        borderRight: `1px solid ${C.cardBorder}`,
        padding: "20px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        flexShrink: 0,
        height: "100%",
      }}
    >
      {/* Module navigation buttons */}
      {MODULES.map((m) => (
        <button
          key={m.id}
          onClick={() => setActive(m.id)}
          style={{
            background: active === m.id ? m.color + "22" : "transparent",
            border: `1.5px solid ${active === m.id ? m.color : "transparent"}`,
            borderRadius: 10,
            padding: "11px 14px",
            color: active === m.id ? m.color : C.muted,
            fontFamily: "'Outfit', sans-serif",
            fontWeight: active === m.id ? 700 : 500,
            fontSize: 14,
            cursor: "pointer",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            gap: 10,
            transition: "all 0.18s",
          }}
        >
          <span>{m.icon}</span>
          <span>{m.label}</span>

          {/* Show quiz count badge on Progress tab */}
          {m.id === "progress" && scores.length > 0 && (
            <span
              style={{
                marginLeft: "auto",
                background: C.warn,
                color: C.bg,
                borderRadius: "50%",
                width: 18,
                height: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              {scores.length}
            </span>
          )}
        </button>
      ))}

      {/* Footer info */}
      <div
        style={{
          marginTop: "auto",
          padding: "14px 4px 0",
          borderTop: `1px solid ${C.cardBorder}`,
        }}
      >
        <div style={{ color: C.muted, fontSize: 11, lineHeight: 1.6 }}>
          🎓 Built for SDG 4<br />
          Quality Education<br />
          <span style={{ color: C.accent + "88" }}>Generative AI Course</span>
        </div>
      </div>
    </div>
  );
}
