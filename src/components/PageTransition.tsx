import React from "react";
import { motion } from "framer-motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full h-full text-white"
        >
            {children}
        </motion.div>
    );
}
