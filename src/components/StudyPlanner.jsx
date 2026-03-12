// ============================================================
// StudyPlanner.jsx — Module 3: Personalized Study Planner
// ============================================================
// Takes exam details from the student and generates a
// complete day-by-day study schedule using Claude.
//
// KEY CONCEPTS LEARNED:
//   ✅ Multi-field form handling with useState
//   ✅ Prompt engineering with user-provided context
//   ✅ Rendering long-form structured text output
// ============================================================

import { useState } from "react";
import { callClaude } from "../utils/claude";
import { COLORS as C } from "../utils/constants";
import { Card, Btn, Input, Spinner } from "./UI";

// System prompt instructs Claude on output format and style.
// Clear formatting instructions = better, more readable output.
const SYSTEM_PROMPT = `You are an expert academic coach and study strategist.
Create a detailed, realistic, day-by-day study plan based on the student's inputs.

Format your response as follows:
- Start with ONE motivational sentence
- Then list each day with this format:
  📅 Day 1 — [Date if possible]
  • Subject: [Subject name]
  • Topics: [Specific topics to cover]
  • Time: [e.g., 2 hours]
  • Tip: [One specific study tip for that session]
- End with a final revision day summary
- Keep it realistic and achievable. Do not overload the student.`;

export default function StudyPlanner() {
  const [exam, setExam] = useState("");
  const [examDate, setExamDate] = useState("");
  const [weakSubjects, setWeakSubjects] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  async function generatePlan() {
    if (!exam || !examDate || !weakSubjects) return;

    setLoading(true);
    setPlan("");

    // Build a rich user message with all the context Claude needs
    const userMessage = `
Exam Name: ${exam}
Exam Date: ${examDate}
Weak subjects / topics I need to focus on: ${weakSubjects}

Please create my study plan starting from today.
    `.trim();

    const result = await callClaude(SYSTEM_PROMPT, userMessage);
    setPlan(result);
    setLoading(false);
  }

  return (
    <div>
      {/* Module header */}
      <h2 style={{ color: C.accent3, margin: "0 0 4px", fontSize: 22, fontWeight: 700 }}>
        📅 Study Planner
      </h2>
      <p style={{ color: C.muted, margin: "0 0 20px", fontSize: 13 }}>
        Enter your exam details and get a personalized day-by-day study schedule
      </p>

      {/* Input form */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        <div>
          <label style={{ color: C.muted, fontSize: 12, display: "block", marginBottom: 6 }}>
            EXAM NAME
          </label>
          <Input
            value={exam}
            onChange={setExam}
            placeholder="e.g. Math Final Exam, JEE Mains, SAT, NEET"
          />
        </div>

        <div>
          <label style={{ color: C.muted, fontSize: 12, display: "block", marginBottom: 6 }}>
            EXAM DATE
          </label>
          <Input
            value={examDate}
            onChange={setExamDate}
            placeholder="e.g. March 30, 2025"
          />
        </div>

        <div>
          <label style={{ color: C.muted, fontSize: 12, display: "block", marginBottom: 6 }}>
            WEAK SUBJECTS / TOPICS
          </label>
          <Input
            value={weakSubjects}
            onChange={setWeakSubjects}
            placeholder="e.g. Calculus, Organic Chemistry, Thermodynamics, Essay Writing"
            multiline
            rows={2}
          />
        </div>

        <Btn
          onClick={generatePlan}
          disabled={loading || !exam || !examDate || !weakSubjects}
          color={C.accent3}
          style={{ alignSelf: "flex-start" }}
        >
          Generate My Study Plan 📅
        </Btn>
      </div>

      {loading && <Spinner />}

      {/* Render the generated plan */}
      {plan && (
        <Card style={{ borderColor: C.accent3 + "44" }}>
          <div style={{ color: C.accent3, fontWeight: 700, fontSize: 12, marginBottom: 12 }}>
            YOUR PERSONALIZED STUDY PLAN
          </div>
          {/* pre-wrap preserves the formatting/line breaks from Claude's response */}
          <pre
            style={{
              color: C.text,
              fontSize: 13.5,
              lineHeight: 1.8,
              whiteSpace: "pre-wrap",
              margin: 0,
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            {plan}
          </pre>
        </Card>
      )}
    </div>
  );
}
