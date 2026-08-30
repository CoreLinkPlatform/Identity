import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

// Keycloakify already provides the standard Keycloak login translations,
// including Persian. Keep product branding outside translation keys so forks
// can rebrand without rewriting authentication copy.
const { useI18n, ofTypeI18n } = i18nBuilder
  .withThemeName<ThemeName>()
  .build();

export type I18n = typeof ofTypeI18n;
export { useI18n };
