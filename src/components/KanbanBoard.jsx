import React from "react";
import Column from "./Column";
import { RESEARCH_STAGES, STAGE_LABELS } from "../constants/stages";

export default function KanbanBoard({ tasks, updateTask, deleteTask }) {
  return (
    <div className="kanban">
      {RESEARCH_STAGES.map((stage) => (
        <Column
          key={stage}
          stage={stage}
          title={STAGE_LABELS[stage]}
          tasks={tasks.filter((task) => task.researchStage === stage)}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
      ))}
    </div>
  );
}
