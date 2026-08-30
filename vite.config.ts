import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";

export default defineConfig({
  plugins: [
    react(),
    keycloakify({
      themeName: "corelink",
      accountThemeImplementation: "none",
      keycloakVersionTargets: {
        "26.2-and-above": "corelink-26.2-and-above.jar"
      }
    })
  ]
});
