# CoreLink Identity Theme Suite

CoreLink Identity is built as a complete Keycloakify theme suite rather than a login-only skin.

## Theme types

| Surface | Implementation | Scope |
| --- | --- | --- |
| Login | Keycloakify React | Login, registration, password recovery/update, email verification, OTP/TOTP, WebAuthn/passkeys, required actions, terms, organizations, OAuth/device flows, logout and errors |
| Account | Keycloakify Single-Page Account UI | Profile, security, credentials, sessions/devices, applications and linked accounts |
| Admin | Keycloakify Admin UI | Keycloak administration console |
| Email | Keycloakify native email extension | Keycloak transactional email templates |

Registration is intentionally part of the Login theme because that is how Keycloak and Keycloakify model authentication and required-action pages.

## Branding precedence

Login branding is resolved in this order:

1. Realm attributes (`brand.*`)
2. Keycloak runtime environment variables (`CORELINK_BRAND_*`)
3. Build-time Vite values (`VITE_*`)
4. CoreLink defaults

### Realm attributes

```text
brand.name
brand.tagline
brand.logoUrl
brand.markUrl
brand.backgroundUrl
brand.primaryColor
brand.accentColor
```

### Runtime Keycloak environment variables

```text
CORELINK_BRAND_NAME
CORELINK_BRAND_TAGLINE
CORELINK_BRAND_LOGO_URL
CORELINK_BRAND_MARK_URL
CORELINK_BRAND_BACKGROUND_URL
CORELINK_BRAND_PRIMARY_COLOR
CORELINK_BRAND_ACCENT_COLOR
```

The runtime variables are exposed by Keycloakify through `kcContext.properties`, so one built JAR/image can be configured without rebuilding it.

## Login flows covered by the shared CoreLink shell

The shared shell and design system wrap Keycloakify's default page implementations. This keeps upstream flow compatibility while giving every page the CoreLink layout, RTL support, typography, light/dark mode and branding.

High-value flows include:

- Sign in / username / password
- Registration and declarative user profile
- Reset password and update password
- Update profile and update email
- Verify email
- OTP and TOTP enrollment
- Recovery authentication codes
- WebAuthn and passkeys
- Identity-provider linking/review
- OAuth consent and device authorization
- Authenticator selection
- Organization selection
- Terms
- Logout, expired session, info and error pages

Only pages that need product-specific UX should be ejected and owned. Keeping the rest on Keycloakify `DefaultPage` reduces drift from upstream Keycloak.

## Account and Admin

The project uses the modern Single-Page Account UI and Admin UI extension packages published by Keycloakify. Their source is synchronized during `npm install` via:

```bash
keycloakify sync-extensions
```

For deeper customization, use Keycloakify's `own` command on selected account/admin files instead of forking the complete upstream UI.

## Email

The native email extension is synchronized during install. Email templates are a separate rendering path from browser themes and do not receive the same runtime environment-variable mechanism. Email branding should therefore use committed theme assets/messages and Keycloak-supported template variables.

## Local development

Build and type-check:

```bash
npm install
npm run check
npm run build:keycloak
```

Run the generated theme in a development Keycloak:

```bash
npm run start:keycloak
```

Add a Storybook scenario when a page needs isolated visual regression coverage:

```bash
npm run add-story
```

## Realm activation

Set the realm's Login, Account and Email themes to `corelink`. Set the Admin theme to `corelink` for realms where the branded admin console is desired.

For the Account Console, also keep the login theme enabled for the `account-console` authentication flow so expired sessions return through the same branded login experience.

## Customization policy

1. Prefer shared CSS, messages, runtime branding and `DefaultPage` first.
2. Own/eject an individual page only when the product requires different markup or behavior.
3. Keep authentication semantics and form actions supplied by Keycloak unchanged.
4. Test both `fa`/RTL and `en`/LTR.
5. Test password, OTP, passkey and recovery flows against a real Keycloak before release.
6. Keep Admin and Account customizations shallow to reduce upgrade cost across Keycloak releases.
