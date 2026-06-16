export const RESEARCH_STAGES = ["idea", "research", "writing", "submission", "revision"];

export const STAGE_LABELS = {
  idea: "idea",
  research: "research",
  writing: "writing",
  submission: "submission",
  revision: "revision"
};

export const STAGE_PROGRESS = {
  idea: 0,
  research: 25,
  writing: 50,
  submission: 75,
  revision: 100
};

export function getStageIndex(stage) {
  return Math.max(0, RESEARCH_STAGES.indexOf(stage));
}

export function getStageLabel(stage) {
  return STAGE_LABELS[stage] || stage || "";
}

export function getStageProgress(stage) {
  return STAGE_PROGRESS[stage] ?? 0;
}

export function createEmptyStageContent() {
  return {
    notes: "",
    files: [],
    links: []
  };
}

export function createEmptyStageMap() {
  return RESEARCH_STAGES.reduce((acc, stage) => {
    acc[stage] = createEmptyStageContent();
    return acc;
  }, {});
}
