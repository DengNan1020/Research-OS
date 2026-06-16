import { TASK_TYPES } from "../constants/taskTypes";
import { createEmptyStageMap } from "../constants/stages";
import { createWorkflowChecklistItem } from "./workflowModel";
import { generateId } from "../utils/id";

function makeTask(overrides, createdOffsetDays = 0) {
  const now = Date.now();
  const day = 1000 * 60 * 60 * 24;

  return {
    id: generateId(),
    title: "",
    type: TASK_TYPES.research,
    status: "todo",
    researchStage: "idea",
    project: "",
    tags: [],
    progress: 0,
    createdAt: now - createdOffsetDays * day,
    updatedAt: now - createdOffsetDays * day,
    dueDate: "",
    startDate: "",
    startTime: "",
    endTime: "",
    notes: "",
    stageContents: createEmptyStageMap(),
    ...overrides
  };
}

export function createSeedTasks() {
  return [
    makeTask(
      {
        title: "IND",
        type: TASK_TYPES.research,
        researchStage: "idea",
        project: "IND",
        tags: ["thesis", "outline"],
        progress: 0,
        dueDate: "2026-06-20",
        startDate: "2026-06-15",
        notes: "这是一个论文研究项目的示例。",
        stageContents: {
          ...createEmptyStageMap(),
          idea: {
            notes: "先把研究问题、目标和章节结构列出来。",
            files: [
              {
                name: "IND_proposal.pdf",
                type: "pdf",
                url: "#"
              }
            ],
            links: [
              {
                title: "Reference list",
                url: "#"
              }
            ]
          },
          research: {
            notes: "当前阶段的结果记录。",
            files: [
              {
                name: "IND_results.pptx",
                type: "ppt",
                url: "#"
              }
            ],
            links: [
              {
                title: "GitHub",
                url: "#"
              }
            ]
          },
          writing: {
            notes: "正在写作时的草稿记录。",
            files: [
              {
                name: "Overleaf",
                type: "overleaf",
                url: "https://www.overleaf.com"
              }
            ],
            links: [
              {
                title: "Overleaf project",
                url: "https://www.overleaf.com"
              }
            ]
          },
          submission: {
            notes: "投递前的准备材料。",
            files: [
              {
                name: "cover_letter.docx",
                type: "doc",
                url: "#"
              }
            ],
            links: [
              {
                title: "Target journal",
                url: "#"
              }
            ]
          },
          revision: {
            notes: "审稿意见和回复策略。",
            files: [
              {
                name: "review_comments.pdf",
                type: "pdf",
                url: "#"
              }
            ],
            links: [
              {
                title: "Revision notes",
                url: "#"
              }
            ]
          }
        }
      },
      3
    ),
    makeTask(
      {
        title: "Transformer Survey",
        type: TASK_TYPES.research,
        researchStage: "research",
        project: "Transformer Survey",
        tags: ["literature", "paper"],
        progress: 40,
        dueDate: "2026-06-26",
        startDate: "2026-06-16",
        notes: "整理 5-8 篇核心文献，先写提纲再补正文。",
        stageContents: {
          ...createEmptyStageMap(),
          idea: {
            notes: "Survey 的大方向和结构。",
            files: [
              {
                name: "survey_proposal.pdf",
                type: "pdf",
                url: "#"
              }
            ],
            links: []
          },
          research: {
            notes: "当前结果和实验汇总。",
            files: [
              {
                name: "survey_results.pptx",
                type: "ppt",
                url: "#"
              },
              {
                name: "dataset.csv",
                type: "link",
                url: "#"
              }
            ],
            links: [
              {
                title: "GitHub repo",
                url: "#"
              }
            ]
          }
        }
      },
      2
    ),
    makeTask(
      {
        title: "提交组会材料",
        type: TASK_TYPES.deadline,
        researchStage: "submission",
        project: "组会",
        tags: ["deadline"],
        progress: 70,
        dueDate: "2026-06-18",
        startDate: "2026-06-14",
        startTime: "14:00",
        endTime: "15:00",
        notes: "把当前进展和下周计划整理成一页。"
      },
      1
    ),
    makeTask(
      {
        title: "出国材料准备",
        type: TASK_TYPES.workflow,
        project: "个人事务",
        tags: ["workflow", "docs"],
        progress: 0,
        dueDate: "2026-03-01",
        startDate: "2026-02-10",
        startTime: "",
        endTime: "",
        notes: "示例 workflow 任务：按清单准备材料。",
        checklist: [
          createWorkflowChecklistItem({
            name: "护照扫描",
            status: "done",
            requireFile: true,
            file: {
              name: "passport.pdf",
              url: "#"
            },
            notes: "已上传扫描件"
          }),
          createWorkflowChecklistItem({
            name: "CV",
            status: "done",
            requireFile: true,
            file: {
              name: "cv.pdf",
              url: "#"
            }
          }),
          createWorkflowChecklistItem({
            name: "学校证明",
            status: "done",
            requireFile: false,
            notes: "可后续补文件"
          }),
          createWorkflowChecklistItem({
            name: "推荐信",
            status: "todo",
            requireFile: true,
            notes: "等待导师发送"
          }),
          createWorkflowChecklistItem({
            name: "签证表格",
            status: "done",
            requireFile: true,
            file: {
              name: "visa-form.pdf",
              url: "#"
            }
          }),
          createWorkflowChecklistItem({
            name: "财产证明",
            status: "done",
            requireFile: true,
            file: {
              name: "finance-proof.pdf",
              url: "#"
            }
          })
        ]
      },
      0
    )
  ];
}
