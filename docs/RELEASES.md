# Releases

Tagged releases are the supported distribution channel for prebuilt CoreLink Identity artifacts.

## Published artifacts

For a tag such as `v1.0.0`, the Release workflow publishes:

| Artifact | Purpose |
|---|---|
| `keycloak-theme-for-kc-22-to-25.jar` | Keycloakify compatibility artifact for Keycloak 22–25. |
| `keycloak-theme-for-kc-all-other-versions.jar` | Keycloakify compatibility artifact for the remaining supported versions, including the current 26.x baseline. |
| `SHA256SUMS` | Verify the integrity of downloaded JAR files. |
| `ghcr.io/corelinkplatform/identity:v1.0.0` | Versioned Keycloak image containing the theme. |
| `ghcr.io/corelinkplatform/identity:latest` | Convenience image pointing at the latest tagged release. |

The GitHub source archives (`Source code (zip)` and `Source code (tar.gz)`) are generated automatically by GitHub.

## Install from a release JAR

For the current Keycloak 26.x baseline:

```bash
sha256sum -c SHA256SUMS
cp keycloak-theme-for-kc-all-other-versions.jar /opt/keycloak/providers/corelink-theme.jar
/opt/keycloak/bin/kc.sh build
```

Restart Keycloak and choose `corelink` under **Realm settings → Themes → Login theme**.

## Install from the released container

```bash
docker pull ghcr.io/corelinkplatform/identity:v1.0.0
```

Use an immutable version tag in production. Avoid relying on `latest` for reproducible deployments.

## Creating a release (maintainers)

1. Ensure CI is green on `main`.
2. Set `package.json:version` to the exact semantic version being released and commit the updated lockfile.
3. Create and push the matching semantic version tag:

```bash
git tag -a v1.0.0 -m "CoreLink Identity v1.0.0"
git push origin v1.0.0
```

4. The Release workflow verifies that `v1.0.0` matches `package.json:version` before publishing anything.
5. The workflow performs a clean `npm ci`, builds the Keycloak JARs, generates `SHA256SUMS`, creates the GitHub Release and publishes the GHCR images.
6. Verify the release page contains both JARs and the checksum file.
7. Pull the tagged image and run a smoke test against a test realm before promoting it to production.

## Versioning policy

Use Semantic Versioning for this repository:

- **PATCH**: styling/translation fixes without changing expected Keycloak integration.
- **MINOR**: new pages, branding features, supported flows or backwards-compatible integration capabilities.
- **MAJOR**: incompatible theme/configuration contract changes.

Keycloak compatibility is documented independently from the project version. A project version such as `v1.2.0` does not imply Keycloak `1.2`; always check the release notes and the compatibility JAR names.

## Release security

- Never place realm secrets, admin credentials, database passwords or private certificates in release assets.
- Verify `SHA256SUMS` before manual JAR installation.
- Pin versioned image tags in production.
- Rebuild and release when the pinned Keycloak base image receives relevant security updates.
