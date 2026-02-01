import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import { KanbanBoard } from "../components/Tasks/KanbanBoard";
import { TaskListView } from "../components/Tasks/TaskListView";
import { TaskModal } from "../components/Tasks/TaskModal";
import { TaskDetailModal } from "../components/Tasks/TaskDetailModal";
import { ConfirmDialog } from "../components/Common/ConfirmDialog";
import { LayoutGrid, List, Filter } from "lucide-react";
import { Task } from "../types";

export const TasksPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { tasks, deleteTask } = useTasks();
  const { currentUser } = useAuth();

  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | Task["status"]>(
    "all",
  );
  const [filterPriority, setFilterPriority] = useState<
    "all" | Task["priority"]
  >("all");
  const [filterAssignee, setFilterAssignee] = useState<"all" | "me">("all");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filterStatus !== "all" && task.status !== filterStatus) return false;
      if (filterPriority !== "all" && task.priority !== filterPriority)
        return false;
      if (filterAssignee === "me" && task.assignedTo !== currentUser?.id)
        return false;
      return true;
    });
  }, [tasks, filterStatus, filterPriority, filterAssignee, currentUser]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    navigate(`/tasks/${task.id}`);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const [pendingDeleteTaskId, setPendingDeleteTaskId] = useState<string | null>(
    null,
  );

  const handleDeleteTask = (taskId: string) => {
    // Open in-app confirmation dialog instead of browser confirm
    setPendingDeleteTaskId(taskId);
  };

  const confirmDeleteTask = (taskId: string | null) => {
    if (!taskId) return;
    deleteTask(taskId);
    navigate("/tasks");
    setPendingDeleteTaskId(null);
  };

  const cancelDeleteTask = () => setPendingDeleteTaskId(null);

  const handleCloseDetail = () => {
    setSelectedTask(null);
    navigate("/tasks");
  };

  useState(() => {
    if (taskId) {
      const task = tasks.find((t) => t.id === taskId);
      if (task) setSelectedTask(task);
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-700 to-rose-600 bg-clip-text text-transparent">
            Tasks
          </h1>
          <p className="text-cyan-700/70 dark:text-cyan-300/70 mt-2 font-medium">
            {filteredTasks.length}{" "}
            {filteredTasks.length === 1 ? "task" : "tasks"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="glass-effect backdrop-blur-sm dark:bg-slate-cyber-700/50 border border-cyan-300/40 dark:border-cyan-500/30 rounded-xl p-1">
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-4 py-2 rounded-lg transition-all duration-200 font-semibold ${
                viewMode === "kanban"
                  ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg"
                  : "text-cyan-700 dark:text-cyan-300 hover:bg-cyan-400/20"
              }`}
            >
              <LayoutGrid className="w-4 h-4 inline mr-2" />
              Kanban
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-lg transition-all duration-200 font-semibold ${
                viewMode === "list"
                  ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg"
                  : "text-cyan-700 dark:text-cyan-300 hover:bg-cyan-400/20"
              }`}
            >
              <List className="w-4 h-4 inline mr-2" />
              List
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="font-medium text-gray-900 dark:text-white">
            Filters
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-cyan-700 dark:text-cyan-300 mb-2 uppercase tracking-wider">
              <Filter className="w-3 h-3 inline mr-1" />
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="input-modern w-full px-4 py-2.5 bg-white/60 dark:bg-slate-cyber-700/50 border border-cyan-400/60 dark:border-cyan-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-cyan-700 dark:text-cyan-300 mb-2 uppercase tracking-wider">
              <Filter className="w-3 h-3 inline mr-1" />
              Priority
            </label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="input-modern w-full px-4 py-2.5 bg-white/60 dark:bg-slate-cyber-700/50 border border-cyan-400/60 dark:border-cyan-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
            >
              <option value="all">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-cyan-700 dark:text-cyan-300 mb-2 uppercase tracking-wider">
              <Filter className="w-3 h-3 inline mr-1" />
              Assignee
            </label>
            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value as any)}
              className="input-modern w-full px-4 py-2.5 bg-white/60 dark:bg-slate-cyber-700/50 border border-cyan-400/60 dark:border-cyan-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
            >
              <option value="all">All</option>
              <option value="me">Assigned to me</option>
            </select>
          </div>
        </div>
      </div>

      {viewMode === "kanban" ? (
        <KanbanBoard tasks={filteredTasks} onTaskClick={handleTaskClick} />
      ) : (
        <TaskListView
          tasks={filteredTasks}
          onTaskClick={handleTaskClick}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      )}

      <TaskModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setEditingTask(null);
        }}
        task={editingTask}
      />

      <TaskDetailModal
        isOpen={!!selectedTask}
        onClose={handleCloseDetail}
        task={selectedTask}
        onEdit={() => {
          if (selectedTask) {
            handleEditTask(selectedTask);
            setSelectedTask(null);
          }
        }}
        onDelete={() => {
          if (selectedTask) {
            handleDeleteTask(selectedTask.id);
            setSelectedTask(null);
          }
        }}
      />

      {/* In-app confirmation for deletions */}
      <ConfirmDialog
        isOpen={!!pendingDeleteTaskId}
        title="Delete Task?"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => confirmDeleteTask(pendingDeleteTaskId)}
        onCancel={cancelDeleteTask}
      />
    </div>
  );
};
