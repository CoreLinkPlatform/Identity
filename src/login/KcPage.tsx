import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import DefaultPage from "keycloakify/login/DefaultPage";
import Template from "keycloakify/login/Template";
import type { KcContext } from "./KcContext";
import { InteractiveBackground } from "./InteractiveBackground";
import { useI18n } from "./i18n";
import "./InteractiveBackground.css";

const UserProfileFormFields = lazy(() => import("keycloakify/login/UserProfileFormFields"));

const brandName = import.meta.env.VITE_BRAND_NAME || "CoreLink";
const brandTagline = import.meta.env.VITE_BRAND_TAGLINE || "Secure connected intelligence";
const brandMark = import.meta.env.VITE_BRAND_MARK || "img/corelink-mark.svg";
const backgroundImage = import.meta.env.VITE_IDENTITY_BACKGROUND || "img/identity-topography.webp";

type ColorMode = "light" | "dark";

function getInitialColorMode(): ColorMode {
  if (typeof window === "undefined") {
    return "dark";
  }

  const saved = window.localStorage.getItem("corelink-identity-theme");
  if (saved === "light" || saved === "dark") {
    return saved;
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export default function KcPage({ kcContext }: { kcContext: KcContext }) {
  const { i18n } = useI18n({ kcContext });
  const lang = i18n.currentLanguage.languageTag;
  const isRtl = lang === "fa" || lang === "ar";
  const [colorMode, setColorMode] = useState<ColorMode>(getInitialColorMode);

  const copy = useMemo(
    () =>
      isRtl
        ? {
            eyebrow: "CORELINK",
            headline: "همه چیزهایی که برایتان مهم است را یک‌جا ببینید.",
            description:
              "خودروها، حیوانات، تجهیزات و مکان‌ها را روی نقشه دنبال کنید، وضعیتشان را ببینید و از اتفاق‌های مهم باخبر شوید.",
            chip: "موقعیت، وضعیت و هشدارها در یک نگاه",
            featureOne: "ورود امن",
            featureTwo: "نقشه زنده",
            featureThree: "هشدارهای هوشمند",
            lightMode: "حالت روشن",
            darkMode: "حالت تیره"
          }
        : {
            eyebrow: "CORELINK",
            headline: "Everything that matters, visible in one place.",
            description:
              "Track vehicles, pets, equipment and places on a live map, understand their status and stay informed about important events.",
            chip: "Location, status and alerts at a glance",
            featureOne: "Secure sign-in",
            featureTwo: "Live map",
            featureThree: "Smart alerts",
            lightMode: "Light mode",
            darkMode: "Dark mode"
          },
    [isRtl]
  );

  const locales = kcContext.locale?.supported ?? [];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.dataset.theme = colorMode;
    document.body.dataset.identityPage = kcContext.pageId;
    window.localStorage.setItem("corelink-identity-theme", colorMode);
  }, [lang, isRtl, colorMode, kcContext.pageId]);

  const toggleColorMode = () => {
    setColorMode(current => (current === "dark" ? "light" : "dark"));
  };

  return (
    <Suspense>
      <div className="corelink-auth-shell">
        <main className="corelink-form-panel">
          <div className="corelink-form-controls">
            {locales.length > 1 && (
              <nav className="corelink-language-switcher" aria-label="Language">
                {locales.map(locale => (
                  <a
                    key={locale.languageTag}
                    href={locale.href}
                    className={locale.languageTag === lang ? "is-active" : undefined}
                    lang={locale.languageTag}
                    hrefLang={locale.languageTag}
                  >
                    {locale.languageTag.toUpperCase()}
                  </a>
                ))}
              </nav>
            )}

            <button
              type="button"
              className="corelink-theme-toggle"
              onClick={toggleColorMode}
              aria-label={colorMode === "dark" ? copy.lightMode : copy.darkMode}
              title={colorMode === "dark" ? copy.lightMode : copy.darkMode}
            >
              {colorMode === "dark" ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.64 5.64l1.42 1.42m9.88 9.88 1.42 1.42M18.36 5.64l-1.42 1.42M7.06 16.94l-1.42 1.42" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.2 15.1A8 8 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z" />
                </svg>
              )}
            </button>
          </div>

          <div className="corelink-form-inner">
            <div className="corelink-mobile-brand">
              <img src={`${import.meta.env.BASE_URL}${brandMark}`} alt="" />
              <div>
                <strong>{brandName}</strong>
                <span>{brandTagline}</span>
              </div>
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
              <span>{brandName} Identity</span>
              <span>•</span>
              <span>{brandTagline}</span>
            </footer>
          </div>
        </main>

        <aside className="corelink-hero-panel" aria-hidden="true">
          <InteractiveBackground imageUrl={`${import.meta.env.BASE_URL}${backgroundImage}`} />
          <div className="corelink-hero-overlay" />
          <div className="corelink-hero-brand">
            <img src={`${import.meta.env.BASE_URL}${brandMark}`} alt="" />
            <div>
              <strong>{brandName}</strong>
              <span>{brandTagline}</span>
            </div>
          </div>

          <div className="corelink-hero-copy">
            <span className="corelink-hero-chip">{copy.chip}</span>
            <span className="corelink-hero-eyebrow">{copy.eyebrow}</span>
            <h1>{copy.headline}</h1>
            <p>{copy.description}</p>
          </div>

          <div className="corelink-feature-row">
            <div><span>✓</span>{copy.featureOne}</div>
            <div><span>⌖</span>{copy.featureTwo}</div>
            <div><span>◉</span>{copy.featureThree}</div>
          </div>
        </aside>
      </div>
    </Suspense>
  );
}
