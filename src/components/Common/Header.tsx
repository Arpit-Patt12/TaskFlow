import { useState, useRef, useEffect } from "react";
import { Menu, Moon, Sun, LogOut, User, Settings, Mail } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { SearchBar } from "./SearchBar";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../../utils/dateUtils";
import { useTeamInvitation } from "../../context/TeamInvitationContext";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const { pendingInvites } = useTeamInvitation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white dark:bg-slate-cyber-800 border-b border-cyan-300 dark:border-cyan-600 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/20"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-slate-cyber-600 dark:text-slate-cyber-300" />
          </button>
          <h1 className="text-xl font-bold text-cyan-700 dark:text-cyan-300">
            TaskFlow
          </h1>
        </div>

        <div className="hidden md:block flex-1 max-w-2xl mx-8">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigate("/invitations");
            }}
            className="relative p-2 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/20 transition-colors"
            aria-label="Invitations"
          >
            <Mail className="w-5 h-5 text-slate-cyber-600 dark:text-slate-cyber-300" />
            {pendingInvites.length > 0 && (
              <span className="absolute top-0 right-0 bg-rose-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {pendingInvites.length}
              </span>
            )}
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/20 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-slate-cyber-600 dark:text-slate-cyber-300" />
            ) : (
              <Sun className="w-5 h-5 text-slate-cyber-300" />
            )}
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/20"
            >
              <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white text-sm font-medium shadow-lg">
                {currentUser ? getInitials(currentUser.name) : "U"}
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-cyber-800 border border-cyan-300 dark:border-cyan-600 rounded-lg shadow-lg py-1">
                <div className="px-4 py-3 border-b border-cyan-300 dark:border-cyan-600">
                  <p className="text-sm font-medium text-slate-cyber-900 dark:text-slate-cyber-100">
                    {currentUser?.name}
                  </p>
                  <p className="text-xs text-slate-cyber-500 dark:text-slate-cyber-400">
                    {currentUser?.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigate("/settings");
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-slate-cyber-700 dark:text-slate-cyber-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/20 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/20 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="md:hidden px-4 pb-3">
        <SearchBar />
      </div>
    </header>
  );
};
