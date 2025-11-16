// src/pages/_app.tsx

import "@styles/globals.css";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import nextI18NextConfig from "../../next-i18next.config"; // مسیر دهی صحیح

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default appWithTranslation(MyApp, nextI18NextConfig);
