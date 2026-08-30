import "@patternfly/patternfly/patternfly-addons.css";
import "@patternfly/react-core/dist/styles/base.css";
import "@fontsource-variable/vazirmatn";
import { useEffect, useReducer } from "react";
import { startColorSchemeManagement } from "./colorScheme";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { i18n } from "./i18n/i18n";
import { Root } from "./Root";
import { routes } from "./routes";
import "./index.css";
import "./corelink-admin.css";

const brandName = import.meta.env.VITE_BRAND_NAME || "CoreLink";
document.title = `${brandName} Administration`;

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    children: routes
  }
]);

const prI18nInitialized = i18n.init();
startColorSchemeManagement();

export default function KcAdminUi() {
  const [isI18nInitialized, setI18nInitialized] = useReducer(() => true, false);

  useEffect(() => {
    prI18nInitialized.then(() => setI18nInitialized());
  }, []);

  useEffect(() => {
    const language = document.documentElement.lang || navigator.language || "en";
    const rtl = /^(fa|ar|he|ur)(-|$)/i.test(language);
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    document.body.dir = rtl ? "rtl" : "ltr";
    document.body.dataset.corelinkSurface = "admin";
  });

  if (!isI18nInitialized) {
    return null;
  }

  return <RouterProvider router={router} />;
}
