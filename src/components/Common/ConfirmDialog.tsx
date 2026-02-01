import { Modal } from "./Modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  size?: "sm" | "md" | "lg";
}

export const ConfirmDialog = ({
  isOpen,
  title = "Confirm",
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  size = "sm",
}: ConfirmDialogProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size={size}>
      <div className="p-6">
        <p className="text-cyan-700/80 dark:text-cyan-300/80 mb-8 font-medium text-sm leading-relaxed">
          {message}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="btn-modern-secondary px-6 py-2.5 bg-gradient-to-r from-cyan-500/20 to-cyan-400/20 dark:from-cyan-600/30 dark:to-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-400/60 dark:border-cyan-500/40 rounded-xl hover:from-cyan-500/40 hover:to-cyan-400/30 transition-all duration-200 font-semibold"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="btn-modern-primary px-6 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl shadow-lg hover:shadow-rose-500/50 transition-all duration-200 font-semibold"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
