# Branding and Reuse

CoreLink Identity is intentionally reusable. CoreLink is the default brand, not a runtime dependency.

## Build-time options

| Variable | Default | Purpose |
|---|---|---|
| `KEYCLOAK_THEME_NAME` | `corelink` | Theme identifier shown in Keycloak Realm settings and used in the JAR filename. |
| `VITE_BRAND_NAME` | `CoreLink` | Visible product/brand name. |
| `VITE_BRAND_TAGLINE` | `Secure connected intelligence` | Footer tagline. |
| `VITE_BRAND_MARK` | `img/corelink-mark.svg` | Logo path relative to Keycloak theme resources. |

Example:

```bash
KEYCLOAK_THEME_NAME=acme \
VITE_BRAND_NAME="Acme Cloud" \
VITE_BRAND_TAGLINE="Identity for your workspace" \
VITE_BRAND_MARK="img/acme.svg" \
npm run build:keycloak
```

## Logo

The default asset lives at:

```text
public/img/corelink-mark.svg
```

For a fork, replace it with your own SVG or add another file under `public/img/` and set `VITE_BRAND_MARK`.

Prefer SVG for crisp rendering. Do not embed secrets, tenant identifiers, tracking code, remote scripts or private URLs in theme assets.

## Colors and layout

The authentication surface styles live under `src/login/`. Keep branding tokens centralized when extending the project rather than scattering product-specific colors through individual pages.

When modifying layout, preserve:

- keyboard focus visibility;
- sufficient color contrast;
- responsive behaviour;
- logical CSS properties for RTL support;
- Keycloak form semantics and error messages.

## Persian and RTL

Persian messages are stored in:

```text
src/login/messages/fa.ts
```

The page sets `dir=rtl` automatically for Persian (`fa`) and Arabic (`ar`). Prefer logical properties such as `margin-inline-start`, `padding-inline-end`, `inset-inline-start` and equivalent utility patterns instead of hard-coded left/right rules.

## White-label / multi-tenant branding

The current implementation uses build-time branding. This is deliberately simple and safe for the first public version.

For multi-tenant installations that need different branding per realm without rebuilding, add a separate, reviewed realm-brand configuration mechanism or Keycloak SPI. Do not expose arbitrary HTML/JavaScript stored in realm attributes. Validate URLs/colors strictly and maintain safe fallbacks.

## What to rename in a public fork

At minimum:

1. Set `KEYCLOAK_THEME_NAME`.
2. Set `VITE_BRAND_NAME` and `VITE_BRAND_TAGLINE`.
3. Replace the logo asset.
4. Adjust color tokens/styles.
5. Update README/repository metadata.
6. Build a new JAR and select the new theme name in Keycloak.

The source package name `@corelinkplatform/identity` can also be changed in `package.json` if the fork is maintained as a separate project. `private: true` only prevents accidental npm publication; it does not restrict GitHub/public use.
