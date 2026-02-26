import { defineConfig } from "vite";
import vinext from "vinext";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [vinext(), tailwindcss()],
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-server-dom-webpack/client.edge",
    ]
  }
});
