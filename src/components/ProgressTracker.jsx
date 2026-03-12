// ============================================================
// ProgressTracker.jsx — Module 4: Progress Tracker
// ============================================================
// Displays the student's quiz history as visual bar charts
// and lets them get AI-generated improvement tips.
//
// KEY CONCEPTS LEARNED:
//   ✅ Lifting state up — scores come from parent App.jsx
//   ✅ Derived data (calculating avg, best score from array)
//   ✅ Custom bar chart built with plain divs + CSS
//   ✅ Conditional rendering based on data availability
// ============================================================

import { useState } from "react";
import { callClaude } from "../utils/claude";
import { COLORS as C } from "../utils/constants";
import { Card, Btn, Spinner } from "./UI";

const SYSTEM_PROMPT = `You are a supportive and insightful academic coach.
A student has shared their quiz performance history with you.
Analyze it and provide exactly 3 specific, actionable improvement tips.
Be encouraging but honest. Point out patterns (e.g. difficulty with hard quizzes, 
specific weak topics). Keep your response under 150 words total.`;

// Props:
//   scores — array of {topic, difficulty, score, total, date} from App.jsx
export default function ProgressTracker({ scores }) {
  const [tip, setTip] = useState("");
  const [loading, setLoading] = useState(false);

  async function getAIAdvice() {
    if (!scores.length) return;
    setLoading(true);

    // Format the score history into a readable string for Claude
    const scoreHistory = scores
      .map((s) => `${s.topic} (${s.difficulty}): ${s.score}/${s.total} on ${s.date}`)
      .join("\n");

    const result = await callClaude(
      SYSTEM_PROMPT,
      `Here is my quiz history:\n${scoreHistory}\n\nPlease give me 3 improvement tips.`
    );
    setTip(result);
    setLoading(false);
  }

  // Derived statistics calculated from the scores array
  const totalQuizzes = scores.length;
  const avgScore =
    totalQuizzes > 0
      ? (
          (scores.reduce((sum, s) => sum + s.score / s.total, 0) / totalQuizzes) *
          100
        ).toFixed(1)
      : 0;
  const bestScore =
    totalQuizzes > 0
      ? Math.max(...scores.map((s) => Math.round((s.score / s.total) * 100)))
      : 0;

  // Empty state — shown before any quizzes are taken
  if (scores.length === 0) {
    return (
      <div>
        <h2 style={{ color: C.warn, margin: "0 0 4px", fontSize: 22, fontWeight: 700 }}>
          📊 Progress Tracker
        </h2>
        <p style={{ color: C.muted, margin: "0 0 20px", fontSize: 13 }}>
          Track your quiz performance over time
        </p>
        <div style={{ color: C.muted, textAlign: "center", padding: 60, fontSize: 14 }}>
          🧪 Complete some quizzes in the Quiz Generator to see your progress here!
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Module header */}
      <h2 style={{ color: C.warn, margin: "0 0 4px", fontSize: 22, fontWeight: 700 }}>
        📊 Progress Tracker
      </h2>
      <p style={{ color: C.muted, margin: "0 0 20px", fontSize: 13 }}>
        Your quiz performance at a glance
      </p>

      {/* Summary stat cards */}
      <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        <StatCard value={totalQuizzes} label="Quizzes Taken" color={C.warn} />
        <StatCard value={`${avgScore}%`} label="Avg Score" color={C.accent3} />
        <StatCard value={`${bestScore}%`} label="Best Score" color={C.accent2} />
      </div>

      {/* Quiz history with custom bar chart */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ color: C.text, fontWeight: 600, marginBottom: 14, fontSize: 14 }}>
          Quiz History
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {scores.map((s, i) => {
            const percentage = Math.round((s.score / s.total) * 100);
            // Color-code bars: green=good, yellow=ok, red=needs work
            const barColor =
              percentage >= 80 ? C.accent3 : percentage >= 50 ? C.warn : "#f87171";

            return (
              <div key={i}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: C.text, fontSize: 13 }}>{s.topic}</span>
                  <span style={{ color: barColor, fontSize: 13, fontWeight: 700 }}>
                    {s.score}/{s.total} · {percentage}%
                  </span>
                </div>
                {/* Custom bar — width is set as a percentage */}
                <div
                  style={{
                    background: C.inputBg,
                    borderRadius: 6,
                    height: 8,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${percentage}%`,
                      height: "100%",
                      background: barColor,
                      borderRadius: 6,
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
                <div style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>
                  {s.difficulty} difficulty · {s.date}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* AI advice button */}
      <Btn onClick={getAIAdvice} disabled={loading} color={C.warn}>
        {loading ? "Analyzing..." : "🤖 Get AI Improvement Tips"}
      </Btn>

      {loading && <div style={{ marginTop: 12 }}><Spinner /></div>}

      {/* AI tips output */}
      {tip && (
        <Card style={{ marginTop: 14, borderColor: C.warn + "44" }}>
          <div style={{ color: C.warn, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>
            AI COACH ADVICE
          </div>
          <div
            style={{
              color: C.text,
              fontSize: 14,
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
            }}
          >
            {tip}
          </div>
        </Card>
      )}
    </div>
  );
}

// Small helper component for stat summary cards
function StatCard({ value, label, color }) {
  return (
    <Card
      style={{
        flex: 1,
        minWidth: 100,
        textAlign: "center",
        borderColor: color + "44",
      }}
    >
      <div style={{ fontSize: 30, fontWeight: 800, color }}>{value}</div>
      <div style={{ color: C.muted, fontSize: 13 }}>{label}</div>
    </Card>
  );
}
