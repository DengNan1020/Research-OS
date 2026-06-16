import React from "react";

const titles = {
  dashboard: ["总览"],
  research: ["研究进展"],
  misc: ["杂事"],
  calendar: ["日历"]
};

export default function Header({ view }) {
  const [title] = titles[view] || titles.dashboard;

  return (
    <header className="header panel">
      <div className="header-main">
        <h1>{title}</h1>
      </div>
    </header>
  );
}
