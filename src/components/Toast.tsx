import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/useStore";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export default function ToastContainer() {
  const toasts = useStore((state) => state.toasts);

  return (
    <div
      className="fixed top-12 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            role="status"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`flex items-center gap-3 px-4 py-3 rounded border font-pixel text-[10px] bg-black pointer-events-auto shadow-lg ${
              toast.type === "success"
                ? "border-[#00FF41] text-[#00FF41] glow-box"
                : toast.type === "error"
                  ? "border-red-500 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                  : "border-[#FFD700] text-[#FFD700] glow-box-gold"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 className="w-4 h-4" />}
            {toast.type === "error" && <AlertCircle className="w-4 h-4" />}
            {toast.type === "info" && <Info className="w-4 h-4" />}
            <span>{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
