import { TASK_TYPES } from "../constants/taskTypes";
import { generateId } from "../utils/id";

export function createWorkflowChecklistItem(overrides = {}) {
  return {
    id: generateId(),
    name: "",
    status: "todo",
    requireFile: false,
    file: undefined,
    notes: "",
    ...overrides
  };
}

export function createWorkflowTask(overrides = {}) {
  return {
    id: "",
    title: "",
    type: TASK_TYPES.workflow,
    createdAt: 0,
    updatedAt: 0,
    dueDate: "",
    checklist: [],
    ...overrides,
    checklist: Array.isArray(overrides.checklist)
      ? overrides.checklist.map((item) => createWorkflowChecklistItem(item))
      : []
  };
}

export function normalizeWorkflowTask(task) {
  if (!task || typeof task !== "object") {
    return task;
  }

  return createWorkflowTask({
    ...task,
    type: TASK_TYPES.workflow
  });
}

export function getWorkflowProgress(checklist = []) {
  if (!checklist.length) {
    return 0;
  }

  const doneCount = checklist.filter((item) => item.status === "done").length;
  return Math.round((doneCount / checklist.length) * 100);
}
