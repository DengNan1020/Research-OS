import React, { useEffect, useState } from "react";
import { TASK_TYPES } from "../constants/taskTypes";

export default function CalendarEventModal({ open, date, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  useEffect(() => {
    if (open) {
      setTitle("");
      setStartTime("09:00");
      setEndTime("10:00");
    }
  }, [open, date]);

  if (!open) {
    return null;
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      title: title.trim(),
      type: TASK_TYPES.deadline,
      dueDate: date,
      startTime,
      endTime,
      notes: ""
    });
  }

  return (
    <div className="dialog-backdrop" role="presentation" onClick={onClose}>
      <dialog className="dialog panel workflow-dialog" open onClick={(event) => event.stopPropagation()}>
        <h3>新增日历事项</h3>

        <form onSubmit={handleSubmit} className="workflow-form">
          <div className="form-grid">
            <div className="field full">
              <label>日期</label>
              <input type="date" value={date || ""} readOnly />
            </div>

            <div className="field full">
              <label>标题</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="例如：组会准备"
                required
              />
            </div>

            <div className="field">
              <label>开始时间</label>
              <input type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} required />
            </div>

            <div className="field">
              <label>结束时间</label>
              <input type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} required />
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
