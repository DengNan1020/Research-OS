import { useEffect, useState } from "react";
import { loadTasks, saveTasks } from "../data/storage";
import { generateId } from "../utils/id";
import { createSeedTasks } from "../data/seedTasks";
import { createEmptyStageMap } from "../constants/stages";
import { normalizeWorkflowTask } from "../data/workflowModel";

export function useTasks() {
  const [tasks, setTasks] = useState(() => {
    const loaded = loadTasks();
    return loaded.length ? loaded : createSeedTasks();
  });

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  function addTask(task) {
    const nextTask =
      task.type === "research"
        ? {
            ...task,
            stageContents: task.stageContents || createEmptyStageMap()
          }
        : task.type === "workflow"
          ? normalizeWorkflowTask(task)
        : task;

    setTasks((prev) => [
      ...prev,
      {
        ...nextTask,
        id: generateId(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    ]);
  }

  function updateTask(id, updates) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updates,
              updatedAt: Date.now()
            }
          : task
      )
    );
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask
  };
}
