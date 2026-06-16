import React from "react";
import { useMemo, useState } from "react";
import { useTasks } from "./hooks/useTasks";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ResearchPage from "./pages/ResearchPage";
import MiscPage from "./pages/MiscPage";
import CalendarPage from "./pages/CalendarPage";
import Dashboard from "./pages/Dashboard";
import { toISODate } from "./utils/calendar";

export default function App() {
  const [view, setView] = useState("dashboard");
  const [calendarFocusDate, setCalendarFocusDate] = useState(() => toISODate(new Date()));
  const [researchFocusProjectId, setResearchFocusProjectId] = useState(null);
  const [workflowFocusTaskId, setWorkflowFocusTaskId] = useState(null);
  const { tasks, addTask, updateTask, deleteTask } = useTasks();

  const stats = useMemo(() => {
    const total = tasks.length;
    const research = tasks.filter((task) => task.type === "research").length;
    const misc = tasks.filter((task) => task.type === "workflow" || task.type === "misc").length;
    const deadlines = tasks.filter((task) => task.dueDate).length;

    return { total, research, misc, deadlines };
  }, [tasks]);

  function renderView() {
    const openCalendar = (date) => {
      setCalendarFocusDate(date);
      setView("calendar");
    };

    switch (view) {
      case "research":
        return (
          <ResearchPage
            tasks={tasks}
            addTask={addTask}
            updateTask={updateTask}
            deleteTask={deleteTask}
            focusedProjectId={researchFocusProjectId}
            onOpenCalendarDate={openCalendar}
            onOpenTask={(task) => {
              setResearchFocusProjectId(task.id);
              setView("research");
            }}
          />
        );
      case "misc":
        return (
          <MiscPage
            tasks={tasks}
            addTask={addTask}
            updateTask={updateTask}
            deleteTask={deleteTask}
            focusedTaskId={workflowFocusTaskId}
            onOpenCalendarDate={openCalendar}
            onOpenTask={(task) => {
              setWorkflowFocusTaskId(task.id);
              setView("misc");
            }}
          />
        );
      case "calendar":
        return (
          <CalendarPage
            tasks={tasks}
            addTask={addTask}
            deleteTask={deleteTask}
            focusDate={calendarFocusDate}
            onOpenTask={(task) => {
              if (task.type === "research") {
                setResearchFocusProjectId(task.id);
                setView("research");
              } else if (task.type === "workflow" || task.type === "misc") {
                setWorkflowFocusTaskId(task.id);
                setView("misc");
              }
            }}
          />
        );
      default:
        return (
          <Dashboard
            tasks={tasks}
            stats={stats}
            onDeleteTask={deleteTask}
            onOpenTask={(task) => {
              if (task.type === "research") {
                setResearchFocusProjectId(task.id);
                setView("research");
              } else if (task.type === "workflow" || task.type === "misc") {
                setWorkflowFocusTaskId(task.id);
                setView("misc");
              } else if (task.dueDate) {
                setCalendarFocusDate(task.dueDate);
                setView("calendar");
              }
            }}
            onOpenView={(targetView) => {
              if (targetView === "calendar") {
                setCalendarFocusDate(toISODate(new Date()));
              }
              setView(targetView);
            }}
          />
        );
    }
  }

  return (
    <div className="app-shell">
      <Sidebar view={view} setView={setView} />
      <main className="main">
        <Header view={view} />
        {renderView()}
      </main>
    </div>
  );
}
