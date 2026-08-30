# CoreLink Identity

یک قالب مدرن، قابل استفاده مجدد و مناسب محیط Production برای صفحه‌های احراز هویت Keycloak که با **Keycloakify، React، TypeScript و Vite** ساخته شده است. برند پیش‌فرض CoreLink است، اما نام theme، نام برند، شعار، لوگو، رنگ‌ها و ترجمه‌ها قابل تغییر هستند و پروژه می‌تواند برای هر محصول دیگری استفاده شود.

[English README](README.md) · [راهنمای نصب فارسی](docs/INSTALLATION.fa.md) · [Branding](docs/BRANDING.md) · [راهنمای Release](docs/RELEASES.md)

## امکانات

- رابط مدرن برای احراز هویت Keycloak بدون ظاهر پیش‌فرض Keycloak.
- خروجی JAR قابل نصب برای Keycloak 26.2 به بالا.
- پشتیبانی انگلیسی و فارسی با RTL واقعی.
- پوشش flowهای استاندارد ورود، ثبت‌نام، فراموشی رمز، تأیید ایمیل، OTP/TOTP و required actionها.
- امکان تغییر branding هنگام build.
- Docker image چندمرحله‌ای Keycloak با theme از پیش نصب‌شده.
- CI برای بررسی build.
- Release خودکار شامل JAR آماده نصب، checksum و Docker image در GHCR.

## سازگاری

نسخه پایه فعلی Docker روی **Keycloak 26.7.2** است و theme برای `26.2-and-above` ساخته می‌شود.

## اجرای سریع برای توسعه

نیازمندی‌ها: Node.js 20 یا بالاتر و npm.

```bash
git clone https://github.com/CoreLinkPlatform/Identity.git
cd Identity
npm install
npm run dev
```

ساخت فایل قابل نصب روی Keycloak:

```bash
npm run build:keycloak
```

خروجی پیش‌فرض:

```text
dist_keycloak/corelink-26.2-and-above.jar
```

برای نصب روی Keycloak موجود، فایل JAR را داخل `/opt/keycloak/providers/` قرار بده، `kc.sh build` را اجرا کن، Keycloak را restart کن و در **Realm settings → Themes → Login theme** مقدار `corelink` را انتخاب کن. جزئیات کامل در [docs/INSTALLATION.fa.md](docs/INSTALLATION.fa.md) آمده است.

## استفاده برای محصول خودتان

این repository به هیچ backend اختصاصی CoreLink وابسته نیست و می‌توان آن را fork و rebrand کرد.

در Keycloakify نام واقعی theme از `package.json:name` گرفته می‌شود. پس در fork خودتان ابتدا نام package را عوض کنید و بعد branding ظاهری را هنگام build بدهید:

```bash
npm pkg set name=my-product
VITE_BRAND_NAME="My Product" \
VITE_BRAND_TAGLINE="Secure access" \
npm run build:keycloak
```

بعد theme با نام `my-product` در Keycloak قابل انتخاب است. برای لوگو می‌توان فایل `public/img/corelink-mark.svg` را جایگزین کرد یا در build سورس مقدار `VITE_BRAND_MARK` را تعیین کرد. راهنمای کامل branding در [docs/BRANDING.md](docs/BRANDING.md) است.

در Docker، مقدار `KEYCLOAK_THEME_NAME` داخل build stage نام package/theme را هم تنظیم می‌کند:

```bash
docker build \
  --build-arg KEYCLOAK_THEME_NAME=my-product \
  --build-arg VITE_BRAND_NAME="My Product" \
  --build-arg VITE_BRAND_TAGLINE="Secure access" \
  -t my-product-keycloak .
```

## فایل‌های Release

با push کردن tagهایی مثل `v0.1.0`، GitHub Actions این خروجی‌ها را منتشر می‌کند:

- `corelink-26.2-and-above.jar` — فایل نصب مستقیم نسخه رسمی CoreLink روی Keycloak.
- `SHA256SUMS` — checksum برای بررسی صحت فایل.
- `ghcr.io/corelinkplatform/identity:<tag>` — image آماده Keycloak همراه theme.
- `ghcr.io/corelinkplatform/identity:latest` — آخرین image منتشرشده.

راهنمای استفاده از فایل‌های Release و روند انتشار در [docs/RELEASES.md](docs/RELEASES.md) است.

## مرزبندی امنیتی repository

این repository عمداً شامل secret، password، realm credential، اطلاعات tenant یا تنظیمات Production CoreLink نیست. provisioning مربوط به realm/client و تنظیمات Compose/Traefik باید در لایه Deployment نگهداری شود.

## مجوز

MIT. استفاده شخصی و تجاری، fork، تغییر و بازتوزیع مطابق شرایط مجوز آزاد است.
