import { lazy, Suspense, useEffect } from "react";
import DefaultPage from "keycloakify/login/DefaultPage";
import Template from "keycloakify/login/Template";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";

const UserProfileFormFields = lazy(() => import("keycloakify/login/UserProfileFormFields"));

export default function KcPage({ kcContext }: { kcContext: KcContext }) {
  const { i18n } = useI18n({ kcContext });
  const lang = i18n.currentLanguage.languageTag;
  const isRtl = lang === "fa" || lang === "ar";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.body.dataset.corelinkPage = kcContext.pageId;
  }, [lang, isRtl, kcContext.pageId]);

  return (
    <Suspense>
      <div className="corelink-brand-bar" aria-hidden="true">
        <img src={`${kcContext.url.resourcesPath}/img/corelink-mark.svg`} alt="" />
        <span>CoreLink</span>
      </div>
      <DefaultPage
        kcContext={kcContext}
        i18n={i18n}
        classes={{}}
        Template={Template}
        doUseDefaultCss={false}
        UserProfileFormFields={UserProfileFormFields}
        doMakeUserConfirmPassword={true}
      />
      <footer className="corelink-auth-footer">
        <span>CoreLink Identity</span><span>•</span><span>Secure connected intelligence</span>
      </footer>
    </Suspense>
  );
}
