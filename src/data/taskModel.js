import { TASK_TYPES } from "../constants/taskTypes";
import { createEmptyStageMap } from "../constants/stages";

export const TaskModel = {
  id: "",
  title: "",
  type: TASK_TYPES.research,
  status: "todo",
  researchStage: "idea",
  project: "",
  tags: [],
  progress: 0,
  createdAt: 0,
  updatedAt: 0,
  dueDate: "",
  startDate: "",
  startTime: "",
  endTime: "",
  notes: "",
  stageContents: createEmptyStageMap()
};
