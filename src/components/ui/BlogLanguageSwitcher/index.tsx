// src/components/BlogLanguageSwitcher.tsx

import languageOptions, { type LanguageOption } from "@lib/languageOptions";
import { Pixelify_Sans, Vazirmatn } from "next/font/google";
import Image from "next/image";
import { useState } from "react";

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

interface Props {
  currentLang?: string | null; // null = همه زبان‌ها
  onChange: (lang: string | null) => void;
}

export default function BlogLanguageSwitcher({ currentLang, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLang = currentLang ?? "all";

  const allOption: LanguageOption & {
    code: "all";
    name: "All";
    flag: "🌐";
    type: "emoji";
  } = {
    code: "all",
    name: "All",
    flag: "🌐",
    type: "emoji",
    dir: "ltr",
  };

  const renderFlag = (lang: LanguageOption | typeof allOption) => {
    if (lang.type === "image") {
      return (
        <Image
          src={lang.flag}
          alt={lang.name}
          width={24}
          height={24}
          className="mr-1 object-contain"
        />
      );
    }
    return <span className="text-xl mr-1">{lang.flag}</span>;
  };

  const handleSelect = (lang: string | null) => {
    setIsOpen(false);
    onChange(lang);
  };

  const currentOption =
    selectedLang === "all"
      ? allOption
      : languageOptions.find((l) => l.code === selectedLang)!;

  return (
    <div className="relative inline-block text-left z-50">
      {/* دکمه اصلی */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-center items-center w-full h-8 rounded-md border border-amber-800 shadow-sm px-2 py-1 bg-amber-500 text-xs font-medium text-stone-900 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
      >
        {renderFlag(currentOption)}
        <div
          className={`px-2 ${currentOption.code === "fa" ? VazirmatnFont.className : PixlifyFont.className}`}
        >
          {currentOption.name}
        </div>

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

      {/* منوی دراپ‌داون */}
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-1 w-32 rounded-md p-1 shadow-lg bg-amber-800 ring-1 ring-amber-600 ring-opacity-5 divide-y divide-amber-700 focus:outline-none">
          <div className="py-1">
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className={`flex items-center w-full px-2 py-1 text-xs text-amber-500 hover:bg-amber-700 ${PixlifyFont.className}`}
            >
              {renderFlag(allOption)}
              {allOption.name}
            </button>

            {languageOptions.map((lang: LanguageOption) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`flex items-center w-full px-2 py-1 text-xs text-amber-500 hover:bg-amber-700 ${
                  lang.code === "fa"
                    ? VazirmatnFont.className
                    : PixlifyFont.className
                }`}
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
}
