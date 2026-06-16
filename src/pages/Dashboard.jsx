import React from "react";
import { formatDate } from "../utils/date";

export default function Dashboard({ tasks, stats, onOpenTask, onOpenView, onDeleteTask }) {
  const upcoming = tasks
    .filter((task) => task.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  return (
    <section className="page">
      <div className="dashboard-grid">
        <div className="panel stat-card">
          <div className="stat-label">总任务数</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <button type="button" className="panel stat-card stat-button" onClick={() => onOpenView?.("research")}>
          <div className="stat-label">研究任务</div>
          <div className="stat-value">{stats.research}</div>
        </button>
        <button type="button" className="panel stat-card stat-button" onClick={() => onOpenView?.("misc")}>
          <div className="stat-label">杂事</div>
          <div className="stat-value">{stats.misc}</div>
        </button>
        <button type="button" className="panel stat-card stat-button" onClick={() => onOpenView?.("calendar")}>
          <div className="stat-label">有截止日期</div>
          <div className="stat-value">{stats.deadlines}</div>
        </button>
      </div>

      <div className="panel section-card">
        <div className="toolbar page-toolbar">
          <div>
            <h2>最近截止</h2>
            <p>最多展示 5 条任务。</p>
          </div>
        </div>

        {upcoming.length ? (
          <div className="list">
            {upcoming.map((task) => (
              <div className="list-item" key={task.id}>
                <button type="button" className="list-item-main" onClick={() => onOpenTask?.(task)}>
                  <h4>{task.title}</h4>
                  <div className="meta-row">
                    <span>{task.type}</span>
                    <span>{task.researchStage || "-"}</span>
                    <span>{formatDate(task.dueDate)}</span>
                  </div>
                </button>

                <button type="button" className="icon-close-button" aria-label="删除" onClick={() => onDeleteTask?.(task.id)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">暂无任务，先去添加一条吧。</div>
        )}
      </div>
    </section>
  );
}
