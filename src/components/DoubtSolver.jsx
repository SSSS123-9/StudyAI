// ============================================================
// DoubtSolver.jsx — Module 1: AI Doubt Solver
// ============================================================
// A multi-turn chat interface where students ask questions
// and Claude gives structured explanations.
//
// KEY CONCEPTS LEARNED:
//   ✅ System prompt design (persona + output format)
//   ✅ Multi-turn conversation (chat history passed to API)
//   ✅ useRef for auto-scrolling chat to bottom
//   ✅ Controlled input with useState
// ============================================================

import { useState, useRef, useEffect } from "react";
import { callClaude } from "../utils/claude";
import { COLORS as C } from "../utils/constants";
import { Input, Btn, Spinner } from "./UI";

// The system prompt defines HOW Claude behaves in this module.
// It sets the persona, tone, and output structure.
const SYSTEM_PROMPT = `You are StudyBot, a friendly and brilliant AI tutor for students aged 12–22.
When a student asks a question:
1. Give a clear, simple explanation (2-3 sentences)
2. Use ONE relatable analogy
3. Provide a step-by-step breakdown (numbered)
4. End with a real-world example
Keep your tone warm, encouraging, and never condescending. Use simple language.`;

export default function DoubtSolver() {
  // chat: array of {role: "user"|"assistant", content: "..."}
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // useRef lets us reference the bottom of the chat div for auto-scroll
  const bottomRef = useRef(null);

  // Auto-scroll to the latest message whenever chat updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  async function handleAsk() {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput(""); // Clear input field immediately

    // Add user message to chat UI
    const updatedChat = [...chat, { role: "user", content: userMessage }];
    setChat(updatedChat);
    setLoading(true);

    // Pass full history to Claude so it remembers context
    // We exclude the latest message since callClaude adds it separately
    const history = chat.map((m) => ({ role: m.role, content: m.content }));
    const reply = await callClaude(SYSTEM_PROMPT, userMessage, history);

    // Add Claude's response to chat
    setChat([...updatedChat, { role: "assistant", content: reply }]);
    setLoading(false);
  }

  // Allow pressing Enter to submit
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Module header */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ color: C.accent, margin: 0, fontSize: 22, fontWeight: 700 }}>
          💡 Doubt Solver
        </h2>
        <p style={{ color: C.muted, margin: "4px 0 0", fontSize: 13 }}>
          Ask anything — get clear, step-by-step explanations with analogies
        </p>
      </div>

      {/* Chat messages area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          marginBottom: 16,
          paddingRight: 4,
          minHeight: 300,
          maxHeight: 420,
        }}
      >
        {/* Empty state */}
        {chat.length === 0 && (
          <div style={{ color: C.muted, fontSize: 14, textAlign: "center", marginTop: 60 }}>
            🎓 Ask your first question to get started!<br />
            <span style={{ fontSize: 12, marginTop: 8, display: "block" }}>
              Try: "Why does the sky look blue?" or "Explain Newton's laws"
            </span>
          </div>
        )}

        {/* Render each message bubble */}
        {chat.map((message, index) => (
          <div
            key={index}
            style={{
              alignSelf: message.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "82%",
              background: message.role === "user" ? C.accent + "22" : C.cardBorder,
              border: `1px solid ${message.role === "user" ? C.accent + "44" : C.cardBorder}`,
              borderRadius:
                message.role === "user"
                  ? "16px 16px 4px 16px"
                  : "16px 16px 16px 4px",
              padding: "12px 16px",
              color: C.text,
              fontSize: 14,
              lineHeight: 1.65,
              whiteSpace: "pre-wrap", // Preserves line breaks in Claude's response
            }}
          >
            {/* Label for assistant messages */}
            {message.role === "assistant" && (
              <div style={{ color: C.accent, fontWeight: 700, marginBottom: 6, fontSize: 12 }}>
                STUDYBOT
              </div>
            )}
            {message.content}
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div style={{ alignSelf: "flex-start" }}>
            <Spinner />
          </div>
        )}

        {/* Invisible element at bottom for auto-scroll target */}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{ display: "flex", gap: 10 }}>
        <Input
          value={input}
          onChange={setInput}
          placeholder="e.g. Why does the sky appear blue?"
          style={{ flex: 1 }}
          onKeyDown={handleKeyDown}
        />
        <Btn onClick={handleAsk} disabled={loading || !input.trim()} color={C.accent}>
          Ask →
        </Btn>
      </div>
    </div>
  );
}
