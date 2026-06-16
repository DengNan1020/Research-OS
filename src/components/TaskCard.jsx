import React from "react";
import { formatDate, isDueSoon } from "../utils/date";

export default function TaskCard({ task, updateTask, deleteTask }) {
  return (
    <article className={`card ${isDueSoon(task.dueDate) ? "danger" : ""}`}>
      <h4>{task.title}</h4>
      <p>进度：{task.progress || 0}%</p>
      {task.project ? <p>项目：{task.project}</p> : null}

      <select
        value={task.researchStage || "idea"}
        onChange={(event) =>
          updateTask(task.id, {
            researchStage: event.target.value
          })
        }
      >
        <option value="idea">idea</option>
        <option value="research">research</option>
        <option value="writing">writing</option>
        <option value="submission">submission</option>
        <option value="revision">revision</option>
      </select>

      <input
        type="range"
        min="0"
        max="100"
        value={task.progress || 0}
        onChange={(event) =>
          updateTask(task.id, {
            progress: Number(event.target.value)
          })
        }
      />

      {task.dueDate ? <p>DDL: {formatDate(task.dueDate)}</p> : <p>暂无截止日期</p>}

      {task.tags?.length ? (
        <div className="tag-row">
          {task.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="card-actions">
        <button type="button" className="icon-close-button card-close" aria-label="删除任务" onClick={() => deleteTask(task.id)}>
          ×
        </button>
      </div>
    </article>
  );
}
