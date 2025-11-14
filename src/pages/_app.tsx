// src/pages/_app.tsx

// 🚨 این آدرس باید دقیق باشد
// اگر globals.css را به src/styles منتقل کردید:
import "@styles/globals.css";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
