import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

const languageOptions = [
  {
    code: "fa",
    name: "فارسی",
    flag: "/images/sun-lion.svg",
    type: "image",
    dir: "rtl",
  },
  { code: "en", name: "English", flag: "🇬🇧", type: "emoji", dir: "ltr" },
  { code: "de", name: "Deutsch", flag: "🇩🇪", type: "emoji", dir: "ltr" },
];

const LanguageSwitcher = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const currentLocale = router.locale || "en";

  const currentLanguage =
    languageOptions.find((lang) => lang.code === currentLocale) ||
    languageOptions[0];

  const changeLanguage = (lng: string) => {
    setIsOpen(false);

    // مسیر فعلی را با locale جدید push می‌کنیم
    router.push(router.asPath, router.asPath, { locale: lng });
  };

  const renderFlag = (lang: (typeof languageOptions)[0], size: number = 30) => {
    if (lang.type === "image") {
      return (
        <Image
          src={lang.flag}
          alt={lang.name}
          width={size}
          height={size}
          className="mr-1 object-contain"
        />
      );
    }
    return <span className="text-xl mr-1">{lang.flag}</span>;
  };

  return (
    <div className="relative inline-block text-left z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="inline-flex justify-center items-center w-full h-8 rounded-md border border-amber-800 shadow-sm px-2 py-1 bg-amber-500 text-xs font-medium text-stone-900 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {renderFlag(currentLanguage)}
        {currentLanguage.name}

        <svg
          className="ml-1 h-3 w-3"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-amber-800 ring-1 ring-amber-600 ring-opacity-5 divide-y divide-amber-700 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1" role="none">
            {languageOptions
              .filter((lang) => lang.code !== currentLocale)
              .map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang.code)}
                  role="menuitem"
                  className="flex items-center w-full px-3 py-2 text-sm text-white hover:bg-amber-700"
                >
                  {renderFlag(lang)}
                  {lang.name}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
