import React, { useMemo, useState } from "react";
import { getWorkflowProgress } from "../data/workflowModel";

function ChecklistSummaryItem({ item, active, onSelect }) {
  const isDone = item.status === "done";

  return (
    <button
      type="button"
      className={`workflow-summary-item ${active ? "active" : ""}`}
      onClick={onSelect}
    >
      <span className="workflow-summary-title">{item.name || "未命名项"}</span>
      <span className={`workflow-summary-state ${isDone ? "done" : "todo"}`}>
        {isDone ? "✅" : "❌"}
      </span>
    </button>
  );
}

function ChecklistEditor({ item, onChange, onRemove, onUploadFile }) {
  return (
    <section className="workflow-item-editor">
      <div className="workflow-item-editor-top">
        <div className="workflow-item-state">
          <label className="inline-check">
            <input
              type="checkbox"
              checked={item.status === "done"}
              onChange={(event) => onChange({ status: event.target.checked ? "done" : "todo" })}
            />
            <span>{item.status === "done" ? "已完成" : "未完成"}</span>
          </label>
        </div>

        <button type="button" className="icon-close-button" aria-label="删除" onClick={onRemove}>
          ×
        </button>
      </div>

      <div className="form-grid">
        <div className="field full">
          <label>名称</label>
          <input value={item.name} onChange={(event) => onChange({ name: event.target.value })} />
        </div>

        <div className="field">
          <label>完成状态</label>
          <select value={item.status} onChange={(event) => onChange({ status: event.target.value })}>
            <option value="todo">未完成</option>
            <option value="done">已完成</option>
          </select>
        </div>

        <div className="field full">
          <label>文件上传</label>
          <div
            className={`workflow-dropzone ${item.file?.name ? "has-file" : ""}`}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const file = event.dataTransfer.files?.[0];
              if (file) {
                onUploadFile(file);
              }
            }}
            onClick={(event) => event.currentTarget.querySelector("input[type='file']")?.click()}
            role="button"
            tabIndex={0}
          >
            <input
              id={`workflow-file-${item.id}`}
              className="workflow-file-input"
              type="file"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  onUploadFile(file);
                }
              }}
            />
            {item.file?.name ? (
              <div className="workflow-dropzone-content">
                <strong>{item.file.name}</strong>
                <span>已上传，点击或拖拽可替换</span>
              </div>
            ) : (
              <div className="workflow-dropzone-content">
                <strong>拖拽文件到这里</strong>
                <span>或点击选择文件</span>
              </div>
            )}
          </div>
        </div>

        <div className="field full">
          <label>备注</label>
          <textarea value={item.notes || ""} onChange={(event) => onChange({ notes: event.target.value })} />
        </div>
      </div>
    </section>
  );
}

export default function WorkflowDetail({ task, onUpdate, onDelete, onBack, onOpenCalendarDate }) {
  const [selectedItemId, setSelectedItemId] = useState(task.checklist[0]?.id || null);
  const [uploadError, setUploadError] = useState("");

  const progress = getWorkflowProgress(task.checklist);

  const selectedItem = useMemo(
    () => task.checklist.find((item) => item.id === selectedItemId) || task.checklist[0] || null,
    [task.checklist, selectedItemId]
  );

  function updateChecklistItem(itemId, updates) {
    const checklist = task.checklist.map((item) =>
      item.id === itemId
        ? {
            ...item,
            ...updates
          }
        : item
    );

    onUpdate({
      checklist
    });
  }

  function addChecklistItem() {
    const nextItem = {
      id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`,
      name: "",
      status: "todo",
      file: { name: "", url: "" },
      notes: ""
    };

    onUpdate({
      checklist: [...task.checklist, nextItem]
    });
    setSelectedItemId(nextItem.id);
  }

  function uploadFileForItem(itemId, file) {
    if (!file) {
      return;
    }

    setUploadError("");

    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      updateChecklistItem(itemId, {
        file: {
          name: file.name,
          url: result
        }
      });
    };

    reader.onerror = () => {
      setUploadError("文件读取失败，请重试。");
    };

    reader.readAsDataURL(file);
  }

  function removeChecklistItem(itemId) {
    const nextChecklist = task.checklist.filter((item) => item.id !== itemId);
    onUpdate({
      checklist: nextChecklist
    });

    if (selectedItemId === itemId) {
      setSelectedItemId(nextChecklist[0]?.id || null);
    }
  }

  return (
    <div className="panel section-card workflow-detail">
      <div className="workflow-detail-top">
        <div>
          <h2>{task.title}</h2>
        </div>

        <div className="workflow-detail-actions">
          <button className="secondary-button" onClick={onBack}>
            返回列表
          </button>
          <button type="button" className="icon-close-button" aria-label="删除任务" onClick={onDelete}>
            ×
          </button>
        </div>
      </div>

      <div className="workflow-detail-grid">
        <aside className="workflow-checklist-column panel">
          <div className="workflow-summary-header">
            <h3>Checklist</h3>
            <span className="workflow-progress-label">{task.checklist.length} 项 · {progress}%</span>
          </div>

          <div className="workflow-summary-list">
            {task.checklist.length ? (
              task.checklist.map((item) => (
                <ChecklistSummaryItem
                  key={item.id}
                  item={item}
                  active={item.id === selectedItem?.id}
                  onSelect={() => setSelectedItemId(item.id)}
                />
              ))
            ) : (
              <div className="empty-state">还没有 checklist，先添加一项。</div>
            )}
          </div>

          <div className="workflow-progress-wrap">
            <div className="workflow-progress-bar large">
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>

          <button type="button" className="primary-button workflow-add-button" onClick={addChecklistItem}>
            添加 checklist item
          </button>
        </aside>

        <section className="workflow-detail-column">
          <div className="workflow-detail-meta">
            <div className="detail-footer-ddl compact">
              <strong>总 DDL</strong>
              <input
                className="workflow-inline-input"
                type="date"
                value={task.dueDate || ""}
                onChange={(event) => onUpdate({ dueDate: event.target.value })}
              />
            </div>
            <div className="detail-footer-ddl compact">
              <strong>进度</strong>
              <span>{progress}%</span>
            </div>
          </div>

          {selectedItem ? (
            <ChecklistEditor
              item={selectedItem}
              onChange={(updates) => updateChecklistItem(selectedItem.id, updates)}
              onRemove={() => removeChecklistItem(selectedItem.id)}
              onUploadFile={(file) => uploadFileForItem(selectedItem.id, file)}
            />
          ) : (
            <div className="empty-state">点击左侧 checklist 项，查看文件和状态。</div>
          )}

          <div className="detail-footer">
            <button
              type="button"
              className="secondary-button"
              onClick={() => task.dueDate && onOpenCalendarDate(task.dueDate)}
              disabled={!task.dueDate}
            >
              在日历中查看
            </button>
          </div>

          {uploadError ? <div className="workflow-upload-error">{uploadError}</div> : null}
        </section>
      </div>
    </div>
  );
}
