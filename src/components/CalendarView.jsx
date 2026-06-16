import React from "react";
import { formatDate } from "../utils/date";
import {
  buildMonthGrid,
  fromISODate,
  formatCalendarDate,
  isSameDay,
  isSameMonth,
  monthLabel,
  toISODate
} from "../utils/calendar";
import { TASK_TYPES } from "../constants/taskTypes";

function getTaskLabel(task) {
  if (task.type === TASK_TYPES.workflow) return "杂事";
  if (task.type === TASK_TYPES.research) return "研究";
  if (task.type === TASK_TYPES.deadline) return "日历";
  return task.type || "事项";
}

function getChipClass(task) {
  if (task.type === TASK_TYPES.workflow) return "workflow";
  if (task.type === TASK_TYPES.research) return "research";
  if (task.type === TASK_TYPES.deadline) return "deadline";
  return "default";
}

function getTaskTimeSortValue(task) {
  if (!task?.startTime) {
    return Number.POSITIVE_INFINITY;
  }

  const [hours = "0", minutes = "0"] = task.startTime.split(":");
  return Number(hours) * 60 + Number(minutes);
}

function formatTaskTimeRange(task) {
  if (task.startTime && task.endTime) {
    return `${task.startTime} - ${task.endTime}`;
  }

  if (task.startTime) {
    return `${task.startTime} 起`;
  }

  return "全天";
}

function DayDetailPanel({ selectedDate, selectedTasks, onOpenTask, onDeleteTask }) {
  if (!selectedDate) {
    return <div className="empty-state">点击一个日期查看当天事项。</div>;
  }

  return (
    <div className="calendar-day-detail panel">
      <div className="calendar-day-detail-header">
        <h3>{formatCalendarDate(selectedDate)}</h3>
        <span>{selectedTasks.length} 个事项</span>
      </div>

      {selectedTasks.length ? (
        <div className="calendar-day-detail-list">
          {selectedTasks.map((task) => (
            <div className={`calendar-schedule-item ${getChipClass(task)}`} key={task.id}>
              <button
                type="button"
                className="icon-close-button calendar-item-close"
                aria-label="删除"
                onClick={() => onDeleteTask?.(task.id)}
              >
                ×
              </button>
              <button
                type="button"
                className="calendar-detail-button calendar-schedule-content"
                onClick={() => onOpenTask?.(task)}
              >
                <div className="calendar-schedule-time">
                  {formatTaskTimeRange(task)}
                </div>
                <div className="calendar-schedule-body">
                  <div className="calendar-detail-item-top">
                    <strong>{task.title}</strong>
                    <span className="calendar-detail-pill">{getTaskLabel(task)}</span>
                  </div>
                  <div className="calendar-detail-meta">
                    {task.type === TASK_TYPES.research ? (
                      <span>阶段：{task.researchStage || "-"}</span>
                    ) : null}
                    {task.dueDate ? <span>日期：{formatDate(task.dueDate)}</span> : null}
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">这一天还没有事项。</div>
      )}
    </div>
  );
}

export default function CalendarView({
  tasks,
  viewDate,
  selectedDate,
  onSelectDate,
  onDayDoubleClick,
  onOpenTask,
  onDeleteTask
}) {
  const todayISO = toISODate(new Date());
  const { days } = buildMonthGrid(viewDate);
  const dueTasks = tasks.filter((task) => task.dueDate);

  const tasksByDay = dueTasks.reduce((acc, task) => {
    if (!acc[task.dueDate]) {
      acc[task.dueDate] = [];
    }
    acc[task.dueDate].push(task);
    return acc;
  }, {});

  const activeDate = selectedDate ? fromISODate(selectedDate) : null;
  const selectedTasks = selectedDate ? [...(tasksByDay[selectedDate] || [])].sort((a, b) => {
    const timeDiff = getTaskTimeSortValue(a) - getTaskTimeSortValue(b);
    if (timeDiff !== 0) {
      return timeDiff;
    }
    return fromISODate(a.dueDate || selectedDate) - fromISODate(b.dueDate || selectedDate);
  }) : [];

  return (
    <div className="calendar-shell">
      <div className="calendar-layout">
        <div className="calendar-main panel">
          <div className="calendar-header-row">
            <div>
              <h2>{monthLabel(viewDate)}</h2>
            </div>
          </div>

          <div className="calendar-weekdays">
            {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
              <div key={day} className="calendar-weekday">
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-grid">
            {days.map((day) => {
              const iso = toISODate(day);
              const dayTasks = tasksByDay[iso] || [];
              const inMonth = isSameMonth(day, viewDate);
              const isActive = activeDate ? isSameDay(day, activeDate) : false;
              const isToday = iso === todayISO;

              return (
                <button
                  key={iso}
                  type="button"
                  className={`calendar-cell ${inMonth ? "" : "outside-month"} ${isActive ? "active" : ""} ${isToday ? "today" : ""}`}
                  onClick={() => onSelectDate(iso)}
                  onDoubleClick={() => onDayDoubleClick(iso)}
                >
                  <span className="calendar-day-number">{day.getDate()}</span>

                  <div className="calendar-task-list">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div className={`calendar-task-chip ${getChipClass(task)}`} key={task.id}>
                        <span className="calendar-task-chip-label">{getTaskLabel(task)}</span>
                        <span className="calendar-task-chip-title">{task.title}</span>
                      </div>
                    ))}

                    {dayTasks.length > 3 ? (
                      <div className="calendar-more">+{dayTasks.length - 3} more</div>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="calendar-side">
          <DayDetailPanel
            selectedDate={activeDate}
            selectedTasks={selectedTasks}
            onOpenTask={onOpenTask}
            onDeleteTask={onDeleteTask}
          />

          <div className="calendar-list-panel panel">
            <div className="calendar-list-title">本月事项</div>
            {dueTasks.length ? (
              <div className="calendar-list">
                {dueTasks
                  .filter((task) => isSameMonth(fromISODate(task.dueDate), viewDate))
                  .sort((a, b) => {
                    const dayDiff = fromISODate(a.dueDate) - fromISODate(b.dueDate);
                    if (dayDiff !== 0) {
                      return dayDiff;
                    }
                    return getTaskTimeSortValue(a) - getTaskTimeSortValue(b);
                  })
                  .map((task) => (
                    <div className={`calendar-list-item ${getChipClass(task)}`} key={task.id}>
                      <button
                        type="button"
                        className="icon-close-button calendar-item-close"
                        aria-label="删除"
                        onClick={() => onDeleteTask?.(task.id)}
                      >
                        ×
                      </button>
                      <button
                        type="button"
                        className="calendar-detail-button calendar-schedule-content"
                        onClick={() => onOpenTask?.(task)}
                      >
                        <div className="calendar-list-time">{formatTaskTimeRange(task)}</div>
                        <strong>{task.title}</strong>
                        <span>
                          {getTaskLabel(task)} · {formatDate(task.dueDate)}
                        </span>
                      </button>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="empty-state">本月暂无带截止日期的事项。</div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
