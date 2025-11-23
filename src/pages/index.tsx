// import Github from "@/assets/icons/github.svg";
// import Linkedin from "@/assets/icons/linkedin.svg";
// import Mail from "@/assets/icons/mail.svg";
import NeonButton from "@src/components/ui/NeonButton";
import LanguageSwitcher from "@ui/LanguageSwitcher";
import { textWithLineBreaks } from "@utils/textWithLineBreaks";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import { Pixelify_Sans, Vazirmatn } from "next/font/google";
import { useRouter } from "next/router";

const VazirmatnFont = Vazirmatn({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-vazirmatn",
});

const PixlifyFont = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pixlify",
});
const TextCrawlCanvas = dynamic<{ children: React.ReactNode; locale?: string }>(
  () => import("../components/ui/TextCrawl"),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 flex items-center justify-center text-white">
        Loading...
      </div>
    ),
  },
);

export default function HomePage() {
  const { t } = useTranslation("common");
  const router = useRouter();

  const currentLocale = router.locale;
  const pageDirection =
    currentLocale === "fa" ? "top-4 left-4" : "top-4 right-4"; // 'fa' (فارسی) راست‌چین است.
  const changeLanguage = (currentLng: string | undefined) => {
    const supportedLocales = ["fa", "en", "de"];
    const currentIndex = supportedLocales.indexOf(currentLng + "");
    const nextIndex = (currentIndex + 1) % supportedLocales.length;
    const nextLng = supportedLocales[nextIndex];

    router.push(router.asPath, router.asPath, { locale: nextLng });
  };

  return (
    <div
      className={`min-h-screen flex flex-col text-amber-600 bg-stone-900 p-10  ${currentLocale === "fa" ? VazirmatnFont.className : PixlifyFont.className}`}
    >
      <div className="space-x-4">
        <h4 className="text-1xl mb-6">{t("siteTitle")}</h4>
        <div
          className={`absolute ${pageDirection} w-full max-w-xs flex justify-end`}
        >
          <LanguageSwitcher />
        </div>
      </div>
      <div className="min-h-screen flex items-center justify-center">
        <div
          className={`w-full max-w-7xl mx-auto px-6 text-center ${currentLocale === "fa" ? VazirmatnFont.className : PixlifyFont.className}`}
        >
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-3">
            {t("mainHeading")}
          </h1>
          {/* Mobile version (simple div text) */}
          <div className="relative w-full mb-12 rounded-lg bg-stone-800 text-white p-4 block md:hidden">
            {textWithLineBreaks(t("introParagraph"))}
            {/* متن مخصوص موبایل */}
          </div>

          {/* Desktop version (show TextCrawlCanvas) */}
          <div className="relative h-96 w-full mb-12 overflow-hidden hidden md:block">
            <div className="absolute inset-0 pointer-events-none">
              <TextCrawlCanvas locale={currentLocale}>
                {t("introParagraph")}
              </TextCrawlCanvas>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <NeonButton
              href={`/blog`}
              locale={currentLocale}
              className="mx-8 px-6 py-3 rounded-lg bg-stone-700 text-amber-300 font-semibold hover:bg-amber-500 hover:text-black transition"
            >
              {t("blogButton")}
            </NeonButton>

            <NeonButton
              href={`/about`}
              locale={currentLocale}
              className="px-6 py-3 rounded-lg bg-stone-700 text-amber-300 font-semibold hover:bg-amber-500 hover:text-black transition"
            >
              {t("aboutButton")}
            </NeonButton>
          </div>

          <div className="flex items-center justify-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              {/* <Github className="w-6 h-6" /> */}
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              {/* <Linkedin className="w-6 h-6" /> */}
            </a>
            <a
              href="mailto:hello@example.com"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              {/* <Mail className="w-6 h-6" /> */}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  // لود کردن فایل common.json برای زبان فعلی (locale)
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
