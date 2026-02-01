import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useTasks } from "../../context/TaskContext";
import { Task } from "../../types";
import { useNavigate } from "react-router-dom";

export const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Task[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { tasks } = useTasks();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        const filtered = tasks.filter(
          (task) =>
            task.title.toLowerCase().includes(query.toLowerCase()) ||
            task.description.toLowerCase().includes(query.toLowerCase()),
        );
        setResults(filtered);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, tasks]);

  const handleSelectTask = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks..."
          className="input-modern w-full pl-12 pr-10 py-2.5 bg-white/70 dark:bg-slate-cyber-700/50 border border-cyan-400/60 dark:border-cyan-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-white transition-all placeholder-gray-500"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-cyan-200/50 dark:hover:bg-cyan-600/20 rounded-lg transition-all"
          >
            <X className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-3 w-full glass-effect backdrop-blur-md dark:bg-slate-cyber-800/80 border border-cyan-300/40 dark:border-cyan-500/30 rounded-xl shadow-xl max-h-96 overflow-y-auto z-50">
          {results.map((task) => (
            <button
              key={task.id}
              onClick={() => handleSelectTask(task.id)}
              className="w-full px-4 py-3 text-left hover:bg-cyan-400/20 dark:hover:bg-cyan-600/20 border-b border-cyan-200/30 dark:border-cyan-600/30 last:border-b-0 transition-colors"
            >
              <p className="font-semibold text-gray-900 dark:text-cyan-100">
                {task.title}
              </p>
              <p className="text-xs text-cyan-700/70 dark:text-cyan-300/70 truncate">
                {task.description}
              </p>
            </button>
          ))}
        </div>
      )}

      {isOpen && query && results.length === 0 && (
        <div className="absolute top-full mt-3 w-full glass-effect backdrop-blur-md dark:bg-slate-cyber-800/80 border border-cyan-300/40 dark:border-cyan-500/30 rounded-xl shadow-xl p-4">
          <p className="text-sm text-cyan-700/70 dark:text-cyan-300/70 font-medium">
            No tasks found
          </p>
        </div>
      )}
    </div>
  );
};
