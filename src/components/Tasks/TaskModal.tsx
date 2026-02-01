import { useState, useEffect } from "react";
import { Modal } from "../Common/Modal";
import { Task } from "../../types";
import { useTasks } from "../../context/TaskContext";
import { formatDateForInput } from "../../utils/dateUtils";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  onSuccess?: () => void;
}

export const TaskModal = ({
  isOpen,
  onClose,
  task,
  onSuccess,
}: TaskModalProps) => {
  const { addTask, updateTask, users, projects } = useTasks();
  const isEditMode = !!task;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending" as Task["status"],
    priority: "medium" as Task["priority"],
    assignedTo: "",
    dueDate: "",
    categoryId: "",
  });

  const [errors, setErrors] = useState({ title: "", dueDate: "" });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo,
        dueDate: formatDateForInput(task.dueDate),
        categoryId: task.categoryId,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        assignedTo: users[0]?.id || "",
        dueDate: "",
        categoryId: projects[0]?.id || "",
      });
    }
    setErrors({ title: "", dueDate: "" });
  }, [task, isOpen, users, projects]);

  const validate = () => {
    const newErrors = { title: "", dueDate: "" };
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if (isEditMode && task) {
      updateTask(task.id, formData);
    } else {
      addTask(formData);
    }

    onSuccess?.();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Task" : "Create New Task"}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-bold text-cyan-700 dark:text-cyan-300 mb-2 uppercase tracking-wider">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="input-modern w-full px-4 py-2.5 bg-white/50 dark:bg-slate-cyber-700/50 border border-cyan-400/60 dark:border-cyan-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-white transition-all placeholder-gray-400"
            placeholder="Enter task title"
          />
          {errors.title && (
            <p className="text-rose-600 dark:text-rose-400 text-xs mt-1 font-medium">
              {errors.title}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-cyan-700 dark:text-cyan-300 mb-2 uppercase tracking-wider">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            maxLength={500}
            className="input-modern w-full px-4 py-2.5 bg-white/50 dark:bg-slate-cyber-700/50 border border-cyan-400/60 dark:border-cyan-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-white resize-none transition-all placeholder-gray-400"
            placeholder="Enter task description"
          />
          <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-2 font-medium">
            {formData.description.length}/500 characters
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-cyan-700 dark:text-cyan-300 mb-2 uppercase tracking-wider">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as Task["status"],
                })
              }
              className="input-modern w-full px-4 py-2.5 bg-white/50 dark:bg-slate-cyber-700/50 border border-cyan-400/60 dark:border-cyan-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-cyan-700 dark:text-cyan-300 mb-2 uppercase tracking-wider">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: e.target.value as Task["priority"],
                })
              }
              className="input-modern w-full px-4 py-2.5 bg-white/50 dark:bg-slate-cyber-700/50 border border-cyan-400/60 dark:border-cyan-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-cyan-700 dark:text-cyan-300 mb-2 uppercase tracking-wider">
              Assignee
            </label>
            <select
              value={formData.assignedTo}
              onChange={(e) =>
                setFormData({ ...formData, assignedTo: e.target.value })
              }
              className="input-modern w-full px-4 py-2.5 bg-white/50 dark:bg-slate-cyber-700/50 border border-cyan-400/60 dark:border-cyan-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-cyan-700 dark:text-cyan-300 mb-2 uppercase tracking-wider">
              Due Date *
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className="input-modern w-full px-4 py-2.5 bg-white/50 dark:bg-slate-cyber-700/50 border border-cyan-400/60 dark:border-cyan-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
            />
            {errors.dueDate && (
              <p className="text-rose-600 dark:text-rose-400 text-xs mt-1 font-medium">
                {errors.dueDate}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-cyan-700 dark:text-cyan-300 mb-2 uppercase tracking-wider">
            Project
          </label>
          <select
            value={formData.categoryId}
            onChange={(e) =>
              setFormData({ ...formData, categoryId: e.target.value })
            }
            className="input-modern w-full px-4 py-2.5 bg-white/50 dark:bg-slate-cyber-700/50 border border-cyan-400/60 dark:border-cyan-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="btn-modern-secondary flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500/20 to-cyan-400/20 dark:from-cyan-600/30 dark:to-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-400/60 dark:border-cyan-500/40 rounded-xl hover:from-cyan-500/40 hover:to-cyan-400/30 transition-all duration-200 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-modern-primary flex-1 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl hover:from-rose-600 hover:to-rose-700 shadow-lg hover:shadow-rose-500/50 transition-all duration-200 font-semibold"
          >
            {isEditMode ? "Update Task" : "Create Task"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
