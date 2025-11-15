import "@styles/globals.css";
import { IntlProvider } from "next-intl";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // Ensuring the fallback locale matches the application's new default (en)
    <IntlProvider
      messages={pageProps.messages || {}}
      locale={pageProps.locale || "en"} // Changed fallback from 'fa' to 'en'
    >
      <Component {...pageProps} />
    </IntlProvider>
  );
}

export default MyApp;
