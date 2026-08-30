# Deployment contract

This repository intentionally does not contain CoreLink production credentials or realm exports.

## Image

Build:

```bash
docker build -t ghcr.io/corelinkplatform/identity:26.7.2-corelink.1 .
```

The resulting image contains the `corelink` login theme and starts Keycloak with `start --optimized`.

## Required runtime configuration

Deployment must provide at minimum:

- `KC_DB`
- `KC_DB_URL`
- `KC_DB_USERNAME`
- `KC_DB_PASSWORD`
- `KC_HOSTNAME`
- bootstrap admin credentials only for first initialization

Behind a reverse proxy, Deployment must configure Keycloak's proxy/hostname settings for the actual topology.

## Realm configuration

Set **Realm settings → Themes → Login theme** to `corelink`.

Before production integration, test at minimum:

- password login
- registration (if enabled)
- forgot/reset password
- email verification
- OTP/TOTP
- required actions / update password
- invalid credentials and system error pages
- Persian RTL and English LTR
- mobile viewport
