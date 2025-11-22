import languageOptions from "@lib/languageOptions";
import { useTranslation } from "next-i18next";
import { Pixelify_Sans, Vazirmatn } from "next/font/google";
import Link from "next/link";

const VazirmatnFont = Vazirmatn({ subsets: ["latin"], weight: ["400"] });
const PixlifyFont = Pixelify_Sans({ subsets: ["latin"], weight: ["400"] });

interface HeaderProps {
  currentLang?: string;
}

export default function Header({ currentLang }: HeaderProps) {
  const { t, i18n } = useTranslation("common");

  const langOption =
    languageOptions.find((l) => l.code === currentLang) || languageOptions[0];
  const dir = langOption.dir || "ltr";
  const fontClass =
    langOption.code === "fa" ? VazirmatnFont.className : PixlifyFont.className;

  return (
    <header
      className={`sticky top-0 z-50 rounded-xl bg-stone-800 text-amber-300 shadow-md flex flex-col md:flex-row items-center justify-center md:justify-between px-3 md:px-6 py-2 md:py-3`}
      dir={dir}
    >
      <div
        className={`flex items-center w-full md:w-auto justify-center ${dir === "rtl" ? "md:justify-end" : "md:justify-start"} mb-1 md:mb-0`}
      >
        <Link href="/" className={`text-lg md:text-xl font-bold ${fontClass}`}>
          {t("mainHeading")}
        </Link>
      </div>

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
