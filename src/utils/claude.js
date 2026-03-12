// ============================================================
// claude.js — Claude API Helper
// ============================================================
// This file handles ALL communication with the Claude API.
// By putting it in one place, every module can reuse it
// without repeating the fetch() code.
//
// HOW IT WORKS:
// 1. You pass a systemPrompt (tells Claude its role/persona)
// 2. You pass a userMessage (the actual question)
// 3. You optionally pass history (previous messages for multi-turn chat)
// 4. It returns Claude's reply as a plain string
// ============================================================

const GEMINI_MODEL = "gemini-2.5-flash";

export async function callClaude(systemPrompt, userMessage, history = []) {
  // Convert history format for Gemini
  const contents = [
    ...history.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    })),
    {
      role: "user",
      parts: [{ text: `${systemPrompt}\n\n${userMessage}` }]
    }
  ];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return `Error: ${data.error.message}`;
    }

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    return rawText.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1");

  } catch (err) {
    console.error("Fetch error:", err);
    return "Network error. Check console.";
  }
}
