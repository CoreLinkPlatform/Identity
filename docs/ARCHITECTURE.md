# CoreLink Identity architecture

## Scope

Identity owns the visual authentication surface delivered by Keycloak. Business authorization remains in CoreLink Platform; realm/client provisioning belongs to Deployment.

## Boundaries

- **Identity:** Keycloakify theme, brand tokens, translations, theme JAR, Keycloak image contract.
- **Deployment:** database, realm bootstrap/import, clients, redirect URIs, secrets, reverse proxy, health checks.
- **Console:** OIDC client integration and application session UX.

## Theme contract

- Theme name: `corelink`
- Supported build target: Keycloak 26.2+
- Production baseline: Keycloak 26.7.2
- Default languages: English + Persian; Arabic remains compatible through Keycloak's built-in i18n.
- Direction is derived from active language and set on `<html dir>`.

## Security rules

1. Authentication JavaScript/CSS/assets ship inside the theme JAR.
2. Do not load executable resources from Console or tenant domains.
3. Never commit realm secrets or client secrets to this repository.
4. Pin Keycloak production images; upgrades require rebuilding and smoke-testing the theme.
5. CSP and proxy headers are configured by Deployment, not by theme code.

## White-label roadmap

Tenant branding should be data-driven and restricted to safe values (logo URL or bundled asset, color tokens, display name). Executable HTML/JS is never tenant-configurable.
