// src/components/LanguageSwitcher.tsx

import languageOptions from "@src/lib/languageOptions";
import { useTranslation } from "next-i18next";
import { InterFont, VazirmatnFont } from "@lib/fonts";
import Image from "next/image"; // 👈 مطمئن شوید که این ایمپورت را اضافه کنید
import { useRouter } from "next/router";
import { useState } from "react";

// 👈 تصحیح نام تابع
const LanguageSwitcher = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);
  const currentLocale = router.locale || router.defaultLocale || "fa";

  const currentLanguage =
    languageOptions.find((lang) => lang.code === currentLocale) ||
    languageOptions[0];

  const changeLanguage = (lng: string) => {
    router.push(router.asPath, router.asPath, { locale: lng });
    setIsOpen(false);
  };

  // تابع کمکی برای رندر پرچم
  const renderFlag = (lang: (typeof languageOptions)[0], size: number = 30) => {
    if (lang.type === "image") {
      return (
        <Image
          src={lang.flag}
          alt={lang.name}
          width={size}
          height={size}
          className="mr-1 object-contain" // پدینگ برای جدا کردن از فلش
        />
      );
    }
    return <span className="text-xl mr-1">{lang.flag}</span>;
  };

  return (
    <div className="relative inline-block text-left z-50">
      {/* دکمه اصلی (ظاهر جمع و جور و مینیمال) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        // 👈 استایل‌های جمع و جور، رنگ طلایی و متن تیره
        className="inline-flex justify-center items-center w-full h-8 rounded-md border border-amber-800 shadow-sm px-2 py-1 bg-amber-500 text-xs font-medium text-stone-900 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {renderFlag(currentLanguage)}
        <div
          className={`px-2 ${currentLocale === "fa" ? VazirmatnFont.className : InterFont.className}`}
        >
          {currentLanguage.name}
        </div>

        {/* آیکون فلش کوچک‌تر */}
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

      {/* منوی دراپ‌داون (تصحیح ساختار و استایل‌ها) */}
      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-1 w-32 rounded-md p-1 shadow-2xl bg-amber-800 ring-1 ring-amber-600 ring-opacity-5 divide-y divide-amber-700 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {languageOptions
              .filter((lang) => lang.code !== currentLocale) // نمایش زبان‌های دیگر
              .map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang.code)}
                  role="menuitem"
                  // 👈 استایل‌های آیتم منو: text-white، hover:bg-stone-700، عرض کامل
                  className={`flex items-center w-full px-2 py-1 text-xs text-amber-500 hover:bg-amber-700 ${lang.code === "fa" ? VazirmatnFont.className : InterFont.className}`}
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
