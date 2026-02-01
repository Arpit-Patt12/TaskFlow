import { useToast } from "../../context/ToastContext";
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export const Toast = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm border animate-in slide-in-from-right-full duration-300 ${
            toast.type === "success"
              ? "bg-gradient-to-r from-cyan-500/20 to-cyan-400/20 border border-cyan-400/60 text-cyan-700 dark:text-cyan-300"
              : toast.type === "error"
                ? "bg-gradient-to-r from-rose-500/20 to-rose-400/20 border border-rose-400/60 text-rose-700 dark:text-rose-300"
                : toast.type === "warning"
                  ? "bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 border border-yellow-400/60 text-yellow-700 dark:text-yellow-300"
                  : "bg-gradient-to-r from-blue-500/20 to-blue-400/20 border border-blue-400/60 text-blue-700 dark:text-blue-300"
          }`}
        >
          {toast.type === "success" && (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          )}
          {toast.type === "error" && (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          {toast.type === "warning" && (
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          )}
          {toast.type === "info" && <Info className="w-5 h-5 flex-shrink-0" />}

          <span className="flex-1 font-medium text-sm">{toast.message}</span>

          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 hover:bg-black/10 rounded transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
