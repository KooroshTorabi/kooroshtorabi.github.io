import languageOptions from "@lib/languageOptions";
import LanguageSwitcher from "@ui/LanguageSwitcher";
import { useTranslation } from "next-i18next";
import { Inter, Vazirmatn } from "next/font/google";
import Link from "next/link";

const VazirmatnFont = Vazirmatn({ subsets: ["latin"], weight: ["400"] });
const InterFont = Inter({ subsets: ["latin"] });

interface HeaderProps {
  currentLang?: string;
}

export default function Header({ currentLang }: HeaderProps) {
  const { t } = useTranslation("common");

  const langOption =
    languageOptions.find((l) => l.code === currentLang) || languageOptions[0];
  const dir = langOption.dir || "ltr";
  const fontClass =
    langOption.code === "fa" ? VazirmatnFont.className : InterFont.className;

  return (
    <header
      className="sticky top-0 z-50 rounded-xl bg-stone-800 text-amber-300 shadow-md px-3 md:px-6 py-2 md:py-3"
      dir={dir}
    >
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-2 md:gap-3">
        <Link
          href="/"
          className={`text-lg md:text-xl font-bold ${fontClass}`}
        >
          {t("mainHeading")}
        </Link>

        <nav className={`flex items-center gap-1 md:gap-2 ${fontClass}`}>
          <Link
            href="/"
            className="px-2 py-1 md:px-4 md:py-2 text-sm md:text-base font-medium rounded hover:bg-stone-700 transition"
          >
            {t("home")}
          </Link>
          <Link
            href="/about"
            className="px-2 py-1 md:px-4 md:py-2 text-sm md:text-base font-medium rounded hover:bg-stone-700 transition"
          >
            {t("aboutButton")}
          </Link>
          <Link
            href="/projects"
            className="px-2 py-1 md:px-4 md:py-2 text-sm md:text-base font-medium rounded hover:bg-stone-700 transition"
          >
            {t("projectsButton")}
          </Link>
          <Link
            href="/blog"
            className="px-2 py-1 md:px-4 md:py-2 text-sm md:text-base font-medium rounded hover:bg-stone-700 transition"
          >
            {t("blogButton")}
          </Link>
          <div className="ms-1 md:ms-2">
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </header>
  );
}
