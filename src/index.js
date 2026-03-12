import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// This is the entry point of the React app.
// It finds the <div id="root"> in public/index.html and renders the App inside it.
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
