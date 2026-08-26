# راهنمای افزودن فونت دلخواه به پروژه (Custom Fonts)

برای اضافه کردن فونت دلخواه خود، فایل‌های فونت را با فرمت `.woff2` یا `.ttf` یا `.woff` داخل همین پوشه (`/public/fonts/`) قرار دهید.

### نام‌گذاری پیشنهادی:
- `custom-font.woff2` یا `custom-font.ttf` (وزن عادی - Regular)
- `custom-font-bold.woff2` یا `custom-font-bold.ttf` (وزن ضخیم - Bold)
- `iranyekan.woff2` یا `iranyekan.ttf`

فایل‌های استایل پروژه در `src/index.css` به صورت خودکار فونت‌های قرار گرفته در این مسیر را به عنوان فونت اولویت‌دار لود می‌کنند.

```css
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom-font.woff2') format('woff2'),
       url('/fonts/custom-font.ttf') format('truetype');
  font-weight: 100 900;
  font-display: swap;
}
```
