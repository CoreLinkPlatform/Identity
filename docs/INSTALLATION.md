# Installation Guide

This guide covers three supported ways to use CoreLink Identity: install the released JAR into an existing Keycloak, run the prebuilt container image, or build a custom-branded image.

## 1. Install a released JAR into existing Keycloak

### Requirements

- Keycloak 26.2 or newer.
- Access to the Keycloak `providers` directory.
- Permission to restart/rebuild the Keycloak installation.

### Steps

1. Download the release JAR named `corelink-26.2-and-above.jar` and `SHA256SUMS` from the GitHub Release.
2. Verify the download:

```bash
sha256sum -c SHA256SUMS
```

3. Copy the JAR into Keycloak:

```bash
cp corelink-26.2-and-above.jar /opt/keycloak/providers/corelink-theme.jar
```

4. Rebuild the optimized Keycloak installation:

```bash
/opt/keycloak/bin/kc.sh build
```

5. Restart Keycloak.
6. Open the Admin Console and select:

```text
Realm settings → Themes → Login theme → corelink
```

7. Save and open a login flow for that realm to verify the theme.

### Docker-based existing Keycloak

If Keycloak already runs as a container, build a tiny derived image instead of mounting the JAR at runtime:

```dockerfile
FROM quay.io/keycloak/keycloak:26.7.2 AS builder
COPY corelink-26.2-and-above.jar /opt/keycloak/providers/corelink-theme.jar
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:26.7.2
COPY --from=builder /opt/keycloak/ /opt/keycloak/
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start", "--optimized"]
```

## 2. Run the released GHCR image

The tagged image already contains the CoreLink theme and an optimized Keycloak build.

```bash
docker pull ghcr.io/corelinkplatform/identity:v0.1.0
```

Example local development run:

```bash
docker run --rm -p 8080:8080 \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=change-me \
  ghcr.io/corelinkplatform/identity:v0.1.0 \
  start-dev
```

For production, do not use `start-dev`. Provide a supported database, hostname, TLS/proxy configuration and secrets through your deployment system.

## 3. Build from source

### Requirements

- Node.js 20+
- npm
- Docker only if you want the full Keycloak image

```bash
git clone https://github.com/CoreLinkPlatform/Identity.git
cd Identity
npm install
npm run build:keycloak
```

Output:

```text
dist_keycloak/corelink-26.2-and-above.jar
```

## 4. Build a custom-branded theme

```bash
KEYCLOAK_THEME_NAME=acme \
VITE_BRAND_NAME="Acme" \
VITE_BRAND_TAGLINE="Secure workspace" \
npm run build:keycloak
```

Expected output:

```text
dist_keycloak/acme-26.2-and-above.jar
```

Then select `acme` as the Login theme in the Realm settings.

## 5. Build a custom Keycloak image

```bash
docker build \
  --build-arg KEYCLOAK_VERSION=26.7.2 \
  --build-arg KEYCLOAK_THEME_NAME=acme \
  --build-arg VITE_BRAND_NAME="Acme" \
  --build-arg VITE_BRAND_TAGLINE="Secure workspace" \
  -t acme-keycloak:26.7.2 .
```

## 6. Realm configuration

This repository does not create realms or clients. After installing the theme, configure your realm normally and select the theme under Realm settings. Production realm exports, client secrets and database credentials should live in your deployment/configuration repository, not in this theme repository.

## 7. Upgrade procedure

1. Read the release notes.
2. Back up realm configuration and the Keycloak database according to your normal operations procedure.
3. Replace the old theme JAR or container image with the new tagged version.
4. Run `kc.sh build` when installing a JAR manually.
5. Restart Keycloak.
6. Verify login, password reset, email verification, OTP/TOTP and any custom required actions.

Do not deploy multiple versions of the same theme JAR into `providers/` at the same time.

## 8. Troubleshooting

### Theme is not visible

Confirm the JAR exists under `/opt/keycloak/providers/`, rerun `kc.sh build`, restart Keycloak and ensure the theme name matches the build-time `KEYCLOAK_THEME_NAME` value.

### Old styles are still shown

Restart Keycloak and clear browser cache. During theme development, avoid relying on production cache behaviour.

### Persian is not shown

Enable internationalization for the realm and include Persian (`fa`) in supported locales. The UI automatically sets `dir=rtl` for Persian and Arabic.

### Container starts but production configuration fails

The image only packages Keycloak and the theme. Database, hostname, proxy/TLS, realm provisioning and secrets are deployment concerns and must be supplied separately.
