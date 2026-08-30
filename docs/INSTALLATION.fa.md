# راهنمای نصب CoreLink Identity

این راهنما سه روش اصلی استفاده را پوشش می‌دهد: نصب JAR منتشرشده روی Keycloak موجود، استفاده از Docker image آماده، یا ساخت نسخه اختصاصی با برند خودتان.

## ۱. نصب JAR روی Keycloak موجود

### نیازمندی‌ها

- Keycloak نسخه 26.2 یا بالاتر.
- دسترسی به مسیر `providers` در Keycloak.
- امکان rebuild/restart کردن Keycloak.

### مراحل

1. از بخش Releases فایل `corelink-26.2-and-above.jar` و `SHA256SUMS` را دانلود کنید.
2. صحت فایل را بررسی کنید:

```bash
sha256sum -c SHA256SUMS
```

3. فایل JAR را داخل Keycloak کپی کنید:

```bash
cp corelink-26.2-and-above.jar /opt/keycloak/providers/corelink-theme.jar
```

4. Keycloak را rebuild کنید:

```bash
/opt/keycloak/bin/kc.sh build
```

5. سرویس را restart کنید.
6. در Admin Console مسیر زیر را باز کنید:

```text
Realm settings → Themes → Login theme → corelink
```

7. تنظیم را Save کنید و login واقعی همان realm را تست کنید.

### اگر Keycloak با Docker اجرا می‌شود

بهتر است به‌جای mount کردن JAR در runtime یک image مشتق‌شده بسازید:

```dockerfile
FROM quay.io/keycloak/keycloak:26.7.2 AS builder
COPY corelink-26.2-and-above.jar /opt/keycloak/providers/corelink-theme.jar
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:26.7.2
COPY --from=builder /opt/keycloak/ /opt/keycloak/
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start", "--optimized"]
```

## ۲. اجرای Docker image آماده GHCR

```bash
docker pull ghcr.io/corelinkplatform/identity:v0.1.0
```

برای تست محلی:

```bash
docker run --rm -p 8080:8080 \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=change-me \
  ghcr.io/corelinkplatform/identity:v0.1.0 \
  start-dev
```

برای Production از `start-dev` استفاده نکنید. دیتابیس، hostname، TLS/proxy و secretها باید توسط سیستم Deployment تأمین شوند.

## ۳. ساخت نسخه CoreLink از سورس

نیازمندی‌ها: Node.js 20+ و npm.

```bash
git clone https://github.com/CoreLinkPlatform/Identity.git
cd Identity
npm install
npm run build:keycloak
```

خروجی:

```text
dist_keycloak/corelink-26.2-and-above.jar
```

## ۴. ساخت fork با برند اختصاصی

در Keycloakify نام واقعی theme از `package.json:name` گرفته می‌شود. در fork خودتان ابتدا نام package را تغییر دهید:

```bash
npm pkg set name=acme
VITE_BRAND_NAME="Acme" \
VITE_BRAND_TAGLINE="Secure workspace" \
npm run build:keycloak
```

بعد theme با نام `acme` در Realm settings قابل انتخاب خواهد بود. برای لوگو فایل `public/img/corelink-mark.svg` را جایگزین کنید یا `VITE_BRAND_MARK` را روی resource دیگری بگذارید.

## ۵. ساخت Docker image اختصاصی

Dockerfile این repository مقدار `KEYCLOAK_THEME_NAME` را به نام package/theme تبدیل می‌کند:

```bash
docker build \
  --build-arg KEYCLOAK_VERSION=26.7.2 \
  --build-arg KEYCLOAK_THEME_NAME=acme \
  --build-arg VITE_BRAND_NAME="Acme" \
  --build-arg VITE_BRAND_TAGLINE="Secure workspace" \
  -t acme-keycloak:26.7.2 .
```

## ۶. تنظیم Realm

این repository عمداً Realm یا Client ایجاد نمی‌کند. بعد از نصب theme، realm را به‌صورت معمول تنظیم کنید و theme را در Realm settings انتخاب کنید. realm export، client secret، password دیتابیس و تنظیمات Production باید در repository مربوط به Deployment نگهداری شوند.

## ۷. روند Upgrade

1. Release Notes نسخه جدید را بخوانید.
2. طبق رویه عملیاتی خود از دیتابیس و تنظیمات Realm backup بگیرید.
3. JAR یا Docker image قبلی را با نسخه tagشده جدید جایگزین کنید.
4. در نصب دستی JAR دوباره `kc.sh build` را اجرا کنید.
5. Keycloak را restart کنید.
6. login، register، reset password، verify email، OTP/TOTP و required actionهای اختصاصی را تست کنید.

چند نسخه از یک theme را هم‌زمان داخل `providers/` قرار ندهید.

## ۸. رفع اشکال

### Theme در لیست دیده نمی‌شود

وجود JAR در `/opt/keycloak/providers/` را بررسی کنید، `kc.sh build` را دوباره اجرا کنید، سرویس را restart کنید و مطمئن شوید نام انتخاب‌شده با `package.json:name` زمان build یکی است؛ در Docker این نام از `KEYCLOAK_THEME_NAME` گرفته می‌شود.

### استایل قدیمی نمایش داده می‌شود

Keycloak را restart و cache مرورگر را پاک کنید.

### فارسی نمایش داده نمی‌شود

Internationalization را در Realm فعال کنید و زبان فارسی (`fa`) را به Supported locales اضافه کنید. رابط برای فارسی و عربی به‌صورت خودکار RTL می‌شود.

### Container بالا می‌آید ولی Production configuration خطا دارد

Image فقط Keycloak و theme را بسته‌بندی می‌کند. دیتابیس، hostname، proxy/TLS، provisioning و secretها باید از لایه Deployment تأمین شوند.
