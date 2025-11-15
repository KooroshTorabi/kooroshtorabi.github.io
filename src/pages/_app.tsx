import "@styles/globals.css";
import { IntlProvider } from "next-intl";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <IntlProvider
      messages={pageProps.messages}
      locale={pageProps.locale || 'en'}
    >
      <Component {...pageProps} />
    </IntlProvider>
  );
}

export default MyApp;
