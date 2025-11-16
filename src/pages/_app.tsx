import "@styles/globals.css";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import nextI18nextConfig from "../../next-i18next.config";
import languageOptions from "../lib/languageOptions";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { locale } = router;

  useEffect(() => {
    const lang = languageOptions.find((lang) => lang.code === locale);
    if (lang) {
      document.documentElement.dir = lang.dir;
    }
  }, [locale]);

  return <Component {...pageProps} />;
}

export default appWithTranslation(MyApp, nextI18nextConfig);
