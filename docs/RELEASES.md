# Releases

Tagged releases are the supported distribution channel for prebuilt CoreLink Identity artifacts.

## Published artifacts

For a tag such as `v0.1.0`, the Release workflow publishes:

| Artifact | Purpose |
|---|---|
| `corelink-26.2-and-above.jar` | Install directly into Keycloak 26.2+ under `/opt/keycloak/providers/`. |
| `SHA256SUMS` | Verify the integrity of downloaded JAR files. |
| `ghcr.io/corelinkplatform/identity:v0.1.0` | Versioned Keycloak image containing the theme. |
| `ghcr.io/corelinkplatform/identity:latest` | Convenience image pointing at the latest tagged release. |

The GitHub source archives (`Source code (zip)` and `Source code (tar.gz)`) are generated automatically by GitHub.

## Install from a release JAR

```bash
sha256sum -c SHA256SUMS
cp corelink-26.2-and-above.jar /opt/keycloak/providers/corelink-theme.jar
/opt/keycloak/bin/kc.sh build
```

Restart Keycloak and choose `corelink` under **Realm settings → Themes → Login theme**.

## Install from the released container

```bash
docker pull ghcr.io/corelinkplatform/identity:v0.1.0
```

Use an immutable version tag in production. Avoid relying on `latest` for reproducible deployments.

## Creating a release (maintainers)

1. Ensure CI is green on `main`.
2. Update the package version and release notes/changelog when applicable.
3. Create and push a semantic version tag:

```bash
git tag -a v0.1.0 -m "CoreLink Identity v0.1.0"
git push origin v0.1.0
```

4. The `Release` GitHub Actions workflow builds the JAR, generates `SHA256SUMS`, creates the GitHub Release and publishes the GHCR images.
5. Verify the release page contains the expected JAR and checksum file.
6. Pull the tagged image and run a smoke test against a test realm before promoting it to production.

## Versioning policy

Use Semantic Versioning for this repository:

- **PATCH**: styling/translation fixes without changing expected Keycloak integration.
- **MINOR**: new pages, branding features, supported flows or backwards-compatible integration capabilities.
- **MAJOR**: incompatible theme/configuration contract changes.

Keycloak compatibility is documented independently from the project version. A project version such as `v1.2.0` does not imply Keycloak `1.2`; always check the JAR filename and release notes.

## Release security

- Never place realm secrets, admin credentials, database passwords or private certificates in release assets.
- Verify `SHA256SUMS` before manual JAR installation.
- Pin versioned image tags in production.
- Rebuild and release when the pinned Keycloak base image receives relevant security updates.
