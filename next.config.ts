// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   i18n: {
//     locales: ["fa", "en", "de"],
//     defaultLocale: "en",
//     localeDetection: false,
//   },
// };

// export default nextConfig;

// next.config.js
const { i18n } = require("./next-i18next.config"); // اطمینان از فراخوانی فایل

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... سایر تنظیمات Next.js
  i18n, // اضافه کردن پیکربندی i18n
};

module.exports = nextConfig;
