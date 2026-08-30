# Branding and Reuse

CoreLink Identity is intentionally reusable. CoreLink is the default brand, not a runtime dependency.

## Theme name vs visible brand

Keycloakify derives the actual Keycloak theme identifier from `package.json:name`. The default package name is `corelink`, so the theme appears as `corelink` in Realm settings.

For a source fork:

```bash
npm pkg set name=acme
```

For the provided Dockerfile, use:

```bash
--build-arg KEYCLOAK_THEME_NAME=acme
```

The Dockerfile updates the package name inside the build stage automatically.

## Visible branding options

| Variable | Default | Purpose |
|---|---|---|
| `VITE_BRAND_NAME` | `CoreLink` | Visible product/brand name. |
| `VITE_BRAND_TAGLINE` | `Secure connected intelligence` | Footer tagline. |
| `VITE_BRAND_MARK` | `img/corelink-mark.svg` | Logo path relative to Keycloak theme resources. |

Source-build example:

```bash
npm pkg set name=acme
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

Authentication styles are currently centralized in:

```text
src/styles/corelink.css
```

A public fork may rename that file, but keep design tokens and structural rules centralized rather than scattering product-specific values through individual Keycloak pages.

When modifying layout, preserve:

- keyboard focus visibility;
- sufficient color contrast;
- responsive behaviour;
- logical CSS properties for RTL support;
- Keycloak form semantics and error messages.

## Persian and RTL

Standard translations, including Persian, are provided through Keycloakify's login i18n layer. The CoreLink-specific i18n wrapper is at:

```text
src/login/i18n.ts
```

The page applies `dir=rtl` automatically for Persian (`fa`) and Arabic (`ar`). Prefer logical properties such as `margin-inline-start`, `padding-inline-end` and `inset-inline-start` instead of hard-coded left/right rules.

## White-label / multi-tenant branding

The current implementation uses build-time branding. This is deliberately simple and safe for the first public version.

For installations that need different branding per realm without rebuilding, add a separately reviewed realm-brand configuration mechanism or Keycloak SPI. Do not allow arbitrary stored HTML or JavaScript. Validate URLs/colors strictly and provide safe bundled fallbacks.

## Public fork checklist

1. Change `package.json:name` to the desired Keycloak theme identifier.
2. Set `VITE_BRAND_NAME` and `VITE_BRAND_TAGLINE`.
3. Replace or configure the logo asset.
4. Adjust colors/styles.
5. Update repository metadata and documentation.
6. Build a JAR and select the new package/theme name in Keycloak.

`private: true` in `package.json` only prevents accidental npm publication. It does **not** make the GitHub repository private and does not restrict use under the MIT license.
