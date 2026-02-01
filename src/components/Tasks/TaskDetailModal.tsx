import { useState } from "react";
import { Modal } from "../Common/Modal";
import { Task } from "../../types";
import { useTasks } from "../../context/TaskContext";
import { useAuth } from "../../context/AuthContext";
import {
  Calendar,
  User,
  Flag,
  FolderKanban,
  Edit,
  Trash2,
  Clock,
} from "lucide-react";
import { formatDate, getInitials } from "../../utils/dateUtils";
import { PRIORITY_LABELS, STATUS_LABELS } from "../../utils/constants";

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskDetailModal = ({
  isOpen,
  onClose,
  task,
  onEdit,
  onDelete,
}: TaskDetailModalProps) => {
  const { getUserById, getProjectById, addComment, updateTask } = useTasks();
  const { currentUser } = useAuth();
  const [comment, setComment] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!task) return null;

  const assignee = getUserById(task.assignedTo);
  const project = getProjectById(task.categoryId);

  const handleAddComment = () => {
    if (comment.trim()) {
      addComment(task.id, comment.trim());
      setComment("");
    }
  };

  const handleStatusChange = (newStatus: Task["status"]) => {
    updateTask(task.id, { status: newStatus });
  };

  const handleDelete = () => {
    onDelete();
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Details" size="lg">
      <div className="p-6 space-y-6">
        <div>
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-700 to-rose-600 bg-clip-text text-transparent mb-2">
                {task.title}
              </h2>
              <p className="text-cyan-700/70 dark:text-cyan-300/70 font-medium">
                {task.description}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="p-2.5 text-cyan-600 dark:text-cyan-300 hover:bg-cyan-100/50 dark:hover:bg-cyan-600/20 rounded-lg transition-all"
                title="Edit task"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-100/50 dark:hover:bg-rose-600/20 rounded-lg transition-all"
                title="Delete task"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 p-4 glass-effect backdrop-blur-sm dark:bg-slate-cyber-800/40 border border-cyan-300/30 dark:border-cyan-500/20 rounded-xl">
            <div className="flex items-center gap-2 text-gray-700 dark:text-cyan-100">
              <User className="w-5 h-5 text-cyan-500" />
              <div>
                <p className="text-xs text-cyan-700/70 dark:text-cyan-300/70 font-medium">
                  Assignee
                </p>
                <p className="font-semibold text-gray-900 dark:text-cyan-100">
                  {assignee?.name || "Unassigned"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-700 dark:text-cyan-100">
              <Calendar className="w-5 h-5 text-cyan-500" />
              <div>
                <p className="text-xs text-cyan-700/70 dark:text-cyan-300/70 font-medium">
                  Due Date
                </p>
                <p className="font-semibold text-gray-900 dark:text-cyan-100">
                  {formatDate(task.dueDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-700 dark:text-cyan-100">
              <Flag className="w-5 h-5 text-cyan-500" />
              <div>
                <p className="text-xs text-cyan-700/70 dark:text-cyan-300/70 font-medium">
                  Priority
                </p>
                <p className="font-semibold text-gray-900 dark:text-cyan-100">
                  {PRIORITY_LABELS[task.priority]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-700 dark:text-cyan-100">
              <FolderKanban className="w-5 h-5 text-cyan-500" />
              <div>
                <p className="text-xs text-cyan-700/70 dark:text-cyan-300/70 font-medium">
                  Project
                </p>
                <p className="font-semibold text-gray-900 dark:text-cyan-100">
                  {project?.name || "No project"}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-cyan-700 dark:text-cyan-300 mb-2 uppercase tracking-wider">
              Status
            </label>
            <select
              value={task.status}
              onChange={(e) =>
                handleStatusChange(e.target.value as Task["status"])
              }
              className="input-modern w-full px-4 py-2.5 bg-white/60 dark:bg-slate-cyber-700/50 border border-cyan-400/60 dark:border-cyan-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
            >
              <option value="pending">{STATUS_LABELS.pending}</option>
              <option value="in-progress">
                {STATUS_LABELS["in-progress"]}
              </option>
              <option value="completed">{STATUS_LABELS.completed}</option>
            </select>
          </div>

          <div className="flex items-center gap-4 text-xs text-cyan-700/70 dark:text-cyan-300/70 pb-6 border-b border-cyan-200/30 dark:border-cyan-600/20 font-medium">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Created {formatDate(task.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Updated {formatDate(task.updatedAt)}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-700 to-rose-600 bg-clip-text text-transparent mb-4">
            Comments ({task.comments.length})
          </h3>

          <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
            {task.comments.map((c) => {
              const commentUser = getUserById(c.userId);
              return (
                <div
                  key={c.id}
                  className="flex gap-3 p-3 glass-effect backdrop-blur-sm dark:bg-slate-cyber-800/40 border border-cyan-300/30 dark:border-cyan-500/20 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md">
                    {commentUser ? getInitials(commentUser.name) : "U"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 dark:text-cyan-100">
                        {commentUser?.name || "Unknown"}
                      </span>
                      <span className="text-xs text-cyan-700/70 dark:text-cyan-300/70 font-medium">
                        {formatDate(c.date)}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-cyan-100">{c.text}</p>
                  </div>
                </div>
              );
            })}

            {task.comments.length === 0 && (
              <p className="text-cyan-700/60 dark:text-cyan-300/60 text-center py-6 font-medium">
                No comments yet
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
              placeholder="Add a comment..."
              className="input-modern flex-1 px-4 py-2.5 bg-white/60 dark:bg-slate-cyber-700/50 border border-cyan-400/60 dark:border-cyan-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-white transition-all placeholder-gray-400"
            />
            <button
              onClick={handleAddComment}
              disabled={!comment.trim()}
              className="btn-modern-primary px-6 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 disabled:from-rose-400 disabled:to-rose-400 text-white rounded-xl shadow-lg hover:shadow-rose-500/50 transition-all duration-200 font-semibold"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 rounded-lg">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Delete Task?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this task? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
