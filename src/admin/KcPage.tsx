import { lazy } from "react";
import { KcAdminUiLoader } from "@keycloakify/keycloak-admin-ui";
import type { KcContext } from "./KcContext";
import { oidcEarlyInit } from "oidc-spa/entrypoint";
import { browserRuntimeFreeze } from "oidc-spa/browser-runtime-freeze";

/*
 * Keycloakify's upstream Admin UI enables DPoP in `auto` mode here.
 * Keycloak 26.7.x currently rejects the resulting security-admin-console
 * token exchange in our production setup with `invalid_dpop_proof`, and can
 * subsequently hit `lifespanInSeconds must be positive` in DPoP replay
 * validation. Keep the browser runtime hardening but use the standard OIDC
 * authorization-code flow until that compatibility issue is resolved.
 */
const { shouldLoadApp } = oidcEarlyInit({
  BASE_URL: location.pathname,
  sessionRestorationMethod: import.meta.env.DEV ? "full page redirect" : "auto",
  securityDefenses: {
    ...browserRuntimeFreeze({ excludes: ["fetch"] })
  }
});

const KcAdminUi = lazy(() => import("./KcAdminUi"));

export default function KcPage(props: { kcContext: KcContext }) {
  const { kcContext } = props;

  if (!shouldLoadApp) {
    return null;
  }

  return <KcAdminUiLoader kcContext={kcContext} KcAdminUi={KcAdminUi} />;
}
