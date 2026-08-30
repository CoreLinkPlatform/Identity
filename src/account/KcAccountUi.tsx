import "@patternfly/patternfly/patternfly-addons.css";
import "@patternfly/react-core/dist/styles/base.css";
import "@fontsource-variable/vazirmatn";
import { useReducer, useEffect } from "react";
import { startColorSchemeManagement } from "./colorScheme";
import { KeycloakProvider } from "../shared/keycloak-ui-shared";
import { environment } from "./environment";
import { i18n } from "./i18n/i18n";
import { Root } from "./root/Root";
import { SessionExpirationWarningOverlay } from "../shared/SessionExpirationWarningOverlay";
import "./corelink-account.css";

const brandName = import.meta.env.VITE_BRAND_NAME || "CoreLink";
document.title = `${brandName} Account`;

const prI18nInitialized = i18n.init();
startColorSchemeManagement();

export default function KcAccountUi() {
  const [isI18nInitialized, setI18nInitialized] = useReducer(() => true, false);

  useEffect(() => {
    prI18nInitialized.then(() => setI18nInitialized());
  }, []);

  useEffect(() => {
    const language = document.documentElement.lang || navigator.language || "en";
    const rtl = /^(fa|ar|he|ur)(-|$)/i.test(language);
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    document.body.dir = rtl ? "rtl" : "ltr";
    document.body.dataset.corelinkSurface = "account";
  });

  if (!isI18nInitialized) {
    return null;
  }

  return (
    <KeycloakProvider environment={environment}>
      <Root />
      <SessionExpirationWarningOverlay warnUserSecondsBeforeAutoLogout={45} />
    </KeycloakProvider>
  );
}
