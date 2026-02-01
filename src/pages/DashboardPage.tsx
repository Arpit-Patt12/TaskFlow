import { useMemo } from "react";
import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { TaskCard } from "../components/Tasks/TaskCard";
import { CheckCircle, Clock, ListTodo, TrendingUp } from "lucide-react";
import { Task } from "../types";

export const DashboardPage = () => {
  const { tasks } = useTasks();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayTasks = tasks.filter((t) => t.dueDate === today);
    const inProgress = tasks.filter((t) => t.status === "in-progress");
    const completed = tasks.filter((t) => t.status === "completed");
    const myTasks = tasks.filter((t) => t.assignedTo === currentUser?.id);

    return { todayTasks, inProgress, completed, myTasks };
  }, [tasks, currentUser]);

  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .slice(0, 5);
  }, [tasks]);

  const handleTaskClick = (task: Task) => {
    navigate(`/tasks/${task.id}`);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-700 to-rose-600 dark:from-cyan-300 dark:to-rose-400 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-lg text-slate-cyber-600 dark:text-slate-cyber-300">
          Welcome back,{" "}
          <span className="font-semibold text-cyan-600 dark:text-cyan-400">
            {currentUser?.name}
          </span>
          !
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-modern p-6 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
                Today's Tasks
              </p>
              <p className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-400 dark:from-cyan-300 dark:to-cyan-200 bg-clip-text text-transparent mt-3">
                {stats.todayTasks.length}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 rounded-2xl">
              <Clock className="w-10 h-10 text-cyan-600 dark:text-cyan-300" />
            </div>
          </div>
        </div>

        <div className="card-modern p-6 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-violet-700 dark:text-violet-300 uppercase tracking-wider">
                In Progress
              </p>
              <p className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-violet-400 dark:from-violet-300 dark:to-violet-200 bg-clip-text text-transparent mt-3">
                {stats.inProgress.length}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-violet-500/20 to-violet-400/10 rounded-2xl">
              <TrendingUp className="w-10 h-10 text-violet-600 dark:text-violet-300" />
            </div>
          </div>
        </div>

        <div className="card-modern p-6 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-rose-700 dark:text-rose-300 uppercase tracking-wider">
                Completed
              </p>
              <p className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-rose-400 dark:from-rose-300 dark:to-rose-200 bg-clip-text text-transparent mt-3">
                {stats.completed.length}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-rose-500/20 to-rose-400/10 rounded-2xl">
              <CheckCircle className="w-10 h-10 text-rose-600 dark:text-rose-300" />
            </div>
          </div>
        </div>

        <div className="card-modern p-6 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
                My Tasks
              </p>
              <p className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-400 dark:from-cyan-300 dark:to-cyan-200 bg-clip-text text-transparent mt-3">
                {stats.myTasks.length}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 rounded-2xl">
              <ListTodo className="w-10 h-10 text-cyan-600 dark:text-cyan-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
          <button
            onClick={() => navigate("/tasks")}
            className="text-sm text-cyan-700 dark:text-cyan-300 hover:underline"
          >
            View all tasks
          </button>
        </div>

        <div className="space-y-4">
          {recentTasks.length === 0 ? (
            <div className="text-center py-12">
              <ListTodo className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No tasks yet</p>
              <button
                onClick={() => navigate("/tasks")}
                className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-lg shadow-lg hover:bg-rose-600"
              >
                Create your first task
              </button>
            </div>
          ) : (
            recentTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => handleTaskClick(task)}
              />
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Filters
          </h2>
          <div className="space-y-2">
            <button
              onClick={() => navigate("/tasks")}
              className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
            >
              <p className="font-medium text-gray-900 dark:text-white">
                All Tasks
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {tasks.length} total
              </p>
            </button>
            <button
              onClick={() => navigate("/tasks")}
              className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
            >
              <p className="font-medium text-gray-900 dark:text-white">
                My Tasks
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.myTasks.length} assigned to you
              </p>
            </button>
            <button
              onClick={() => navigate("/tasks")}
              className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
            >
              <p className="font-medium text-gray-900 dark:text-white">
                High Priority
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {tasks.filter((t) => t.priority === "high").length} urgent tasks
              </p>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Task Distribution
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  In Progress
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {stats.inProgress.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-cyan-500 h-2 rounded-full"
                  style={{
                    width: `${(stats.inProgress.length / tasks.length) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Completed
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {stats.completed.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${(stats.completed.length / tasks.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
