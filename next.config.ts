import type { NextConfig } from "next";

// const { i18n } = require("./next-i18next.config.js"); // فراخوانی تنظیمات next-i18next

const nextConfig: NextConfig = {
  /* config options here */
  i18n: {
    locales: ["en", "fa", "de"],
    defaultLocale: "en",
  },
  // این شیء i18n شامل فقط مواردی است که Next.js نیاز دارد (locales, defaultLocale)
  // async redirects() {
  //   return [
  //     {
  //       // مسیر اصلی که می‌خواهیم آن را ریدایرکت کنیم
  //       source: "/blog",
  //       // مسیر مقصد که شامل زبان پیش‌فرض است
  //       destination: "/en/blog",
  //       // نوع ریدایرکت: true برای 308 (دائمی)
  //       permanent: true,
  //     },
  //     // اگر صفحات دیگری در ریشه بدون پارامتر زبان دارید، باید برای آن‌ها نیز تعریف کنید
  //     // {
  //     //   source: '/about',
  //     //   destination: '/en/about',
  //     //   permanent: true,
  //     // },
  //   ];
  // },
};

export default nextConfig;
