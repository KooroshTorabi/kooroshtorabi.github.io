import Button from "@ui/Button";
import LanguageSwitcher from "@ui/LanguageSwitcher";
import { useTranslations } from "next-intl";
import { Bokor, Pixelify_Sans } from "next/font/google";
import Link from "next/link";

const BokorFont = Bokor({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bokor",
});

const PixlifyFont = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pixlify",
});

// 💥 کامپوننت اصلی به صورت نامگذاری شده (Named Export) صادر می‌شود.
export function HomePage() {
  const t = useTranslations();
  const isRTL = t("dir") === "rtl";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`min-h-screen flex flex-col bg-stone-900 p-10 ${PixlifyFont.className}`}
    >
      {/* دکمه‌های تغییر زبان (مکان آن بر اساس RTL/LTR تغییر می‌کند) */}
      <div className="space-x-4">
        <h1
          className={`text-4xl mb-6 text-white ${isRTL ? "text-right" : "text-left"}`}
        >
          {t("welcome")}
        </h1>
        <div
          className={`absolute top-4 w-full max-w-xs flex ${isRTL ? "justify-start left-4" : "justify-end right-4"}`}
        >
          <LanguageSwitcher />
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-3 text-white">
            {t("title")}
          </h1>

          <p className="font-inter text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            {t("description")}
          </p>

          <p className="text-sm text-yellow-500 mb-4 font-bold">
            {t("uniqueContent")}
          </p>

          {/* جهت‌دهی دکمه‌ها نیز بر اساس زبان تغییر می‌کند */}
          <div
            className={`flex flex-wrap items-center justify-center gap-4 mb-12 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Link href={isRTL ? "/fa/resume" : "/resume"} legacyBehavior>
              <a className="inline-flex">
                <Button className="bg-amber-500 hover:bg-amber-400 text-stone-900 border-amber-800">
                  {t("viewResume")}
                  <span
                    className={`w-4 h-4 inline-block text-stone-900 ${isRTL ? "mr-2" : "ml-2"}`}
                  >
                    {isRTL ? "←" : "→"}
                  </span>
                </Button>
              </a>
            </Link>

            <Link href={isRTL ? "/fa/contact" : "/contact"} legacyBehavior>
              <a className="inline-flex">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white border-slate-700">
                  {t("getInTouch")}
                </Button>
              </a>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6">
            {/* Social Icons (SVG placeholders) */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <span className="text-2xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.087-.744.084-.69.084-.69 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.046.138 3.003.404 2.292-1.552 3.3-1.23 3.3-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.088 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <span className="text-2xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.366-4-3.267-4 0v5.604h-3v-11h3v1.765c1.395-2.536 7-2.428 7 3.864v5.371z" />
                </svg>
              </span>
            </a>
            <a
              href="mailto:hello@example.com"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <span className="text-2xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M0 3v18h24v-18h-24zm6.623 12.771l-6.623 4.229v-14.993l6.606 4.195 3.194 2.046 3.195-2.046 6.606-4.195v14.993l-6.623-4.229-3.377 2.153-3.377-2.153z" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
