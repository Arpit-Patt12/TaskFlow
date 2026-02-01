import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { User, Moon, Sun, LogOut } from "lucide-react";
import { getInitials } from "../utils/dateUtils";

export const SettingsPage = () => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-700 to-rose-600 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-cyan-700/70 dark:text-cyan-300/70 mt-1 font-medium">
          Manage your account and preferences
        </p>
      </div>

      <div className="glass-effect backdrop-blur-sm dark:bg-slate-cyber-800/60 border border-cyan-300/40 dark:border-cyan-500/30 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-cyan-300/30 dark:border-cyan-500/20">
          <h2 className="text-xl font-semibold text-cyan-700 dark:text-cyan-300 flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
              {currentUser ? getInitials(currentUser.name) : "U"}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-100 dark:text-cyan-100">
                {currentUser?.name}
              </h3>
              <p className="text-cyan-700/70 dark:text-cyan-300/70 font-medium">
                {currentUser?.email}
              </p>
              <span
                className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                  currentUser?.role === "admin"
                    ? "bg-gradient-to-r from-violet-500/20 to-violet-400/20 text-violet-700 dark:text-violet-300 border border-violet-400/60"
                    : "bg-gradient-to-r from-cyan-500/20 to-cyan-400/20 text-cyan-700 dark:text-cyan-300 border border-cyan-400/60"
                }`}
              >
                {currentUser?.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-cyan-200/30 dark:border-cyan-500/20">
            <div>
              <label className="block text-sm font-medium text-cyan-700 dark:text-cyan-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={currentUser?.name || ""}
                readOnly
                className="input-modern w-full px-4 py-2.5 bg-white/60 dark:bg-slate-cyber-700/50 border border-cyan-400/60 dark:border-cyan-500/40 rounded-xl text-gray-900 dark:text-cyan-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-700 dark:text-cyan-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={currentUser?.email || ""}
                readOnly
                className="input-modern w-full px-4 py-2.5 bg-white/60 dark:bg-slate-cyber-700/50 border border-cyan-400/60 dark:border-cyan-500/40 rounded-xl text-gray-900 dark:text-cyan-100 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-effect backdrop-blur-sm dark:bg-slate-cyber-800/60 border border-cyan-300/40 dark:border-cyan-500/30 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-cyan-300/30 dark:border-cyan-500/20">
          <h2 className="text-xl font-semibold text-cyan-700 dark:text-cyan-300 flex items-center gap-2">
            {theme === "light" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
            Appearance
          </h2>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-cyan-700 dark:text-cyan-300">
                Theme
              </p>
              <p className="text-sm text-cyan-700/70 dark:text-cyan-300/70">
                Choose your preferred theme
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500/20 to-cyan-400/20 hover:from-cyan-500/30 hover:to-cyan-400/30 text-cyan-700 dark:text-cyan-300 border border-cyan-400/60 dark:border-cyan-500/40 rounded-xl transition-all duration-200 font-semibold"
            >
              {theme === "light" ? (
                <>
                  <Moon className="w-4 h-4" />
                  Dark
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4" />
                  Light
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="glass-effect backdrop-blur-sm dark:bg-slate-cyber-800/60 border border-cyan-300/40 dark:border-cyan-500/30 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-cyan-300/30 dark:border-cyan-500/20">
          <h2 className="text-xl font-semibold text-cyan-700 dark:text-cyan-300 flex items-center gap-2">
            <LogOut className="w-5 h-5" />
            Account
          </h2>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-cyan-700 dark:text-cyan-300">
                Sign out
              </p>
              <p className="text-sm text-cyan-700/70 dark:text-cyan-300/70">
                Sign out of your account
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl hover:shadow-lg hover:shadow-rose-500/50 transition-all duration-200 font-semibold"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="glass-effect backdrop-blur-sm dark:bg-slate-cyber-800/40 border border-cyan-300/40 dark:border-cyan-500/20 rounded-2xl p-6">
        <p className="text-sm text-cyan-700/70 dark:text-cyan-300/70 font-medium">
          <strong className="text-cyan-700 dark:text-cyan-300">
            Demo Mode:
          </strong>{" "}
          This application is running in demo mode with localStorage. All data
          is stored locally in your browser.
        </p>
      </div>
    </div>
  );
};
