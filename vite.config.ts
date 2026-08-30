import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";

const artifactId = process.env.KEYCLOAK_THEME_NAME ?? "corelink";

export default defineConfig({
  plugins: [
    react(),
    keycloakify({
      artifactId,
      accountThemeImplementation: "none"
    })
  ]
});
