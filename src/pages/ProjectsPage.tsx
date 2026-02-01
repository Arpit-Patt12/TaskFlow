import { useState } from "react";
import { useTasks } from "../context/TaskContext";
import { Modal } from "../components/Common/Modal";
import { ConfirmDialog } from "../components/Common/ConfirmDialog";
import { FolderKanban, Edit, Trash2, Plus } from "lucide-react";
import { Project } from "../types";

export const ProjectsPage = () => {
  const { projects, tasks, addProject, updateProject, deleteProject } =
    useTasks();
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({ name: "", color: "#3b82f6" });

  const getProjectTaskCount = (projectId: string) => {
    return tasks.filter((t) => t.categoryId === projectId).length;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      updateProject(editingProject.id, formData);
    } else {
      addProject(formData);
    }
    setShowModal(false);
    setEditingProject(null);
    setFormData({ name: "", color: "#3b82f6" });
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({ name: project.name, color: project.color });
    setShowModal(true);
  };

  const [pendingDeleteProjectId, setPendingDeleteProjectId] = useState<
    string | null
  >(null);

  const handleDelete = (projectId: string) => {
    setPendingDeleteProjectId(projectId);
  };

  const confirmDeleteProject = (projectId: string | null) => {
    if (!projectId) return;
    deleteProject(projectId);
    setPendingDeleteProjectId(null);
  };

  const cancelDeleteProject = () => setPendingDeleteProjectId(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-700 to-rose-600 bg-clip-text text-transparent">
            Projects
          </h1>
          <p className="text-cyan-700/70 dark:text-cyan-300/70 mt-2 font-medium">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProject(null);
            setFormData({ name: "", color: "#2B5278" });
            setShowModal(true);
          }}
          className="btn-modern-primary flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl shadow-lg hover:shadow-rose-500/50 transition-all duration-200 font-semibold"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="card-modern glass-effect backdrop-blur-sm dark:bg-slate-cyber-800/60 border border-cyan-300/40 dark:border-cyan-500/30 rounded-2xl p-6 hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center shadow-md backdrop-blur-sm"
                  style={{ backgroundColor: `${project.color}20` }}
                >
                  <FolderKanban
                    className="w-7 h-7"
                    style={{ color: project.color }}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-cyan-100">
                    {project.name}
                  </h3>
                  <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                    {getProjectTaskCount(project.id)} tasks
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="p-2 text-cyan-600 dark:text-cyan-300 hover:bg-cyan-100/50 dark:hover:bg-cyan-600/20 rounded-lg transition-all"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-100/50 dark:hover:bg-rose-600/20 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="w-full bg-gradient-to-r from-cyan-200/30 to-rose-200/30 dark:from-cyan-600/20 dark:to-rose-600/20 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full bg-gradient-to-r transition-all duration-300"
                style={{
                  backgroundImage: `linear-gradient(90deg, ${project.color}, ${project.color}dd)`,
                  width: `${Math.min((getProjectTaskCount(project.id) / tasks.length) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="glass-effect backdrop-blur-sm dark:bg-slate-cyber-800/60 border border-cyan-300/40 dark:border-cyan-500/30 rounded-2xl p-12 text-center">
          <FolderKanban className="w-16 h-16 text-cyan-400/40 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-cyan-100 mb-2">
            No projects yet
          </h3>
          <p className="text-cyan-700/70 dark:text-cyan-300/70 mb-6 font-medium">
            Create your first project to organize your tasks
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-modern-primary px-8 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl shadow-lg hover:shadow-rose-500/50 transition-all duration-200 font-semibold"
          >
            Create Project
          </button>
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingProject(null);
        }}
        title={editingProject ? "Edit Project" : "New Project"}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-cyan-700 dark:text-cyan-300 mb-2 uppercase tracking-wider">
              Project Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="input-modern w-full px-4 py-2.5 bg-white/60 dark:bg-slate-cyber-700/50 border border-cyan-400/60 dark:border-cyan-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-white transition-all placeholder-gray-400"
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-cyan-700 dark:text-cyan-300 mb-2 uppercase tracking-wider">
              Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="w-16 h-12 rounded-lg border-2 border-cyan-400/60 dark:border-cyan-500/40 cursor-pointer transition-all hover:scale-110"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="input-modern flex-1 px-4 py-2.5 bg-white/60 dark:bg-slate-cyber-700/50 border border-cyan-400/60 dark:border-cyan-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setEditingProject(null);
              }}
              className="btn-modern-secondary flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500/20 to-cyan-400/20 dark:from-cyan-600/30 dark:to-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-400/60 dark:border-cyan-500/40 rounded-xl hover:from-cyan-500/40 hover:to-cyan-400/30 transition-all duration-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-modern-primary flex-1 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl shadow-lg hover:shadow-rose-500/50 transition-all duration-200 font-semibold"
            >
              {editingProject ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!pendingDeleteProjectId}
        title="Delete Project?"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => confirmDeleteProject(pendingDeleteProjectId)}
        onCancel={cancelDeleteProject}
      />
    </div>
  );
};
