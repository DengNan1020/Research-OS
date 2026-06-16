import React from "react";

export default function Sidebar({ view, setView }) {
  return (
    <aside className="sidebar">
      <h2 className="brand">Research OS</h2>

      <nav className="nav-group">
        <button
          className={`nav-button ${view === "dashboard" ? "active" : ""}`}
          onClick={() => setView("dashboard")}
        >
          总览
        </button>
        <button
          className={`nav-button ${view === "research" ? "active" : ""}`}
          onClick={() => setView("research")}
        >
          研究进展
        </button>
        <button
          className={`nav-button ${view === "misc" ? "active" : ""}`}
          onClick={() => setView("misc")}
        >
          杂事
        </button>
        <button
          className={`nav-button ${view === "calendar" ? "active" : ""}`}
          onClick={() => setView("calendar")}
        >
          日历
        </button>
      </nav>

    </aside>
  );
}
