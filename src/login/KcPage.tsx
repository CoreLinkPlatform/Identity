import { lazy, Suspense, useEffect, useMemo, useState, type CSSProperties, type SyntheticEvent } from "react";
import DefaultPage from "keycloakify/login/DefaultPage";
import Template from "keycloakify/login/Template";
import type { KcContext } from "./KcContext";
import { InteractiveBackground } from "./InteractiveBackground";
import { useI18n } from "./i18n";
import "./InteractiveBackground.css";

const UserProfileFormFields = lazy(() => import("keycloakify/login/UserProfileFormFields"));

const defaultBrandName = import.meta.env.VITE_BRAND_NAME || "CoreLink";
const defaultBrandTagline = import.meta.env.VITE_BRAND_TAGLINE || "Secure connected intelligence";
const defaultBrandMarkPath = import.meta.env.VITE_BRAND_MARK || "img/corelink-mark.svg";
const defaultBackgroundPath = import.meta.env.VITE_IDENTITY_BACKGROUND || "img/identity-topography.webp";

const defaultBrandMarkUrl = `${import.meta.env.BASE_URL}${defaultBrandMarkPath}`;
const defaultBackgroundUrl = `${import.meta.env.BASE_URL}${defaultBackgroundPath}`;

type ColorMode = "light" | "dark";
type RealmWithAttributes = KcContext["realm"] & { attributes?: Record<string, string> };
type ContextWithProperties = KcContext & { properties?: Record<string, string> };

type Brand = {
  name: string;
  tagline: string;
  logoUrl?: string;
  markUrl: string;
  backgroundUrl: string;
  primaryColor?: string;
  accentColor?: string;
};

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

function resolveAssetUrl(value: string | undefined, fallback: string): string {
  const candidate = value?.trim();

  if (!candidate) {
    return fallback;
  }

  if (/^(https?:|data:|blob:)/i.test(candidate) || candidate.startsWith("/")) {
    return candidate;
  }

  return `${import.meta.env.BASE_URL}${candidate}`;
}

function firstNonBlank(...values: Array<string | undefined>): string | undefined {
  return values.map(value => value?.trim()).find((value): value is string => Boolean(value));
}

function readBrand(kcContext: KcContext): Brand {
  const attributes = (kcContext.realm as RealmWithAttributes).attributes ?? {};
  const properties = (kcContext as ContextWithProperties).properties ?? {};

  const logoValue = firstNonBlank(
    attributes["brand.logoUrl"],
    properties.CORELINK_BRAND_LOGO_URL
  );

  return {
    name:
      firstNonBlank(
        attributes["brand.name"],
        properties.CORELINK_BRAND_NAME,
        defaultBrandName
      ) ?? "CoreLink",
    tagline:
      firstNonBlank(
        attributes["brand.tagline"],
        properties.CORELINK_BRAND_TAGLINE,
        defaultBrandTagline
      ) ?? "Secure connected intelligence",
    logoUrl: logoValue ? resolveAssetUrl(logoValue, defaultBrandMarkUrl) : undefined,
    markUrl: resolveAssetUrl(
      firstNonBlank(attributes["brand.markUrl"], properties.CORELINK_BRAND_MARK_URL),
      defaultBrandMarkUrl
    ),
    backgroundUrl: resolveAssetUrl(
      firstNonBlank(
        attributes["brand.backgroundUrl"],
        properties.CORELINK_BRAND_BACKGROUND_URL
      ),
      defaultBackgroundUrl
    ),
    primaryColor: firstNonBlank(
      attributes["brand.primaryColor"],
      properties.CORELINK_BRAND_PRIMARY_COLOR
    ),
    accentColor: firstNonBlank(
      attributes["brand.accentColor"],
      properties.CORELINK_BRAND_ACCENT_COLOR
    )
  };
}

function BrandLockup({ brand, compact = false }: { brand: Brand; compact?: boolean }) {
  const fallbackToDefaultMark = (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;

    if (image.src !== defaultBrandMarkUrl) {
      image.src = defaultBrandMarkUrl;
      image.classList.remove("corelink-brand-logo");
      image.classList.add("corelink-brand-mark");
    }
  };

  if (brand.logoUrl) {
    return (
      <img
        className={`corelink-brand-logo${compact ? " is-compact" : ""}`}
        src={brand.logoUrl}
        alt={brand.name}
        onError={fallbackToDefaultMark}
      />
    );
  }

  return (
    <>
      <img
        className="corelink-brand-mark"
        src={brand.markUrl}
        alt=""
        onError={fallbackToDefaultMark}
      />
      <div className="corelink-brand-copy">
        <strong>{brand.name}</strong>
        <span>{brand.tagline}</span>
      </div>
    </>
  );
}

export default function KcPage({ kcContext }: { kcContext: KcContext }) {
  const { i18n } = useI18n({ kcContext });
  const lang = i18n.currentLanguage.languageTag;
  const isRtl = lang === "fa" || lang === "ar";
  const [colorMode, setColorMode] = useState<ColorMode>(getInitialColorMode);
  const brand = useMemo(() => readBrand(kcContext), [kcContext]);

  const copy = useMemo(
    () =>
      isRtl
        ? {
            eyebrow: brand.name.toUpperCase(),
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
            eyebrow: brand.name.toUpperCase(),
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
    [isRtl, brand.name]
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

  const brandStyle = {
    ...(brand.primaryColor ? { "--cl-primary": brand.primaryColor } : {}),
    ...(brand.accentColor ? { "--cl-accent": brand.accentColor } : {})
  } as CSSProperties;

  return (
    <Suspense>
      <div className="corelink-auth-shell" style={brandStyle}>
        <main className="corelink-form-panel">
          <div className="corelink-form-controls">
            {locales.length > 1 && (
              <nav className="corelink-language-switcher" aria-label="Language">
                {locales.map(locale => (
                  <a
                    key={locale.languageTag}
                    href={locale.url}
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
              <BrandLockup brand={brand} compact />
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
              <span>{brand.name} Identity</span>
              <span>•</span>
              <span>{brand.tagline}</span>
            </footer>
          </div>
        </main>

        <aside className="corelink-hero-panel" aria-hidden="true">
          <InteractiveBackground imageUrl={brand.backgroundUrl} />
          <div className="corelink-hero-overlay" />
          <div className="corelink-hero-brand">
            <BrandLockup brand={brand} />
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
