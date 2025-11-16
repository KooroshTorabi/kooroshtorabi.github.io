import type { NextConfig } from "next";
import { i18n } from "./next-i18next.config"; // ⚠️ مطمئن شوید که این import کار می‌کند.

// const { i18n } = require("./next-i18next.config.js"); // فراخوانی تنظیمات next-i18next

const nextConfig: NextConfig = {
  /* config options here */
  i18n,
  // این شیء i18n شامل فقط مواردی است که Next.js نیاز دارد (locales, defaultLocale)
};

export default nextConfig;
