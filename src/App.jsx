// ============================================================
// App.jsx — Root Component (the "brain" of the app)
// ============================================================
// This is the top-level component that:
//   1. Manages which module is currently active (navigation state)
//   2. Holds the shared quiz scores array (lifted state)
//   3. Renders the Header, Sidebar, and the active Module
//
// WHY LIFT STATE HERE?
//   QuizGenerator creates scores → ProgressTracker displays them.
//   Both need access to the same data, so it lives in their
//   common parent: App.jsx. This is called "lifting state up."
// ============================================================

import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import DoubtSolver from "./components/DoubtSolver";
import QuizGenerator from "./components/QuizGenerator";
import StudyPlanner from "./components/StudyPlanner";
import ProgressTracker from "./components/ProgressTracker";
import Summarizer from "./components/Summarizer";
import { COLORS as C } from "./utils/constants";

export default function App() {
  // active: which module tab is selected (matches MODULES[].id)
  const [active, setActive] = useState("doubt");

  // scores: shared quiz history used by QuizGenerator and ProgressTracker
  // Each score = { topic, difficulty, score, total, date }
  const [scores, setScores] = useState([]);

  // Called by QuizGenerator after quiz submission
  function addScore(newScore) {
    setScores((prev) => [...prev, newScore]);
  }

  // Renders the currently selected module
  function renderModule() {
    switch (active) {
      case "doubt":    return <DoubtSolver />;
      case "quiz":     return <QuizGenerator onScore={addScore} />;
      case "planner":  return <StudyPlanner />;
      case "progress": return <ProgressTracker scores={scores} />;
      case "summary":  return <Summarizer />;
      default:         return <DoubtSolver />;
    }
  }

  return (
    <div
      style={{
        fontFamily: "'Outfit', sans-serif",
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top navigation bar */}
      <Header scores={scores} />

      {/* Main layout: sidebar + content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left navigation sidebar */}
        <Sidebar active={active} setActive={setActive} scores={scores} />

        {/* Active module content area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 28,
          }}
          key={active} // key change triggers fade-in animation on tab switch
          className="fade-in"
        >
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            {renderModule()}
          </div>
        </div>
      </div>
    </div>
  );
}
