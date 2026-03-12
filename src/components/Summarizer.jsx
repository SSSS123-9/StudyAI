// ============================================================
// Summarizer.jsx — Module 5: Concept Summarizer
// ============================================================
// Student pastes any text → Claude returns structured JSON
// with summary, key points, key terms, and a memory trick.
//
// KEY CONCEPTS LEARNED:
//   ✅ Structured JSON output from LLMs (advanced technique)
//   ✅ Parsing nested JSON response safely with try/catch
//   ✅ Rendering structured data as rich UI components
//   ✅ Different prompt pattern: document analysis
// ============================================================

import { useState } from "react";
import { callClaude } from "../utils/claude";
import { COLORS as C } from "../utils/constants";
import { Card, Btn, Input, Spinner, Badge } from "./UI";

// This system prompt strictly enforces JSON-only output.
// The JSON schema is defined clearly so Claude follows it exactly.
const SYSTEM_PROMPT = `You are a study assistant that analyzes educational text.
When given any text, respond with ONLY valid JSON (no markdown, no backticks, no explanation).
Use exactly this JSON structure:
{
  "summary": "A 2-3 sentence plain-language summary of the main idea",
  "keyPoints": ["point 1", "point 2", "point 3", "point 4", "point 5"],
  "keyTerms": [
    {"term": "Term Name", "definition": "Simple definition in plain language"},
    {"term": "Term Name", "definition": "Simple definition in plain language"},
    {"term": "Term Name", "definition": "Simple definition in plain language"}
  ],
  "mnemonic": "A creative memory trick, acronym, or analogy to remember the main idea"
}`;

export default function Summarizer() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);  // Parsed JSON object from Claude
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pink = "#f472b6";

  async function summarize() {
    if (!inputText.trim()) return;

    setLoading(true);
    setResult(null);
    setError("");

    const rawResponse = await callClaude(SYSTEM_PROMPT, inputText.trim());

    try {
      // Strip any accidental markdown formatting Claude might add
      const cleaned = rawResponse.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      setResult(parsed);
    } catch (err) {
      setError("Could not parse the summary. Please try again with different text.");
    }

    setLoading(false);
  }

  return (
    <div>
      {/* Module header */}
      <h2 style={{ color: pink, margin: "0 0 4px", fontSize: 22, fontWeight: 700 }}>
        🗂️ Concept Summarizer
      </h2>
      <p style={{ color: C.muted, margin: "0 0 20px", fontSize: 13 }}>
        Paste any text from your textbook or notes — get instant summaries, key terms & memory tricks
      </p>

      {/* Text input area */}
      <Input
        value={inputText}
        onChange={setInputText}
        placeholder="Paste a paragraph, chapter excerpt, or any educational content here..."
        multiline
        rows={6}
        style={{ marginBottom: 12 }}
      />

      <Btn
        onClick={summarize}
        disabled={loading || !inputText.trim()}
        color={pink}
        style={{ marginBottom: 20 }}
      >
        Summarize →
      </Btn>

      {loading && <Spinner />}
      {error && <p style={{ color: "#f87171", fontSize: 14 }}>{error}</p>}

      {/* Render structured results */}
      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Summary section */}
          <Card style={{ borderColor: pink + "44" }}>
            <div style={{ color: pink, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>
              📝 SUMMARY
            </div>
            <div style={{ color: C.text, fontSize: 14, lineHeight: 1.7 }}>
              {result.summary}
            </div>
          </Card>

          {/* Key points section */}
          <Card>
            <div style={{ color: C.accent3, fontWeight: 700, fontSize: 12, marginBottom: 10 }}>
              ✅ KEY POINTS
            </div>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {result.keyPoints?.map((point, i) => (
                <li
                  key={i}
                  style={{ color: C.text, fontSize: 14, lineHeight: 1.8, marginBottom: 2 }}
                >
                  {point}
                </li>
              ))}
            </ul>
          </Card>

          {/* Key terms section */}
          <Card>
            <div style={{ color: C.accent2, fontWeight: 700, fontSize: 12, marginBottom: 10 }}>
              📚 KEY TERMS
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {result.keyTerms?.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ flexShrink: 0 }}>
                    <Badge text={item.term} color={C.accent2} />
                  </div>
                  <span style={{ color: C.muted, fontSize: 13, lineHeight: 1.5 }}>
                    {item.definition}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Memory trick section */}
          <Card style={{ borderColor: C.warn + "44" }}>
            <div style={{ color: C.warn, fontWeight: 700, fontSize: 12, marginBottom: 6 }}>
              🧠 MEMORY TRICK
            </div>
            <div style={{ color: C.text, fontSize: 14, fontStyle: "italic", lineHeight: 1.6 }}>
              {result.mnemonic}
            </div>
          </Card>

        </div>
      )}
    </div>
  );
}
