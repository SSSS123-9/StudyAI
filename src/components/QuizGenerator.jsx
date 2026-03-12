// ============================================================
// QuizGenerator.jsx — Module 2: Smart Quiz Generator
// ============================================================
// Generates 5 MCQ questions on any topic using Claude.
// Claude returns structured JSON which we parse and render.
//
// KEY CONCEPTS LEARNED:
//   ✅ Prompting Claude to return structured JSON output
//   ✅ Parsing and validating JSON from LLM response
//   ✅ Dynamic rendering from API data
//   ✅ Score tracking passed back to parent via onScore prop
// ============================================================

import { useState } from "react";
import { callClaude } from "../utils/claude";
import { COLORS as C } from "../utils/constants";
import { Card, Btn, Input, Spinner, Badge } from "./UI";

// This system prompt forces Claude to return ONLY JSON.
// Structured output is a key LLM engineering technique.
const SYSTEM_PROMPT = `You are a quiz generator. When given a topic and difficulty, return ONLY a valid JSON array 
(no markdown formatting, no explanation text, just raw JSON) of exactly 5 MCQ objects with this exact shape:
[
  {
    "question": "The question text here",
    "options": ["A) option one", "B) option two", "C) option three", "D) option four"],
    "answer": "A",
    "explanation": "Brief explanation of why this is correct"
  }
]
The answer field must be exactly one of: A, B, C, or D.`;

// Props:
//   onScore — callback to send score data to parent (App.jsx) for Progress Tracker
export default function QuizGenerator({ onScore }) {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questions, setQuestions] = useState([]);  // Parsed quiz questions
  const [answers, setAnswers] = useState({});       // User's selected answers {questionIndex: "A/B/C/D"}
  const [feedback, setFeedback] = useState({});     // Feedback after submission
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateQuiz() {
    if (!topic.trim()) return;

    setLoading(true);
    setError("");
    setQuestions([]);
    setAnswers({});
    setFeedback({});
    setSubmitted(false);

    const rawResponse = await callClaude(
      SYSTEM_PROMPT,
      `Topic: ${topic}, Difficulty: ${difficulty}`
    );

    try {
      // Remove any accidental markdown backticks Claude might add
      const cleaned = rawResponse.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      setQuestions(parsed);
    } catch (err) {
      setError("Could not parse quiz. Please try again with a different topic.");
    }

    setLoading(false);
  }

  function selectAnswer(questionIndex, letter) {
    if (submitted) return; // Lock answers after submission
    setAnswers({ ...answers, [questionIndex]: letter });
  }

  function submitQuiz() {
    let newFeedback = {};
    let score = 0;

    questions.forEach((q, i) => {
      const isCorrect = answers[i] === q.answer;
      if (isCorrect) score++;
      newFeedback[i] = { correct: isCorrect, explanation: q.explanation };
    });

    setFeedback(newFeedback);
    setSubmitted(true);

    // Send score data to parent component (App.jsx)
    // This feeds the Progress Tracker module
    onScore({
      topic,
      difficulty,
      score,
      total: questions.length,
      date: new Date().toLocaleDateString(),
    });
  }

  const finalScore = submitted
    ? Object.values(feedback).filter((f) => f.correct).length
    : 0;

  return (
    <div>
      {/* Module header */}
      <h2 style={{ color: C.accent2, margin: "0 0 4px", fontSize: 22, fontWeight: 700 }}>
        🧪 Quiz Generator
      </h2>
      <p style={{ color: C.muted, margin: "0 0 20px", fontSize: 13 }}>
        Generate a 5-question MCQ quiz on any topic instantly
      </p>

      {/* Controls: topic input, difficulty selector, generate button */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <Input
          value={topic}
          onChange={setTopic}
          placeholder="e.g. Photosynthesis, World War 2, Algebra..."
          style={{ flex: 1, minWidth: 200 }}
        />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          style={{
            background: C.inputBg,
            border: `1.5px solid ${C.cardBorder}`,
            color: C.text,
            borderRadius: 10,
            padding: "12px 16px",
            fontFamily: "'Outfit', sans-serif",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <Btn onClick={generateQuiz} disabled={loading || !topic.trim()} color={C.accent2}>
          Generate Quiz
        </Btn>
      </div>

      {loading && <Spinner />}
      {error && <p style={{ color: "#f87171", fontSize: 14 }}>{error}</p>}

      {/* Render questions */}
      {questions.length > 0 && (
        <div>
          {questions.map((q, i) => (
            <Card key={i} style={{ marginBottom: 14 }}>
              {/* Question text */}
              <div style={{ color: C.text, fontWeight: 600, marginBottom: 12, fontSize: 15 }}>
                <Badge text={`Q${i + 1}`} color={C.accent2} />
                <span style={{ marginLeft: 8 }}>{q.question}</span>
              </div>

              {/* Answer options */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {q.options.map((option, j) => {
                  const letter = ["A", "B", "C", "D"][j];
                  const isSelected = answers[i] === letter;
                  const isCorrect = submitted && letter === q.answer;
                  const isWrong = submitted && isSelected && letter !== q.answer;

                  return (
                    <div
                      key={j}
                      onClick={() => selectAnswer(i, letter)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: 8,
                        cursor: submitted ? "default" : "pointer",
                        border: `1.5px solid ${
                          isCorrect
                            ? C.accent3
                            : isWrong
                            ? "#f87171"
                            : isSelected
                            ? C.accent2
                            : C.cardBorder
                        }`,
                        background: isCorrect
                          ? C.accent3 + "18"
                          : isWrong
                          ? "#f8717118"
                          : isSelected
                          ? C.accent2 + "18"
                          : "transparent",
                        color: C.text,
                        fontSize: 14,
                        transition: "all 0.15s",
                      }}
                    >
                      {option}
                    </div>
                  );
                })}
              </div>

              {/* Show explanation after submission */}
              {submitted && feedback[i] && (
                <div
                  style={{
                    marginTop: 10,
                    padding: "10px 14px",
                    borderRadius: 8,
                    background: C.inputBg,
                    color: C.muted,
                    fontSize: 13,
                  }}
                >
                  {feedback[i].correct ? "✅" : "❌"}{" "}
                  <strong style={{ color: C.text }}>Explanation:</strong>{" "}
                  {feedback[i].explanation}
                </div>
              )}
            </Card>
          ))}

          {/* Submit button — disabled until all questions answered */}
          {!submitted && (
            <Btn
              onClick={submitQuiz}
              disabled={Object.keys(answers).length < questions.length}
              color={C.accent2}
            >
              Submit Answers ({Object.keys(answers).length}/{questions.length})
            </Btn>
          )}

          {/* Score summary */}
          {submitted && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                background: C.accent2 + "18",
                borderRadius: 12,
                border: `1px solid ${C.accent2}44`,
              }}
            >
              <div style={{ fontSize: 32, fontWeight: 800, color: C.accent2 }}>
                {finalScore}/{questions.length}
              </div>
              <div style={{ color: C.text, fontSize: 15, marginTop: 4 }}>
                {finalScore === questions.length
                  ? "🎉 Perfect Score!"
                  : finalScore >= 3
                  ? "👍 Good job! Keep it up!"
                  : "📚 Keep studying! You'll get it!"}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
