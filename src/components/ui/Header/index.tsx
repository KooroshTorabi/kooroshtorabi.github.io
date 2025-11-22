// src/components/ui/Header.tsx
import languageOptions from "@src/lib/languageOptions";
import { useTranslation } from "next-i18next";
import { Pixelify_Sans, Vazirmatn } from "next/font/google";
import Link from "next/link";
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

interface HeaderProps {
  currentLang?: string | null; // null = All
}

export default function Header({ currentLang = "all" }: HeaderProps) {
  const { t } = useTranslation("common");
  const router = useRouter();

  // زبان واقعی برای dir و فونت
  const langCode =
    currentLang && currentLang !== "all" ? currentLang : router.locale || "en";

  const langOption = languageOptions.find((l) => l.code === langCode);
  const dir = langOption?.dir || "ltr";
  const fontClass =
    langOption?.code === "fa" ? VazirmatnFont.className : PixlifyFont.className;

  // چینش منو بر اساس dir
  const justifyStart = dir === "rtl" ? "md:justify-end" : "md:justify-start";

  return (
    <header
      className={`sticky top-0 z-50 rounded-xl bg-stone-800 text-amber-300 shadow-md flex flex-col md:flex-row items-center justify-center md:justify-between px-3 md:px-6 py-2 md:py-3`}
      dir={dir}
    >
      {/* عنوان سایت */}
      <div
        className={`flex items-center  w-full md:w-auto justify-center md:${justifyStart} mb-1 md:mb-0`}
      >
        <Link href="/" className={`text-lg md:text-xl font-bold ${fontClass}`}>
          {t("mainHeading")}
        </Link>
      </div>

      {/* منوی وسط */}
      <nav className="flex justify-center w-full md:w-auto mt-1 md:mt-0">
        <Link
          href="/blog"
          className={`px-2 py-1 md:px-4 md:py-2 text-sm md:text-base font-medium rounded hover:bg-stone-700 transition ${fontClass}`}
        >
          {t("blogButton")}
        </Link>
      </nav>
    </header>
  );
}
