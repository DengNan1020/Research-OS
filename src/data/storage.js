import { createSeedTasks } from "./seedTasks";
import { normalizeWorkflowTask } from "./workflowModel";

const KEY = "research_os_tasks";
const LEGACY_SAMPLE_TITLES = new Set(["整理开题思路", "补充文献综述", "提交组会材料", "整理邮箱和截图"]);

function looksLikeLegacySeed(tasks) {
  return (
    Array.isArray(tasks) &&
    tasks.length === 4 &&
    tasks.some((task) => LEGACY_SAMPLE_TITLES.has(task?.title))
  );
}

function migrateLoadedTask(task) {
  if (!task || typeof task !== "object") {
    return task;
  }

  if (task.type === "misc") {
    return normalizeWorkflowTask({
      ...task,
      checklist: Array.isArray(task.checklist) && task.checklist.length
        ? task.checklist
        : [
            {
              name: task.title || "待办项",
              status: task.progress >= 100 ? "done" : "todo",
              requireFile: false,
              notes: task.notes || "",
              file: undefined
            }
          ]
    });
  }

  if (task.type === "workflow") {
    return normalizeWorkflowTask(task);
  }

  return task;
}

export function loadTasks() {
  try {
    const data = localStorage.getItem(KEY);
    if (!data) {
      return [];
    }

    const tasks = JSON.parse(data);
    if (looksLikeLegacySeed(tasks)) {
      return createSeedTasks();
    }

    return Array.isArray(tasks) ? tasks.map(migrateLoadedTask) : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(KEY, JSON.stringify(tasks));
  } catch {
    // Ignore storage failures so the app keeps running.
  }
}
