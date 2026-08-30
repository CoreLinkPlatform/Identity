import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";

const artifactId = process.env.KEYCLOAK_THEME_NAME ?? "corelink";

export default defineConfig({
  plugins: [
    react(),
    keycloakify({
      artifactId,
      accountThemeImplementation: "Single-Page",
      environmentVariables: [
        { name: "CORELINK_BRAND_NAME", default: "" },
        { name: "CORELINK_BRAND_TAGLINE", default: "" },
        { name: "CORELINK_BRAND_LOGO_URL", default: "" },
        { name: "CORELINK_BRAND_MARK_URL", default: "" },
        { name: "CORELINK_BRAND_BACKGROUND_URL", default: "" },
        { name: "CORELINK_BRAND_PRIMARY_COLOR", default: "" },
        { name: "CORELINK_BRAND_ACCENT_COLOR", default: "" }
      ]
    })
  ]
});
