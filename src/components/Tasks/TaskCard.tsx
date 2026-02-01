import { Calendar, GripVertical } from "lucide-react";
import { Task } from "../../types";
import { useTasks } from "../../context/TaskContext";
import { formatDate, isOverdue, getInitials } from "../../utils/dateUtils";
import { PRIORITY_COLORS, PRIORITY_LABELS } from "../../utils/constants";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export const TaskCard = ({
  task,
  onClick,
  draggable,
  onDragStart,
  onDragEnd,
}: TaskCardProps) => {
  const { getUserById, getProjectById } = useTasks();
  const assignee = getUserById(task.assignedTo);
  const project = getProjectById(task.categoryId);
  const overdue = isOverdue(task.dueDate) && task.status !== "completed";

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className="card-modern bg-gradient-to-br from-white/90 dark:from-slate-cyber-800/60 to-cyan-50/50 dark:to-violet-900/20 backdrop-blur-sm border border-cyan-300/40 dark:border-cyan-500/30 rounded-2xl p-5 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
    >
      <div className="flex items-start gap-2">
        {draggable && (
          <GripVertical className="w-5 h-5 text-cyan-400/60 mt-1 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-gray-900 dark:text-cyan-100 line-clamp-2 text-sm">
              {task.title}
            </h3>
            <span
              className={`px-2 py-1 rounded-lg text-xs font-semibold flex-shrink-0 ${
                PRIORITY_COLORS[task.priority]
              }`}
            >
              {PRIORITY_LABELS[task.priority]}
            </span>
          </div>

          <p className="text-xs text-gray-600 dark:text-cyan-200/70 line-clamp-2 mb-3">
            {task.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {assignee && (
                <div
                  className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white text-xs font-bold shadow-md"
                  title={assignee.name}
                >
                  {getInitials(assignee.name)}
                </div>
              )}
              {project && (
                <span
                  className="px-2 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm"
                  style={{
                    backgroundColor: `${project.color}20`,
                    color: project.color,
                    border: `1px solid ${project.color}40`,
                  }}
                >
                  {project.name}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-xs text-cyan-600 dark:text-cyan-400 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span
                className={
                  overdue ? "text-red-600 dark:text-red-400 font-medium" : ""
                }
              >
                {formatDate(task.dueDate)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
