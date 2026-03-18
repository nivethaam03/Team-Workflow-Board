import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "../../lib/utils";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem = ({ toast, onRemove }: ToastItemProps) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
    error: <AlertCircle className="h-5 w-5 text-destructive" />,
    info: <Info className="h-5 w-5 text-sky-500" />,
    warning: <AlertCircle className="h-5 w-5 text-amber-500" />,
  };

  const bgStyles = {
    success: "bg-emerald-50 border-emerald-100",
    error: "bg-destructive/10 border-destructive/20",
    info: "bg-sky-50 border-sky-100",
    warning: "bg-amber-50 border-amber-100",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      className={cn(
        "pointer-events-auto flex items-center justify-between gap-4 rounded-lg border p-4 shadow-lg min-w-[300px] max-w-md bg-white",
        bgStyles[toast.type]
      )}
    >
      <div className="flex items-center gap-3">
        {icons[toast.type]}
        <p className="text-sm font-medium text-foreground">{toast.message}</p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Close toast"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
};

export interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

export const ToastContainer = ({ toasts, removeToast }: ToastContainerProps) => {
  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-[100] flex flex-col items-end gap-2 p-6"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};
