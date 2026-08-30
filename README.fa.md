# CoreLink Identity

یک قالب مدرن، قابل استفاده مجدد و مناسب محیط Production برای صفحه‌های احراز هویت Keycloak که با **Keycloakify، React، TypeScript و Vite** ساخته شده است. برند پیش‌فرض CoreLink است، اما نام theme، نام برند، شعار، لوگو، رنگ‌ها و متن‌های معرفی قابل تغییر هستند و پروژه می‌تواند برای هر محصول دیگری استفاده شود.

[English README](README.md) · [راهنمای نصب فارسی](docs/INSTALLATION.fa.md) · [Branding](docs/BRANDING.md) · [راهنمای Release](docs/RELEASES.md)

## امکانات

- رابط مدرن برای احراز هویت Keycloak بدون ظاهر پیش‌فرض Keycloak.
- خروجی JAR قابل نصب برای Keycloak 26.2 به بالا.
- پشتیبانی انگلیسی و فارسی با RTL/LTR پویا.
- پوشش flowهای استاندارد ورود، ثبت‌نام، فراموشی رمز، تأیید ایمیل، OTP/TOTP و required actionها.
- امکان تغییر branding هنگام build و از طریق Realm Attributes.
- امکان تغییر متن‌های hero برای هر زبان بدون fork کردن کد.
- Docker image چندمرحله‌ای Keycloak با theme از پیش نصب‌شده.
- CI برای بررسی build.
- Release خودکار شامل JAR آماده نصب، checksum و Docker image در GHCR.

## سازگاری

نسخه پایه فعلی Docker روی **Keycloak 26.7.2** است.

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

خروجی‌های Keycloakify داخل `dist_keycloak/` ساخته می‌شوند.

برای نصب روی Keycloak موجود، JAR مناسب نسخه Keycloak را داخل `/opt/keycloak/providers/` قرار بده، `kc.sh build` را اجرا کن، Keycloak را restart کن و در **Realm settings → Themes → Login theme** مقدار `corelink` را انتخاب کن. جزئیات کامل در [docs/INSTALLATION.fa.md](docs/INSTALLATION.fa.md) آمده است.

## استفاده برای محصول خودتان

این repository به هیچ backend اختصاصی CoreLink وابسته نیست و می‌توان آن را fork و rebrand کرد.

در Keycloakify نام واقعی theme از `package.json:name` گرفته می‌شود. پس در fork خودتان ابتدا نام package را عوض کنید و بعد branding ظاهری را هنگام build بدهید:

```bash
npm pkg set name=my-product
VITE_BRAND_NAME="My Product" \
VITE_BRAND_TAGLINE="Secure access" \
npm run build:keycloak
```

بعد theme با نام `my-product` در Keycloak قابل انتخاب است. برای لوگو می‌توان فایل `public/img/corelink-mark.svg` را جایگزین کرد یا در build مقدار `VITE_BRAND_MARK` را تعیین کرد. راهنمای کامل branding در [docs/BRANDING.md](docs/BRANDING.md) است.

در Docker، مقدار `KEYCLOAK_THEME_NAME` داخل build stage نام package/theme را هم تنظیم می‌کند:

```bash
docker build \
  --build-arg KEYCLOAK_THEME_NAME=my-product \
  --build-arg VITE_BRAND_NAME="My Product" \
  --build-arg VITE_BRAND_TAGLINE="Secure access" \
  -t my-product-keycloak .
```

## تغییر متن‌های CoreLink بدون تغییر سورس

متن‌های فعلی CoreLink فقط **default** هستند. مصرف‌کننده theme می‌تواند آن‌ها را در Realm Attributes تغییر دهد. برای هر کلید، نسخه عمومی و نسخه مخصوص زبان پشتیبانی می‌شود؛ نسخه زبان اولویت بالاتری دارد.

نمونه:

```text
copy.headline.en=Everything your team needs, in one place.
copy.headline.fa=همه چیزهایی که تیم شما نیاز دارد، یک‌جا.
copy.description.en=Your own product description.
copy.description.fa=توضیح اختصاصی محصول شما.
copy.chip.en=Your own short message
copy.chip.fa=پیام کوتاه اختصاصی شما
```

کلیدهای قابل تنظیم:

```text
copy.eyebrow
copy.headline
copy.description
copy.chip
copy.featureOne
copy.featureTwo
copy.featureThree
copy.lightMode
copy.darkMode
```

برای هرکدام می‌توان پسوند زبان مثل `.fa` یا `.en` گذاشت. اگر override وجود نداشته باشد، متن‌های پیش‌فرض CoreLink نمایش داده می‌شوند.

Branding نیز از قبل از Realm Attributes قابل تغییر است:

```text
brand.name
brand.tagline
brand.logoUrl
brand.markUrl
brand.backgroundUrl
brand.primaryColor
brand.accentColor
```

بنابراین کسی که این theme را نصب می‌کند برای تغییر نام، لوگو، رنگ و متن‌های معرفی الزاماً نیاز به fork یا rebuild ندارد.

## فایل‌های Release

با push کردن tagهایی مثل `v0.1.0`، GitHub Actions خروجی‌های release را می‌سازد و Docker image آماده Keycloak را در GHCR منتشر می‌کند. جزئیات روند انتشار در [docs/RELEASES.md](docs/RELEASES.md) است.

## مرزبندی امنیتی repository

این repository عمداً شامل secret، password، realm credential، اطلاعات tenant یا تنظیمات Production CoreLink نیست. provisioning مربوط به realm/client و تنظیمات Compose/Traefik باید در لایه Deployment نگهداری شود.

## مجوز

MIT. استفاده شخصی و تجاری، fork، تغییر و بازتوزیع مطابق شرایط مجوز آزاد است.