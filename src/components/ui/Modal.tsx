import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Modal = ({ isOpen, onClose, title, children, className }: ModalProps) => {
  // Focus management: when modal opens, focus the first interactive element or the close button
  // We can use a simple effect here
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Escape key to close
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={cn(
              "relative z-50 w-full max-w-lg overflow-hidden rounded-xl bg-background shadow-2xl border border-border",
              className
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="flex items-center justify-between border-b px-6 py-4 bg-muted/30">
              <h2 id="modal-title" className="text-xl font-semibold">
                {title}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-full"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[80vh]">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export { Modal };
