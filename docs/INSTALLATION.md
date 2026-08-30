# Installation Guide

This guide covers three supported ways to use CoreLink Identity: install a released JAR into an existing Keycloak, run the prebuilt container image, or build a custom-branded image.

## 1. Install a released JAR into existing Keycloak

### Requirements

- A supported Keycloak version.
- Access to the Keycloak `providers` directory.
- Permission to restart/rebuild the Keycloak installation.

### Compatibility artifacts

Keycloakify currently produces:

- `keycloak-theme-for-kc-22-to-25.jar` for Keycloak 22–25.
- `keycloak-theme-for-kc-all-other-versions.jar` for the remaining supported versions, including the current Keycloak 26.x baseline.

### Steps for the current Keycloak 26.x baseline

1. Download `keycloak-theme-for-kc-all-other-versions.jar` and `SHA256SUMS` from the GitHub Release.
2. Verify the download:

```bash
sha256sum -c SHA256SUMS
```

3. Copy the JAR into Keycloak:

```bash
cp keycloak-theme-for-kc-all-other-versions.jar /opt/keycloak/providers/corelink-theme.jar
```

4. Rebuild Keycloak:

```bash
/opt/keycloak/bin/kc.sh build
```

5. Restart Keycloak.
6. Open Admin Console and select:

```text
Realm settings → Themes → Login theme → corelink
```

7. Save and exercise a real login flow for that realm.

### Existing Docker-based Keycloak

Prefer a derived image over runtime mounting:

```dockerfile
FROM quay.io/keycloak/keycloak:26.7.2 AS builder
COPY keycloak-theme-for-kc-all-other-versions.jar /opt/keycloak/providers/corelink-theme.jar
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:26.7.2
COPY --from=builder /opt/keycloak/ /opt/keycloak/
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start", "--optimized"]
```

## 2. Run the released GHCR image

```bash
docker pull ghcr.io/corelinkplatform/identity:v1.0.0
```

Local smoke test:

```bash
docker run --rm -p 8080:8080 \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=change-me \
  ghcr.io/corelinkplatform/identity:v1.0.0 \
  start-dev
```

For production, do not use `start-dev`. Supply a production database, hostname, TLS/proxy configuration and secrets through your deployment system.

## 3. Build the CoreLink theme from source

Requirements: Node.js 20+ and npm.

```bash
git clone https://github.com/CoreLinkPlatform/Identity.git
cd Identity
npm ci
npm run build:keycloak
```

Output JARs are written to `dist_keycloak/`.

## 4. Build a custom-branded fork

Keycloakify derives the actual theme identifier from `package.json:name`. Change it in your fork before building:

```bash
npm pkg set name=acme
VITE_BRAND_NAME="Acme" \
VITE_BRAND_TAGLINE="Secure workspace" \
npm run build:keycloak
```

The generated theme will be selectable as `acme`. Replace `public/img/corelink-mark.svg` or set `VITE_BRAND_MARK` to another resource path.

## 5. Build a custom Keycloak image

The Dockerfile performs the package-name change automatically from `KEYCLOAK_THEME_NAME`:

```bash
docker build \
  --build-arg KEYCLOAK_VERSION=26.7.2 \
  --build-arg KEYCLOAK_THEME_NAME=acme \
  --build-arg VITE_BRAND_NAME="Acme" \
  --build-arg VITE_BRAND_TAGLINE="Secure workspace" \
  -t acme-keycloak:26.7.2 .
```

## 6. Realm configuration

This repository does not create realms or clients. Configure the realm normally and select the installed login theme under Realm settings. Production realm exports, client secrets and database credentials belong in a separate deployment/configuration repository.

## 7. Upgrade procedure

1. Read release notes.
2. Back up realm configuration and the Keycloak database according to your operations policy.
3. Replace the old theme JAR or container image with the new tagged version.
4. Run `kc.sh build` for manual JAR installation.
5. Restart Keycloak.
6. Verify login, registration, password reset, email verification, OTP/TOTP and custom required actions.

Do not deploy multiple versions of the same theme JAR into `providers/` simultaneously.

## 8. Troubleshooting

### Theme is not visible

Confirm the JAR is under `/opt/keycloak/providers/`, rerun `kc.sh build`, restart Keycloak and make sure the selected theme name matches the `package.json:name` used during the build (or `KEYCLOAK_THEME_NAME` for the provided Dockerfile).

### Old styles are still shown

Restart Keycloak and clear browser cache. Production theme caching can hide recent development changes.

### Persian is not shown

Enable realm internationalization and add Persian (`fa`) to Supported locales. The UI automatically applies RTL direction for Persian and Arabic.

### Container starts but production configuration fails

The image packages Keycloak and the theme only. Database, hostname, proxy/TLS, realm provisioning and secrets must be supplied by the deployment layer.
