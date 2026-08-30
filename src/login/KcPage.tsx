import { lazy, Suspense, useEffect } from "react";
import DefaultPage from "keycloakify/login/DefaultPage";
import Template from "keycloakify/login/Template";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";

const UserProfileFormFields = lazy(() => import("keycloakify/login/UserProfileFormFields"));

const brandName = import.meta.env.VITE_BRAND_NAME || "CoreLink";
const brandTagline = import.meta.env.VITE_BRAND_TAGLINE || "Secure connected intelligence";
const brandMark = import.meta.env.VITE_BRAND_MARK || "img/corelink-mark.svg";

export default function KcPage({ kcContext }: { kcContext: KcContext }) {
  const { i18n } = useI18n({ kcContext });
  const lang = i18n.currentLanguage.languageTag;
  const isRtl = lang === "fa" || lang === "ar";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.body.dataset.identityPage = kcContext.pageId;
  }, [lang, isRtl, kcContext.pageId]);

  return (
    <Suspense>
      <div className="corelink-brand-bar">
        <img src={`${kcContext.url.resourcesPath}/${brandMark}`} alt={`${brandName} logo`} />
        <span>{brandName}</span>
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
        <span>{brandName} Identity</span><span>•</span><span>{brandTagline}</span>
      </footer>
    </Suspense>
  );
}
