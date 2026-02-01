import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { TaskModal } from "../Tasks/TaskModal";

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-cyber-50 via-slate-cyber-100 to-violet-50 dark:from-slate-cyber-900 dark:via-slate-cyber-800 dark:to-violet-900/20">
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onNewTask={() => setShowNewTaskModal(true)}
        />

        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <TaskModal
        isOpen={showNewTaskModal}
        onClose={() => setShowNewTaskModal(false)}
        task={null}
      />
    </div>
  );
};
