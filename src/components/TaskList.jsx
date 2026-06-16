import React from "react";
import { formatDate } from "../utils/date";

export default function TaskList({ tasks, updateTask, deleteTask }) {
  if (!tasks.length) {
    return <div className="empty-state">这里还没有任务</div>;
  }

  return (
    <div className="list">
      {tasks.map((task) => (
        <section className="list-item" key={task.id}>
          <div className="list-item-main">
            <h4>{task.title}</h4>
            <p>{task.notes || "暂无备注"}</p>

            <div className="meta-row">
              <span>阶段：{task.researchStage || "-"}</span>
              <span>进度：{task.progress || 0}%</span>
              <span>DDL：{task.dueDate ? formatDate(task.dueDate) : "无"}</span>
            </div>
          </div>

          <div className="list-actions">
            <button
              className="secondary-button"
              onClick={() => updateTask(task.id, { progress: Math.min((task.progress || 0) + 10, 100) })}
            >
              +10%
            </button>
            <button className="icon-close-button" aria-label="删除任务" onClick={() => deleteTask(task.id)}>
              ×
            </button>
          </div>
        </section>
      ))}
    </div>
  );
}
