import React, { useEffect, useState } from "react";
import { createWorkflowChecklistItem } from "../data/workflowModel";

function createEmptyItem() {
  return createWorkflowChecklistItem({
    name: "",
    status: "todo",
    file: undefined,
    notes: ""
  });
}

function FileDropzone({ item, onUploadFile }) {
  const inputId = `workflow-create-file-${item.id}`;

  return (
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
        id={inputId}
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
          <strong>拖拽模板文件到这里</strong>
          <span>或点击选择文件</span>
        </div>
      )}
    </div>
  );
}

export default function WorkflowModal({ open, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [checklist, setChecklist] = useState([createEmptyItem()]);

  useEffect(() => {
    if (open) {
      setTitle("");
      setDueDate("");
      setChecklist([createEmptyItem()]);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  function updateItem(id, key, value) {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [key]: value
            }
          : item
      )
    );
  }

  function uploadFile(id, file) {
    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setChecklist((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                file: {
                  name: file.name,
                  url: result
                }
              }
            : item
        )
      );
    };

    reader.readAsDataURL(file);
  }

  function addItem() {
    setChecklist((prev) => [...prev, createEmptyItem()]);
  }

  function removeItem(id) {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextChecklist = checklist
      .filter((item) => item.name.trim())
      .map((item) => ({
        ...item,
        name: item.name.trim(),
        notes: item.notes?.trim() || "",
        status: item.status || "todo"
      }));

    onSubmit({
      title: title.trim(),
      type: "workflow",
      dueDate,
      checklist: nextChecklist
    });
  }

  return (
    <div className="dialog-backdrop" role="presentation" onClick={onClose}>
      <dialog className="dialog panel workflow-dialog" open onClick={(event) => event.stopPropagation()}>
        <h3>新增 workflow 任务</h3>

        <form onSubmit={handleSubmit} className="workflow-form">
          <div className="form-grid">
            <div className="field full">
              <label>标题</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="例如：出国材料准备"
                required
              />
            </div>

            <div className="field">
              <label>总 DDL</label>
              <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
            </div>
          </div>

          <div className="workflow-checklist-editor">
            {checklist.map((item, index) => (
              <section className="workflow-item-editor" key={item.id}>
                <div className="workflow-item-editor-top">
                  <strong>Checklist 项 {index + 1}</strong>
                  <button type="button" className="icon-close-button" aria-label="删除 checklist 项" onClick={() => removeItem(item.id)}>
                    ×
                  </button>
                </div>

                <div className="form-grid">
                  <div className="field full">
                    <label>名称</label>
                    <input
                      value={item.name}
                      onChange={(event) => updateItem(item.id, "name", event.target.value)}
                      placeholder="例如：护照扫描"
                    />
                  </div>

                  <div className="field full">
                    <label>模板文件</label>
                    <FileDropzone item={item} onUploadFile={(file) => uploadFile(item.id, file)} />
                  </div>
                </div>
              </section>
            ))}
          </div>

          <div className="dialog-actions dialog-actions-space">
            <button type="button" className="secondary-button" onClick={addItem}>
              添加 checklist
            </button>
            <div className="dialog-actions-inline">
              <button type="button" className="secondary-button" onClick={onClose}>
                取消
              </button>
              <button type="submit" className="primary-button">
                保存
              </button>
            </div>
          </div>
        </form>
      </dialog>
    </div>
  );
}
