// src/pages/_app.tsx
import "@styles/globals.css";
import { IntlProvider } from "next-intl";
import type { AppProps } from "next/app";

// لیست زبان‌ها از env یا پیش‌فرض
const DEFAULT_LOCALES = ["fa", "en", "de"];
export const LOCALES = process.env.NEXT_PUBLIC_LOCALES
  ? process.env.NEXT_PUBLIC_LOCALES.split(",")
  : DEFAULT_LOCALES;

function MyApp({ Component, pageProps, router }: AppProps) {
  const locale = router.locale ?? LOCALES[0]; // همیشه یک string قطعی

  return (
    <IntlProvider
      messages={pageProps.messages || {}} // اگر messages undefined بود، یک object خالی بده
      locale={router.locale ?? LOCALES[0]} // fallback پیش‌فرض
    >
      <Component {...pageProps} />
    </IntlProvider>
  );
}

export default MyApp;
