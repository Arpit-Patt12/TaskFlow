import {
  LayoutDashboard,
  ListTodo,
  Users,
  FolderKanban,
  Settings,
  X,
  Plus,
  Mail,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTeamInvitation } from "../../context/TeamInvitationContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewTask: () => void;
}

export const Sidebar = ({ isOpen, onClose, onNewTask }: SidebarProps) => {
  const { pendingInvites } = useTeamInvitation();

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/tasks", icon: ListTodo, label: "Tasks" },
    { to: "/projects", icon: FolderKanban, label: "Projects" },
    { to: "/team", icon: Users, label: "Team" },
    {
      to: "/invitations",
      icon: Mail,
      label: "Invitations",
      badge: pendingInvites.length,
    },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-cyber-800 border-r border-cyan-300 dark:border-cyan-600 transform transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 lg:hidden border-b border-cyan-300 dark:border-cyan-600">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Menu
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4">
            <button
              onClick={() => {
                onNewTask();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              New Task
            </button>
          </div>

          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative ${
                    isActive
                      ? "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300"
                      : "text-slate-cyber-700 dark:text-slate-cyber-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-rose-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-cyan-300 dark:border-cyan-600">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p className="font-medium">TaskFlow v1.0</p>
              <p className="mt-1">Demo Mode</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
