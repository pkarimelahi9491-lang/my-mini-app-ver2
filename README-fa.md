# راهنمای راه‌اندازی روی Vercel + Supabase

پروژه «SHADOW / DESIGN REVIEW» با این معماری مستقر می‌شود:

```
Vercel  ──►  سایت عمومی (استاتیک، از dist/)
        ──►  پنل مدیریت  /admin (استاتیک + لاگین)
        ──►  Serverless Functions  /api/*  (کد: vercel/api/*.ts)
                  │
                  ├──► Supabase Postgres  ← تمام متن‌ها و داده‌ها
                  └──► Supabase Storage   ← تصاویر آپلودی جدید
```

- دیتابیس: **Postgres** سوپابیس (جداول در `vercel/schema.sql`)
- آپلود تصاویر جدید: **Supabase Storage** باکت `uploads` — تصاویر موجود فعلی هم به‌صورت استاتیک از خود دیپلوی سرو می‌شوند
- احراز هویت: کوکی HttpOnly امضاشده با HMAC + رمز bcrypt
- ⚠️ محدودیت: بدنه‌ی درخواست سرورلس حداکثر ~۴.۵ مگابایت است؛ فایل‌های خیلی سنگین را از داشبورد Supabase → Storage آپلود کن

---

## مرحله ۰ — آماده‌سازی پوشه مستقل `vercel`

پوشه `vercel` یک پروژه کامل و مستقل است و به بقیه پروژه نیازی ندارد.
فایل‌های فرانت (`src/`، `public/`، اسکریپت ادمین) با اسکریپت زیر از ریشه پروژه داخلش **کپی** می‌شوند — هر بار که چیزی در `src/` تغییر کرد دوباره اجرایش کن:

```
(از ریشه پروژه)  make-vercel.bat
```

بعد از این مرحله همه دستورها را **داخل پوشه `vercel`** اجرا کن.

## مرحله ۱ — ساخت پروژه Supabase

