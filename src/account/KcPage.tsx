import { lazy } from "react";
import { KcAccountUiLoader } from "@keycloakify/keycloak-account-ui";
import type { KcContext } from "./KcContext";
import { oidcEarlyInit } from "oidc-spa/entrypoint";
import { browserRuntimeFreeze } from "oidc-spa/browser-runtime-freeze";

const KcAccountUi = lazy(() => import("./KcAccountUi"));

export default function KcPage(props: { kcContext: KcContext }) {
  const { kcContext } = props;

  const { shouldLoadApp } = oidcEarlyInit({
    BASE_URL: kcContext.baseUrl.path,
    sessionRestorationMethod: import.meta.env.DEV ? "full page redirect" : "auto",
    securityDefenses: {
      ...browserRuntimeFreeze({ excludes: ["fetch"] })
    }
  });

  if (!shouldLoadApp) {
    return null;
  }

  return <KcAccountUiLoader kcContext={kcContext} KcAccountUi={KcAccountUi} />;
}
