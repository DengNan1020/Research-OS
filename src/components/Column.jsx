import React from "react";
import TaskCard from "./TaskCard";

export default function Column({ stage, title, tasks, updateTask, deleteTask }) {
  return (
    <section className="column">
      <h3>{title || stage}</h3>
      <div className="column-meta">{tasks.length} 个任务</div>

      {tasks.length ? (
        tasks.map((task) => (
          <TaskCard key={task.id} task={task} updateTask={updateTask} deleteTask={deleteTask} />
        ))
      ) : (
        <div className="empty-state">这里还没有任务</div>
      )}
    </section>
  );
}
