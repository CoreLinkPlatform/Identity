import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { KcPage } from "./kc.gen";
import "./styles/corelink.css";
import "./styles/login-controls.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {window.kcContext ? (
      <KcPage kcContext={window.kcContext} />
    ) : (
      <main className="corelink-dev-shell">
        <section className="corelink-dev-card">
          <img src="/brand/corelink-mark.svg" alt="CoreLink" width="56" height="56" />
          <h1>CoreLink Identity</h1>
          <p>Run this theme in a Keycloak context to preview authentication pages.</p>
          <code>npm run build:keycloak</code>
        </section>
      </main>
    )}
  </StrictMode>
);
