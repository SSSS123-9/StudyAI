// ============================================================
// Header.jsx — Top Navigation Bar
// ============================================================
// Displays the app title, subtitle, and status badges.
//
// Props:
//   scores — array of quiz scores (to show "X quizzes done")
// ============================================================

import { COLORS as C } from "../utils/constants";
import { Badge } from "./UI";

export default function Header({ scores }) {
  return (
    <div
      style={{
        background: C.card,
        borderBottom: `1px solid ${C.cardBorder}`,
        padding: "16px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* App title and subtitle */}
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>
          <span style={{ color: C.accent }}>Study</span>
          <span style={{ color: C.accent2 }}>AI</span>
          <span style={{ color: C.text }}> Platform</span>
        </div>
        <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>
          SDG 4 · Quality Education · Powered by Claude
        </div>
      </div>

      {/* Status badges */}
      <div style={{ display: "flex", gap: 6 }}>
        {scores.length > 0 && (
          <Badge text={`${scores.length} quizzes done`} color={C.warn} />
        )}
        <Badge text="AI-Powered" color={C.accent} />
      </div>
    </div>
  );
}
