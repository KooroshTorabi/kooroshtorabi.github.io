import localFont from "next/font/local";

// فونت‌ها به‌صورت لوکال (self-hosted) بارگذاری می‌شوند تا بیلد به سرویس گوگل‌فونت
// وابسته نباشد (رفع باگ فلیکی Turbopack با next/font/google).
export const VazirmatnFont = localFont({
  src: [
    {
      path: "../fonts/Vazirmatn-VariableFont_wght.ttf",
      weight: "100 900",
      style: "normal",
    },
  ],
});

export const InterFont = localFont({
  src: [
    {
      path: "../fonts/Inter-VariableFont.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
});
