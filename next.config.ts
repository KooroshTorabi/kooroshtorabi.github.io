import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  i18n: {
    locales: ["fa", "en", "de"],
    defaultLocale: "en",
    localeDetection: false,
  },
};

export default nextConfig;
