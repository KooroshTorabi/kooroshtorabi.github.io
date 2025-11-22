import ArrowRight from "@icons/arrow-right.svg";
// import Github from "@/assets/icons/github.svg";
// import Linkedin from "@/assets/icons/linkedin.svg";
// import Mail from "@/assets/icons/mail.svg";
import Button from "@ui/Button";
import LanguageSwitcher from "@ui/LanguageSwitcher";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import { Bokor, Pixelify_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router"; // برای تغییر مسیر و زبان

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
const TextCrawlCanvas = dynamic<{ children: React.ReactNode }>(
  () => import("../components/ui/TextCrawl"),
  {
    ssr: false, // 👈 این خط حیاتی است!
    loading: () => (
      <div className="h-96 flex items-center justify-center text-white">
        در حال بارگذاری تیتراژ...
      </div>
    ),
  },
);

export default function HomePage() {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();

  const currentLocale = router.locale;
  const pageDirection =
    currentLocale === "fa" ? "top-4 left-4" : "top-4 right-4"; // 'fa' (فارسی) راست‌چین است.
  const changeLanguage = (currentLng: string | undefined) => {
    const supportedLocales = ["fa", "en", "de"];
    const currentIndex = supportedLocales.indexOf(currentLng + "");
    // انتخاب زبان بعدی در لیست (و بازگشت به اول در صورت رسیدن به آخر)
    const nextIndex = (currentIndex + 1) % supportedLocales.length;
    const nextLng = supportedLocales[nextIndex];

    router.push(router.asPath, router.asPath, { locale: nextLng });
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-stone-900 p-10  ${PixlifyFont.className}`}
    >
      <div className="space-x-4">
        <h4 className="text-4xl mb-6">{t("welcome")}</h4>
        <div
          className={`absolute ${pageDirection} w-full max-w-xs flex justify-end`}
        >
          <LanguageSwitcher />
        </div>
      </div>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold  mb-3">
            {t("mainHeading")}
          </h1>

          <div className="relative h-96 w-full mb-12  rounded-lg overflow-hidden">
            <TextCrawlCanvas>{t("introParagraph")}</TextCrawlCanvas>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Link href="/resume">
              <Button className="bg-slate-900 hover:bg-slate-800">
                {t("resumeButton")}
                <Image src={ArrowRight} alt={""} className="ml-2 w-4 h-4" />
              </Button>
            </Link>

            <Link href="/contact">
              <Button>{t("contactButton")}</Button>
            </Link>
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
      ...(await serverSideTranslations(locale || "en", ["common"])),
    },
  };
}
