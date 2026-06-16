import React, { useEffect, useMemo, useState } from "react";
import TaskModal from "../components/TaskModal";
import { TASK_TYPES } from "../constants/taskTypes";
import {
  RESEARCH_STAGES,
  createEmptyStageContent,
  getStageIndex,
  getStageLabel,
  getStageProgress
} from "../constants/stages";

function getStageContent(project, stage) {
  return project?.stageContents?.[stage] || createEmptyStageContent();
}

function StageBadge({ stage }) {
  return <span className={`stage-badge stage-${stage}`}>{getStageLabel(stage)}</span>;
}

function Timeline({ project, selectedStage, onSelectStage }) {
  const currentIndex = getStageIndex(project.researchStage);

  return (
    <div className="timeline">
      {RESEARCH_STAGES.map((stage, index) => {
        const active = stage === selectedStage;
        const completed = index <= currentIndex;

        return (
          <button
            key={stage}
            type="button"
            className={`timeline-step stage-${stage} ${active ? "active" : ""} ${completed ? "completed" : ""}`}
            onClick={() => onSelectStage(stage)}
          >
            <span className="timeline-step-marker" />
            <span className="timeline-step-label">{stage}</span>
          </button>
        );
      })}
    </div>
  );
}

function ProjectList({ projects, onOpen }) {
  return (
    <div className="research-project-list">
      {projects.map((project) => (
        <button
          key={project.id}
          type="button"
          className="research-project-card panel"
          onClick={() => onOpen(project.id)}
        >
          <div className="research-project-card-top">
            <div>
              <h3>{project.title}</h3>
              <p>{project.project || "未命名项目"}</p>
            </div>
            <StageBadge stage={project.researchStage || "idea"} />
          </div>

          <div className="research-progress-bar" aria-hidden="true">
            <span style={{ width: `${project.progress || getStageProgress(project.researchStage)}%` }} />
          </div>

          <div className="research-project-meta">
            <span>当前阶段：{getStageLabel(project.researchStage)}</span>
            <span>进度：{project.progress || getStageProgress(project.researchStage)}%</span>
            <span>DDL：{project.dueDate || "无"}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function FileDropzone({ file, onUploadFile }) {
  const inputId = `research-file-${Math.random().toString(36).slice(2)}`;

  return (
    <div
      className={`workflow-dropzone ${file?.url ? "has-file" : ""}`}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const nextFile = event.dataTransfer.files?.[0];
        if (nextFile) {
          onUploadFile(nextFile);
        }
      }}
      onClick={(event) => event.currentTarget.querySelector("input[type='file']")?.click()}
      role="button"
      tabIndex={0}
    >
      <input
        id={inputId}
        className="workflow-file-input"
        type="file"
        onChange={(event) => {
          const nextFile = event.target.files?.[0];
          if (nextFile) {
            onUploadFile(nextFile);
          }
        }}
      />
      {file?.name ? (
        <div className="workflow-dropzone-content">
          <strong>{file.name}</strong>
          <span>点击或拖拽替换文件</span>
        </div>
      ) : (
        <div className="workflow-dropzone-content">
          <strong>拖拽文件到这里</strong>
          <span>或点击选择本地文件</span>
        </div>
      )}
    </div>
  );
}

function StageFileRow({ file, index, onUpdate, onRemove, onUploadFile }) {
  const isUrl = file.type === "url";

  return (
    <li className="editable-row stage-file-row">
      <div className="stage-file-row-head">
        <strong>文件 {index + 1}</strong>
        <button type="button" className="icon-close-button" aria-label="删除文件" onClick={onRemove}>
          ×
        </button>
      </div>

      <div className="stage-file-fields">
        <input
          value={file.name || ""}
          onChange={(event) => onUpdate("name", event.target.value)}
          placeholder="文件名或说明"
        />

        <select value={file.type || "pdf"} onChange={(event) => onUpdate("type", event.target.value)}>
          <option value="pdf">pdf</option>
          <option value="ppt">ppt</option>
          <option value="doc">doc</option>
          <option value="link">link</option>
          <option value="overleaf">overleaf</option>
          <option value="url">url</option>
        </select>
      </div>

      {isUrl ? (
        <input
          value={file.url || ""}
          onChange={(event) => onUpdate("url", event.target.value)}
          placeholder="粘贴 URL"
        />
      ) : (
        <FileDropzone file={file} onUploadFile={onUploadFile} />
      )}
    </li>
  );
}

function StageDetail({ project, stage, onSaveStage, onDeleteProject, onOpenCalendarDate }) {
  const content = useMemo(() => getStageContent(project, stage), [project, stage]);
  const [draftContent, setDraftContent] = useState(content);

  useEffect(() => {
    setDraftContent(content);
  }, [content]);

  const files = draftContent.files || [];
  const links = draftContent.links || [];

  function updateFile(index, key, value) {
    setDraftContent((prev) => ({
      ...prev,
      files: prev.files.map((file, fileIndex) =>
        fileIndex === index
          ? {
              ...file,
              [key]: value
            }
          : file
      )
    }));
  }

  function addFile(type = "pdf") {
    setDraftContent((prev) => ({
      ...prev,
      files: [...(prev.files || []), { name: "", type, url: "" }]
    }));
  }

  function removeFile(index) {
    setDraftContent((prev) => ({
      ...prev,
      files: prev.files.filter((_, fileIndex) => fileIndex !== index)
    }));
  }

  function updateLink(index, key, value) {
    setDraftContent((prev) => ({
      ...prev,
      links: prev.links.map((link, linkIndex) =>
        linkIndex === index
          ? {
              ...link,
              [key]: value
            }
          : link
      )
    }));
  }

  function addLink() {
    setDraftContent((prev) => ({
      ...prev,
      links: [...(prev.links || []), { title: "", url: "" }]
    }));
  }

  function removeLink(index) {
    setDraftContent((prev) => ({
      ...prev,
      links: prev.links.filter((_, linkIndex) => linkIndex !== index)
    }));
  }

  function uploadFile(index, file) {
    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      updateFile(index, "name", file.name);
      updateFile(index, "url", result);
    };

    reader.readAsDataURL(file);
  }

  return (
    <div className="stage-detail panel">
      <div className="stage-detail-header">
        <div>
          <h3>{getStageLabel(stage)}</h3>
          <p>{project.title}</p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => onSaveStage(stage, draftContent)}
        >
          保存阶段内容
        </button>
        <button type="button" className="icon-close-button" aria-label="删除研究" onClick={onDeleteProject}>
          ×
        </button>
      </div>

      <div className="detail-grid">
        <section className="detail-block">
          <h4>Notes</h4>
          <textarea
            className="stage-notes"
            value={draftContent.notes || ""}
            onChange={(event) =>
              setDraftContent((prev) => ({
                ...prev,
                notes: event.target.value
              }))
            }
            placeholder="记录这个阶段的内容"
          />
        </section>

        <section className="detail-block">
          <h4>Files</h4>
          {files.length ? (
            <ul className="file-list">
              {files.map((file, index) => (
                <StageFileRow
                  key={`${file.name}-${index}`}
                  file={file}
                  index={index}
                  onUpdate={(key, value) => updateFile(index, key, value)}
                  onRemove={() => removeFile(index)}
                  onUploadFile={(nextFile) => uploadFile(index, nextFile)}
                />
              ))}
            </ul>
          ) : (
            <div className="empty-state">暂无文件</div>
          )}
          <div className="stage-file-actions">
            <button type="button" className="secondary-button" onClick={() => addFile("url")}>
              添加 URL
            </button>
            <button type="button" className="secondary-button" onClick={() => addFile("pdf")}>
              添加文件
            </button>
          </div>
        </section>

        <section className="detail-block">
          <h4>Links</h4>
          {links.length ? (
            <ul className="link-list">
              {links.map((link, index) => (
                <li key={`${link.title}-${index}`} className="editable-row stage-link-row">
                  <button
                    type="button"
                    className="icon-close-button stage-inline-remove"
                    aria-label="删除链接"
                    onClick={() => removeLink(index)}
                  >
                    ×
                  </button>
                  <input
                    value={link.title || ""}
                    onChange={(event) => updateLink(index, "title", event.target.value)}
                    placeholder="链接标题"
                  />
                  <input
                    value={link.url || ""}
                    onChange={(event) => updateLink(index, "url", event.target.value)}
                    placeholder="链接地址"
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">暂无链接</div>
          )}
          <button type="button" className="secondary-button" onClick={addLink}>
            添加链接
          </button>
        </section>
      </div>

      <div className="detail-footer">
        <div className="detail-footer-ddl">
          <strong>DDL</strong>
          <span>{project.dueDate || "暂无"}</span>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={() => project.dueDate && onOpenCalendarDate(project.dueDate)}
          disabled={!project.dueDate}
        >
          在日历中查看
        </button>
      </div>
    </div>
  );
}

export default function ResearchPage({
  tasks,
  updateTask,
  addTask,
  deleteTask,
  onOpenCalendarDate,
  focusedProjectId
}) {
  const [open, setOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedStage, setSelectedStage] = useState("idea");

  const projects = useMemo(
    () => tasks.filter((task) => task.type === TASK_TYPES.research),
    [tasks]
  );

  const selectedProject = projects.find((project) => project.id === selectedProjectId) || null;

  useEffect(() => {
    if (focusedProjectId) {
      const focused = projects.find((project) => project.id === focusedProjectId);
      if (focused) {
        setSelectedProjectId(focused.id);
        setSelectedStage(focused.researchStage || "idea");
      }
    }
  }, [focusedProjectId, projects]);

  useEffect(() => {
    if (!selectedProjectId) {
      return;
    }

    const project = projects.find((item) => item.id === selectedProjectId);
    if (!project) {
      setSelectedProjectId(null);
    }
  }, [projects, selectedProjectId]);

  function openProject(projectId) {
    const project = projects.find((item) => item.id === projectId);
    if (!project) return;
    setSelectedProjectId(projectId);
    setSelectedStage(project.researchStage || "idea");
  }

  function saveStage(stage, content) {
    if (!selectedProject) return;

    updateTask(selectedProject.id, {
      stageContents: {
        ...(selectedProject.stageContents || {}),
        [stage]: content
      }
    });
  }

  return (
    <section className="page">
      <div className="toolbar page-toolbar">
        <div className="toolbar-actions">
          {selectedProject ? (
            <button className="secondary-button" onClick={() => setSelectedProjectId(null)}>
              返回列表
            </button>
          ) : null}
          <button className="primary-button" onClick={() => setOpen(true)}>
            新增研究项目
          </button>
        </div>
      </div>

      {!selectedProject ? (
        <div className="panel section-card">
          <ProjectList projects={projects} onOpen={openProject} />
        </div>
      ) : (
        <div className="research-workspace">
          <div className="panel section-card research-page-shell">
            <div className="research-project-detail-top">
              <div>
                <h2>{selectedProject.title}</h2>
                <p>{selectedProject.project || "研究项目"}</p>
              </div>

              <div className="research-project-detail-status">
                <StageBadge stage={selectedProject.researchStage || "idea"} />
                <span className="research-project-detail-progress">
                  {selectedProject.progress || getStageProgress(selectedProject.researchStage)}%
                </span>
              </div>
            </div>

            <div className="research-progress-bar large" aria-hidden="true">
              <span style={{ width: `${selectedProject.progress || getStageProgress(selectedProject.researchStage)}%` }} />
            </div>

            <Timeline
              project={selectedProject}
              selectedStage={selectedStage}
              onSelectStage={setSelectedStage}
            />
          </div>

          <StageDetail
            project={selectedProject}
            stage={selectedStage}
            onSaveStage={saveStage}
            onDeleteProject={() => {
              deleteTask(selectedProject.id);
              setSelectedProjectId(null);
            }}
            onOpenCalendarDate={onOpenCalendarDate}
          />
        </div>
      )}

      <TaskModal
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
