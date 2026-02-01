import { useState, useMemo } from "react";
import { Task } from "../../types";
import { useTasks } from "../../context/TaskContext";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import { formatDate, getInitials } from "../../utils/dateUtils";
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  PRIORITY_COLORS,
} from "../../utils/constants";

interface TaskListViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

type SortField = "title" | "assignedTo" | "priority" | "dueDate" | "status";
type SortOrder = "asc" | "desc";

export const TaskListView = ({
  tasks,
  onTaskClick,
  onEditTask,
  onDeleteTask,
}: TaskListViewProps) => {
  const { getUserById, getProjectById, updateTask } = useTasks();
  const [sortField, setSortField] = useState<SortField>("dueDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === "assignedTo") {
        aValue = getUserById(a.assignedTo)?.name || "";
        bValue = getUserById(b.assignedTo)?.name || "";
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [tasks, sortField, sortOrder, getUserById]);

  const SortButton = ({
    field,
    label,
  }: {
    field: SortField;
    label: string;
  }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-cyan-700 dark:text-cyan-300 hover:text-cyan-900 dark:hover:text-cyan-100 transition-colors"
    >
      {label}
      <ArrowUpDown className="w-4 h-4" />
    </button>
  );

  return (
    <div className="glass-effect backdrop-blur-sm dark:bg-slate-cyber-800/60 border border-cyan-300/40 dark:border-cyan-500/30 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="glass-effect backdrop-blur-sm dark:bg-slate-cyber-700/40 border-b border-cyan-300/30 dark:border-cyan-500/20">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
                <SortButton field="title" label="Title" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <SortButton field="assignedTo" label="Assignee" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <SortButton field="priority" label="Priority" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <SortButton field="dueDate" label="Due Date" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <SortButton field="status" label="Status" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-200/30 dark:divide-cyan-600/20">
            {sortedTasks.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-cyan-700/60 dark:text-cyan-300/60 font-medium"
                >
                  No tasks found
                </td>
              </tr>
            ) : (
              sortedTasks.map((task) => {
                const assignee = getUserById(task.assignedTo);
                const project = getProjectById(task.categoryId);

                return (
                  <tr
                    key={task.id}
                    className="hover:bg-cyan-400/20 dark:hover:bg-cyan-600/20 cursor-pointer transition-colors"
                    onClick={() => onTaskClick(task)}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-cyan-100">
                          {task.title}
                        </p>
                        {project && (
                          <span
                            className="inline-block mt-2 px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm border"
                            style={{
                              backgroundColor: `${project.color}15`,
                              color: project.color,
                              borderColor: `${project.color}40`,
                            }}
                          >
                            {project.name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                          {assignee ? getInitials(assignee.name) : "U"}
                        </div>
                        <span className="text-gray-900 dark:text-cyan-100 font-medium">
                          {assignee?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${PRIORITY_COLORS[task.priority]}`}
                      >
                        {PRIORITY_LABELS[task.priority]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-cyan-100 font-medium">
                      {formatDate(task.dueDate)}
                    </td>
                    <td
                      className="px-6 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        value={task.status}
                        onChange={(e) =>
                          updateTask(task.id, {
                            status: e.target.value as Task["status"],
                          })
                        }
                        className="input-modern px-3 py-1.5 bg-white/60 dark:bg-slate-cyber-700/50 border border-cyan-400/60 dark:border-cyan-500/40 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      >
                        <option value="pending">{STATUS_LABELS.pending}</option>
                        <option value="in-progress">
                          {STATUS_LABELS["in-progress"]}
                        </option>
                        <option value="completed">
                          {STATUS_LABELS.completed}
                        </option>
                      </select>
                    </td>
                    <td
                      className="px-6 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEditTask(task)}
                          className="p-2 text-cyan-600 dark:text-cyan-300 hover:bg-cyan-100/50 dark:hover:bg-cyan-600/20 rounded-lg transition-all"
                          title="Edit task"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-100/50 dark:hover:bg-rose-600/20 rounded-lg transition-all"
                          title="Delete task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
