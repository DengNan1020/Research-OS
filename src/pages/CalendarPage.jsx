import React, { useEffect, useMemo, useState } from "react";
import CalendarView from "../components/CalendarView";
import CalendarEventModal from "../components/CalendarEventModal";
import { fromISODate, toISODate } from "../utils/calendar";

export default function CalendarPage({ tasks, addTask, deleteTask, focusDate, onOpenTask }) {
  const [viewDate, setViewDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => toISODate(new Date()));
  const [open, setOpen] = useState(false);
  const [activeDate, setActiveDate] = useState(toISODate(new Date()));

  const currentMonthLabel = useMemo(() => viewDate.toLocaleString("zh-CN", { month: "long", year: "numeric" }), [viewDate]);

  useEffect(() => {
    if (focusDate) {
      const nextDate = fromISODate(focusDate);
      setViewDate(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
      setSelectedDate(focusDate);
      setActiveDate(focusDate);
    }
  }, [focusDate]);

  function moveMonth(offset) {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  }

  function handleSelectDate(date) {
    setSelectedDate(date);
  }

  function handleAddEvent(date) {
    setActiveDate(date);
    setOpen(true);
  }

  return (
    <section className="page">
      <div className="toolbar page-toolbar">
        <div className="toolbar-actions">
          <button className="secondary-button" onClick={() => moveMonth(-1)}>
            上个月
          </button>
          <button className="secondary-button" onClick={() => setViewDate(new Date())}>
            今天
          </button>
          <button className="secondary-button" onClick={() => moveMonth(1)}>
            下个月
          </button>
        </div>
      </div>

      <div className="panel section-card calendar-page-shell">
        <div className="calendar-current-label">{currentMonthLabel}</div>
        <CalendarView
          tasks={tasks}
          viewDate={viewDate}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
          onDayDoubleClick={handleAddEvent}
          onOpenTask={onOpenTask}
          onDeleteTask={deleteTask}
        />
      </div>

      <CalendarEventModal
        open={open}
        date={activeDate}
        onClose={() => setOpen(false)}
        onSubmit={(task) => {
          addTask(task);
          setOpen(false);
          setSelectedDate(activeDate);
        }}
      />
    </section>
  );
}
