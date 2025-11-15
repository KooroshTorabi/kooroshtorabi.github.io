import { useMemo, useState } from "react";

// حذف کامل وابستگی به Next.js Router (useRouter) برای جلوگیری از خطای کامپایل و تضمین کارکرد در Static Export

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

// منطق استخراج locale از URL سمت کلاینت
const getClientLocale = () => {
  if (typeof window === "undefined") return "en"; // سمت سرور: پیش فرض

  // فرض می‌کنیم زبان پیش‌فرض (en) پیشوند ندارد.
  // بررسی می‌کند که آیا مسیر با /fa/ یا /de/ شروع شده است.
  const path = window.location.pathname.toLowerCase();
  const knownLocales = ["fa", "de"];

  for (const locale of knownLocales) {
    if (path.startsWith(`/${locale}/`) || path === `/${locale}`) {
      return locale;
    }
  }

  return "en"; // زبان پیش فرض
};

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);

  const currentLocale = getClientLocale();

  const currentLanguage =
    languageOptions.find((lang) => lang.code === currentLocale) ||
    languageOptions[0];

  // محاسبه مسیر پایه (مسیر بدون پیشوند زبان)
  const baseHref = useMemo(() => {
    if (typeof window === "undefined") return "/";

    let path = window.location.pathname;

    // اگر مسیر با زبان فعلی شروع شده، آن را حذف می‌کنیم
    if (currentLocale !== "en" && path.startsWith(`/${currentLocale}`)) {
      path = path.substring(`/${currentLocale}`.length);
    }

    // اطمینان از اینکه مسیر ریشه همیشه "/" باشد اگر پس از حذف پیشوند خالی بود
    return path || "/";
  }, [currentLocale]);

  // 💡 نکته مهم: در حالت Static Export با Next.js، نمی‌توان از next/image استفاده کرد.
  // باید از تگ <img> استاندارد استفاده کنیم.
  const renderFlag = (lang: (typeof languageOptions)[0], size: number = 30) => {
    if (lang.type === "image") {
      return (
        <img
          src={lang.flag}
          alt={lang.name}
          width={size}
          height={size}
          className="mr-1 object-contain"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://placehold.co/30x30/f87171/0c0a09?text=Flag";
          }}
        />
      );
    }
    return <span className="text-xl mr-1">{lang.flag}</span>;
  };

  const getNewHref = (targetLocale: string) => {
    // 3. تولید مسیر نهایی با توجه به زبان جدید
    const cleanedBaseHref = baseHref === "/" ? "" : baseHref;

    if (targetLocale === "en") {
      // برای زبان پیش فرض (en)، پیشوند زبان را حذف می‌کنیم
      return cleanedBaseHref || "/";
    }

    // برای زبان‌های دیگر، پیشوند زبان را اضافه می‌کنیم
    return `/${targetLocale}${cleanedBaseHref}`;
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
                // 💥 استفاده از تگ <a> برای مسیریابی استاتیک
                <a
                  key={lang.code}
                  href={getNewHref(lang.code)}
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center w-full px-3 py-2 text-sm text-white hover:bg-amber-700"
                >
                  {renderFlag(lang)}
                  {lang.name}
                </a>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
