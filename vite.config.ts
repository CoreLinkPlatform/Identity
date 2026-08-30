import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";

const themeName = process.env.KEYCLOAK_THEME_NAME ?? "corelink";

export default defineConfig({
  plugins: [
    react(),
    keycloakify({
      themeName,
      accountThemeImplementation: "none",
      keycloakVersionTargets: {
        "26.2-and-above": `${themeName}-26.2-and-above.jar`
      }
    })
  ]
});
