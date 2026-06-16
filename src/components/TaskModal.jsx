import React, { useEffect, useState } from "react";
import { RESEARCH_STAGES } from "../constants/stages";
import { TASK_TYPES } from "../constants/taskTypes";
import { TaskModel } from "../data/taskModel";

const emptyForm = {
  ...TaskModel,
  title: "",
  type: TASK_TYPES.research,
  researchStage: "idea",
  tags: "",
  dueDate: "",
  startDate: "",
  notes: ""
};

export default function TaskModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (open) {
      setForm({
        ...emptyForm,
        title: ""
      });
    }
  }, [open]);

  if (!open) {
    return null;
  }

  function updateField(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }));
  }

  function submitForm(event) {
    event.preventDefault();

    const tags = form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    onSubmit({
      ...form,
      tags,
      type: TASK_TYPES.research,
      researchStage: form.researchStage || "idea"
    });
  }

  return (
    <div className="dialog-backdrop" role="presentation" onClick={onClose}>
      <dialog className="dialog panel" open onClick={(event) => event.stopPropagation()}>
        <h3>新增研究内容</h3>

        <form onSubmit={submitForm}>
          <div className="form-grid">
            <div className="field full">
              <label>标题</label>
              <input
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="输入任务标题"
                required
              />
            </div>

            <div className="field">
              <label>阶段</label>
              <select
                value={form.researchStage}
                onChange={(event) => updateField("researchStage", event.target.value)}
              >
                {RESEARCH_STAGES.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>截止日期</label>
              <input type="date" value={form.dueDate} onChange={(event) => updateField("dueDate", event.target.value)} />
            </div>

            <div className="field">
              <label>开始日期</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(event) => updateField("startDate", event.target.value)}
              />
            </div>

            <div className="field full">
              <label>标签</label>
              <input
                value={form.tags}
                onChange={(event) => updateField("tags", event.target.value)}
                placeholder="用英文逗号分隔，例如 paper, thesis"
              />
            </div>

            <div className="field full">
              <label>备注</label>
              <textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} />
            </div>
          </div>

          <div className="dialog-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="primary-button">
              保存
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
