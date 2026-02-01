import { useState } from "react";
import { Task } from "../../types";
import { useTasks } from "../../context/TaskContext";
import { TaskCard } from "./TaskCard";
import { STATUS_LABELS } from "../../utils/constants";

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

type Column = "pending" | "in-progress" | "completed";

export const KanbanBoard = ({ tasks, onTaskClick }: KanbanBoardProps) => {
  const { updateTask } = useTasks();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState<Column | null>(
    null,
  );

  const columns: Column[] = ["pending", "in-progress", "completed"];

  const getTasksByStatus = (status: Column) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDraggedOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, column: Column) => {
    e.preventDefault();
    setDraggedOverColumn(column);
  };

  const handleDragLeave = () => {
    setDraggedOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, column: Column) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== column) {
      updateTask(draggedTask.id, { status: column });
    }
    setDraggedTask(null);
    setDraggedOverColumn(null);
  };

  const columnColors = {
    pending:
      "glass-effect backdrop-blur-sm dark:bg-slate-cyber-800/40 border border-cyan-300/30 dark:border-cyan-500/20",
    "in-progress":
      "glass-effect backdrop-blur-sm dark:bg-violet-900/20 border border-violet-300/30 dark:border-violet-500/20",
    completed:
      "glass-effect backdrop-blur-sm dark:bg-emerald-900/20 border border-emerald-300/30 dark:border-emerald-500/20",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column);
        const isOver = draggedOverColumn === column;

        return (
          <div
            key={column}
            onDragOver={(e) => handleDragOver(e, column)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column)}
            className={`rounded-2xl p-5 min-h-[500px] transition-all duration-200 ${
              columnColors[column]
            } ${isOver ? "ring-2 ring-cyan-500 shadow-lg" : ""}`}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-cyan-900 dark:text-cyan-100 text-lg">
                {STATUS_LABELS[column]}
              </h3>
              <span className="px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-cyan-400/20 dark:from-cyan-600/30 dark:to-cyan-500/20 border border-cyan-400/60 dark:border-cyan-500/40 rounded-full text-xs font-bold text-cyan-700 dark:text-cyan-300">
                {columnTasks.length}
              </span>
            </div>

            <div className="space-y-3">
              {columnTasks.length === 0 ? (
                <div className="text-center py-12 text-cyan-600/50 dark:text-cyan-400/50">
                  <p className="text-sm font-medium">No tasks</p>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick(task)}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    onDragEnd={handleDragEnd}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
