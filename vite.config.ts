import { defineConfig } from "vite";
import vinext from "vinext";

export default defineConfig({
  plugins: [vinext()],
  optimizeDeps: {
    // Vinext introduces some imports through shims/virtual entries (next/* etc.).
    // Pre-bundle them to avoid cold-start "optimized dependencies changed" reloads.
    include: [
      "next/link",
      "next/navigation",
      "react/jsx-dev-runtime",
      "lucide-react",
      "@tonconnect/ui-react",
      "react-i18next",
      "framer-motion",
      "i18next",
      "zustand",
      "axios",
      "axios-retry",
    ],
  },
});
