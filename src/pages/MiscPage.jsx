import React, { useEffect, useMemo, useState } from "react";
import WorkflowModal from "../components/WorkflowModal";
import WorkflowDetail from "../components/WorkflowDetail";
import { TASK_TYPES } from "../constants/taskTypes";
import { getWorkflowProgress } from "../data/workflowModel";

function WorkflowCard({ task, active, onClick }) {
  const progress = getWorkflowProgress(task.checklist);
  const doneItems = task.checklist?.filter((item) => item.status === "done").length || 0;

  return (
    <button
      type="button"
      className={`workflow-card panel ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <div className="workflow-card-top">
        <div>
          <h3>{task.title}</h3>
          <p>{task.dueDate ? `DDL：${task.dueDate}` : "暂无总DDL"}</p>
        </div>

        <span className="workflow-pill">{progress}%</span>
      </div>

      <div className="workflow-progress-bar" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="workflow-card-meta">
        <span>{task.checklist?.length || 0} 个 checklist</span>
        <span>{doneItems}/{task.checklist?.length || 0} 已完成</span>
      </div>
    </button>
  );
}

export default function MiscPage({
  tasks,
  addTask,
  updateTask,
  deleteTask,
  onOpenCalendarDate,
  focusedTaskId
}) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const workflowTasks = useMemo(
    () => tasks.filter((task) => task.type === TASK_TYPES.workflow || task.type === TASK_TYPES.misc),
    [tasks]
  );

  const selectedTask = workflowTasks.find((task) => task.id === selectedId) || null;

  useEffect(() => {
    if (selectedId && !workflowTasks.some((task) => task.id === selectedId)) {
      setSelectedId(workflowTasks[0]?.id || null);
    }
  }, [workflowTasks, selectedId]);

  useEffect(() => {
    if (focusedTaskId) {
      const focused = workflowTasks.find((task) => task.id === focusedTaskId);
      if (focused) {
        setSelectedId(focused.id);
      }
    }
  }, [focusedTaskId, workflowTasks]);

  function handleUpdateWorkflowTask(taskId, updates) {
    updateTask(taskId, {
      ...updates,
      type: TASK_TYPES.workflow
    });
  }

  return (
    <section className="page">
      <div className="toolbar page-toolbar">
        <div className="toolbar-actions">
          {selectedTask ? (
            <button className="secondary-button" onClick={() => setSelectedId(null)}>
              返回列表
            </button>
          ) : null}
          <button className="primary-button" onClick={() => setOpen(true)}>
            新增杂事
          </button>
        </div>
      </div>

      {!selectedTask ? (
        <div className="panel section-card">
          {workflowTasks.length ? (
            <div className="workflow-list">
              {workflowTasks.map((task) => (
                <WorkflowCard
                  key={task.id}
                  task={task}
                  active={task.id === selectedId}
                  onClick={() => setSelectedId(task.id)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">还没有 workflow 任务，先新建一个。</div>
          )}
        </div>
      ) : (
        <WorkflowDetail
          task={selectedTask}
          onUpdate={(updates) => handleUpdateWorkflowTask(selectedTask.id, updates)}
          onDelete={() => {
            deleteTask(selectedTask.id);
            setSelectedId(null);
          }}
          onBack={() => setSelectedId(null)}
          onOpenCalendarDate={onOpenCalendarDate}
        />
      )}

      <WorkflowModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(task) => {
          addTask(task);
          setOpen(false);
        }}
      />
    </section>
  );
}
