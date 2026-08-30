# CoreLink Identity

A reusable, production-oriented Keycloak login theme built with **Keycloakify**, **React**, **TypeScript**, and **Vite**. It ships with CoreLink branding by default, but the theme name, visible brand name, tagline, logo asset, colors, and translations can be replaced for another product.

[راهنمای فارسی](README.fa.md) · [Installation](docs/INSTALLATION.md) · [Branding](docs/BRANDING.md) · [Releases](docs/RELEASES.md)

## What it provides

- Modern Keycloak authentication UI without exposing the default Keycloak look.
- Keycloak 26.2+ theme JAR output.
- English and Persian support with RTL handling.
- Standard Keycloak login, registration, reset-password, verification, OTP/TOTP and required-action flows.
- Build-time brand configuration.
- Multi-stage Keycloak Docker image.
- CI build validation.
- Tagged releases containing a ready-to-install JAR, SHA-256 checksums and a GHCR image.

## Compatibility

The current image baseline is **Keycloak 26.7.2**. The generated theme target is `26.2-and-above`.

## Quick start

Requirements: Node.js 20+ and npm.

```bash
git clone https://github.com/CoreLinkPlatform/Identity.git
cd Identity
npm install
npm run dev
```

Build the installable Keycloak theme:

```bash
npm run build:keycloak
```

The generated JAR is written to:

```text
dist_keycloak/corelink-26.2-and-above.jar
```

Install it into an existing Keycloak instance by copying the JAR to `/opt/keycloak/providers/`, running `kc.sh build`, restarting Keycloak, and selecting `corelink` under **Realm settings → Themes → Login theme**. See [docs/INSTALLATION.md](docs/INSTALLATION.md) for complete Docker and bare-Keycloak instructions.

## Use it for your own product

No CoreLink backend is required. The repository can be forked and rebranded independently.

```bash
KEYCLOAK_THEME_NAME=my-product \
VITE_BRAND_NAME="My Product" \
VITE_BRAND_TAGLINE="Secure access" \
npm run build:keycloak
```

Replace `public/img/corelink-mark.svg` or set `VITE_BRAND_MARK` when building outside Docker. Colors and layout are documented in [docs/BRANDING.md](docs/BRANDING.md).

For Docker:

```bash
docker build \
  --build-arg KEYCLOAK_THEME_NAME=my-product \
  --build-arg VITE_BRAND_NAME="My Product" \
  --build-arg VITE_BRAND_TAGLINE="Secure access" \
  -t my-product-keycloak .
```

## Releases

On tags matching `v*`, GitHub Actions publishes:

- `<theme-name>-26.2-and-above.jar` — installable Keycloak theme.
- `SHA256SUMS` — integrity checksum file.
- `ghcr.io/corelinkplatform/identity:<tag>` — Keycloak image with the CoreLink theme pre-installed.
- `ghcr.io/corelinkplatform/identity:latest` — latest tagged image.

See [docs/RELEASES.md](docs/RELEASES.md) for installation from release files and release-maintainer instructions.

## Repository boundaries

This project intentionally does **not** contain production secrets, realm credentials, database passwords, tenant data, or CoreLink deployment configuration. Realm/client provisioning and Compose/Traefik integration belong in the deployment layer.

## License

MIT. You can fork, modify, redistribute, and use it commercially subject to the license terms.