1. برو به [supabase.com](https://supabase.com) → **New project** (پلن رایگان کافیست)
2. بعد از ساخت، از **SQL Editor** کل فایل `vercel/schema.sql` را Paste و Run کن
   (جدول‌ها + ایندکس‌ها + باکت عمودی `uploads` ساخته می‌شود)
3. سه مقدار را یادداشت کن:
   - **DATABASE_URL**: Project Settings → Database → Connection string → تب **URI** → گزینه **Transaction pooler** (پورت 6543) و مطمئن شو انتهای آن `?sslmode=require` دارد
   - **SUPABASE_URL**: Project Settings → API → Project URL
   - **SUPABASE_SERVICE_ROLE_KEY**: همان صفحه، کلید `service_role`
     ⚠️ این کلید فقط سمت سرور استفاده می‌شود؛ هرگز به مرورگر/گیت نده

## مرحله ۲ — ساخت حساب مدیر

داخل پوشه `vercel`:

```bash
npm install

# یکی از دو روش برای DATABASE_URL:
set DATABASE_URL=postgresql://...      (ویندوز CMD)
# یا یک فایل .env داخل همین پوشه بساز و DATABASE_URL را داخلش بگذار

npm run create-admin -- admin RamzGhaviYek8charakteri
```

## مرحله ۳ — دیپلوی روی Vercel

پوشه `vercel` یک پروژه کامل مستقل است؛ فقط همین پوشه را به GitHub می‌بری:

1. داخل پوشه `vercel` یک ریپازیتوری Git جدید بساز و محتوایش را push کن:
   ```bash
   cd vercel
   git init
   git add .
   git commit -m "SHADOW / DESIGN REVIEW — Vercel deployment"
   git remote add origin https://github.com/<user>/<repo>.git
   git push -u origin main
   ```
2. [vercel.com](https://vercel.com) → **Add New Project** → Import همان ریپو
3. Vercel خودش `vercel.json` و اسکریپت build را می‌شناسد؛ فقط در بخش **Environment Variables** این چهار متغیر را اضافه کن:
   | نام | مقدار |
   |---|---|
   | `DATABASE_URL` | از مرحله ۱ |
   | `SUPABASE_URL` | از مرحله ۱ |
   | `SUPABASE_SERVICE_ROLE_KEY` | از مرحله ۱ |
   | `AUTH_SECRET` | هر رشته‌ی تصادفی طولانی (مثلاً خروجی `openssl rand -hex 32`) |
4. **Deploy** بزن

تنظیمات لازم از قبل در `vercel.json` پروژه هست: build با Vite، مسیر `/api/*` به توابع `vercel/api/*` وصل می‌شود.

## مرحله ۴ — انتقال محتوای مرورگر

1. در نسخه فعلی (لوکال) سایت را باز کن → CMS → تب Backup → دانلود JSON
2. روی سایت مستقرشده وارد `https://<your-project>.vercel.app/admin` شو
3. تب Backup → همان فایل JSON را **Import** کن
   (تمام متن‌ها و تنظیمات داخل Postgres ذخیره می‌شود و برای همه اعمال می‌شود)

## مرحله ۵ — دامنه (اختیاری)

در Vercel → Project → Settings → Domains می‌توانی دامنه شخصی وصل کنی. هیچ تغییری در کد لازم نیست؛ همه مسیرها نسبی هستند.

---

## ساختار پوشه `vercel/`

| فایل / پوشه | نقش |
|---|---|
| `package.json` / `tsconfig.json` / `vite.config.ts` | پیکربندی پروژه مستقل |
| `index.html` + `src/` | سایت عمومی (کپی‌شده با make-vercel.bat) |
| `admin/index.html` | ورودی پنل مدیریت |
| `public/` | فایل‌های استاتیک شامل تصاویر فعلی `uploads` |
| `vercel.json` | تنظیمات دیپلوی Vercel |
| `.env.example` | الگوی متغیرهای محیطی |
| `schema.sql` | اسکیمای Postgres + باکت Storage (در SQL Editor اجرا شود) |
| `scripts/create-admin.mjs` | ساخت کاربر مدیر در دیتابیس |
| `api/_lib/db.ts` | کلاینت postgres.js + helperهای CRUD |
| `api/_lib/auth.ts` | توکن HMAC + کوکی سشن |
| `api/_lib/http.ts` | helperهای پاسخ JSON |
| `api/content.ts` | GET محتوای عمومی |
| `api/login/logout/session/change-password.ts` | احراز هویت مدیر |
| `api/projects/pictograms/catalogs/brands.ts` | CRUD مجموعه‌ها |
| `api/settings.ts` | تنظیمات سایت |
| `api/import.ts` | جایگزینی کامل از باندل پشتیبان |
| `api/upload.ts` | آپلود base64 → Supabase Storage |
| `api/uploads/folders.ts` | لیست پوشه‌ها برای AssetUploader |

## نکته‌ها

- **آپلودهای بزرگ:** بدنه سرورلس ~۴.۵MB سقف دارد؛ تابع `/api/upload` تا ~۳MB امن کار می‌کند و بالاتر خطای راهنما برمی‌گرداند. PDFها و فایل‌های سنگین را از Dashboard → Storage → uploads آپلود کن و لینک public آن‌ها را در فیلد مربوطه بگذار.
- **تصاویر قدیمی:** همه آدرس‌های `/uploads/...` فعلی از پوشه `public/uploads` داخل دیپلوی سرو می‌شوند و بدون تغییر کار می‌کنند.
- **توسعه لوکال:** `npm run dev` همچنان با Express کار می‌کند ولی APIهای سرورلس را ندارد؛ برای تست کامل از `vercel dev` (با CLI رسمی Vercel) یا دیپلوی Preview استفاده کن.
- **پشتیبان‌گیری:** Dashboard سوپابیس → Database → Backups، یا از پنل ادمین تب Backup خروجی JSON بگیر.
