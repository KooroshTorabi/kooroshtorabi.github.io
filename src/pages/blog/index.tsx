// pages/blog/index.tsx

import languageOptions from "@lib/languageOptions";
import { getAllPosts } from "@lib/posts";
import BlogLanguageSwitcher from "@ui/BlogLanguageSwitcher";
import Header from "@ui/Header";
import type { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

// 🚩 بارگذاری پویا برای افکت شیب جدید
const DynamicTiltEffect = dynamic(() => import("@ui/TiltEffect"), {
  ssr: false,
});

// 🚩 ایمپورت فونت‌ها
import { Inter, Vazirmatn } from "next/font/google";

// 🚩 تعریف فونت‌ها
const VazirmatnFont = Vazirmatn({
  subsets: ["latin", "arabic"],
  weight: ["400", "700"],
});
const InterFont = Inter({ subsets: ["latin"] });

const DEFAULT_COVER_IMAGE = "/images/default-blog-cover.jpg";

// --- Type Definitions (با فرض اضافه شدن excerpt) ---
interface Post {
  slug: string;
  title: string;
  date: string;
  lang: string;
  coverImage?: string | null;
  excerpt?: string; // 🔑 این فیلد در posts.tsx باید اضافه شده باشد
}

interface BlogProps {
  posts: Post[];
}

// --- GetStaticProps (بدون تغییر) ---
export const getStaticProps: GetStaticProps<BlogProps> = async ({ locale }) => {
  const currentLocale = locale || "en";
  const posts = await getAllPosts();

  return {
    props: {
      posts,
      ...(await serverSideTranslations(currentLocale, ["common", "blog"])),
    },
  };
};

// --- کامپوننت صفحه بلاگ ---
const Blog: NextPage<BlogProps> = ({ posts }) => {
  const { locale } = useRouter();
  const { t: tBlog, i18n } = useTranslation("blog");
  const { t: tCommon } = useTranslation("common");

  const [selectedLang, setSelectedLang] = useState<string | null>(null);

  // 🔑 ۱. مرتب‌سازی پست‌ها (جدید به قدیم)
  // فرض می‌کنیم date یک رشته قابل مقایسه (مثل YYYY-MM-DD) است.
  const sortedPosts = useMemo(() => {
    // 💡 ایجاد یک کپی برای جلوگیری از تغییر آرایه اصلی (posts)
    return [...posts].sort((a, b) => {
      // مقایسه معکوس تاریخ‌ها برای جدیدترین به قدیمی‌ترین
      // Date.parse تاریخ‌ها را به میلی‌ثانیه تبدیل می‌کند
      return Date.parse(b.date) - Date.parse(a.date);
    });
  }, [posts]);

  // 🔑 ۲. فیلتر کردن پست‌ها
  const filteredPosts = useMemo(() => {
    if (selectedLang === null || selectedLang === "all") {
      return sortedPosts;
    }
    // 💡 فیلتر بر روی آرایه مرتب شده
    return sortedPosts.filter((p) => p.lang === selectedLang);
  }, [sortedPosts, selectedLang]); // 💡 وابستگی به sortedPosts

  // 🔑 ۳. تعیین متن عنوان بر اساس وضعیت فیلتر
  const pageTitle = useMemo(() => {
    const postCount = filteredPosts.length; // 🚩 تعداد پست‌های فیلتر شده
    if (selectedLang === null || selectedLang === "all") {
      // 💡 نمایش "All Posts" در حالت پیش‌فرض/همه
      return tBlog("allPosts", "All Posts");
    }
    // 💡 نمایش "Filtered Posts" در صورت انتخاب زبان خاص
    return tBlog("filteredPosts", "{{count}} Posts found", {
      count: postCount,
    });
  }, [selectedLang, filteredPosts.length, tBlog]);

  const currentLangInfo = languageOptions.find((l) => l.code === i18n.language);
  const pageDir = currentLangInfo?.dir || "ltr";
  const pageFontClass =
    i18n.language === "fa" ? VazirmatnFont.className : InterFont.className;

  const getReadMoreText = (contentLang: string) => {
    if (contentLang === "fa") {
      return "بیشتر بخوانید";
    }
    return tCommon("readMore", "Read more");
  };

  return (
    <div
      className={`min-h-screen bg-stone-900 text-amber-500 px-3 sm:px-5 py-5 pb-5 pt-5 ${pageFontClass}`}
      dir={pageDir}
    >
      <Header currentLang={locale} />

      {/* 🔑 اعمال عنوان داینامیک */}
      <h1 className="text-4xl font-bold mb-3 mt-6 text-center text-amber-400">
        {pageTitle}
      </h1>

      <div className="flex justify-center mb-6">
        <BlogLanguageSwitcher
          currentLang={selectedLang}
          onChange={(lang) => setSelectedLang(lang)}
        />
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {filteredPosts.map((post) => {
          const { slug, title, date, lang, coverImage, excerpt } = post;
          const langInfo = languageOptions.find((l) => l.code === lang);
          const postDir = langInfo?.dir || "ltr";
          const readMoreText = getReadMoreText(lang);

          const imageUrl = coverImage || DEFAULT_COVER_IMAGE;
          const altText = `Cover image for post: ${title}`;
          const fontClass =
            lang === "fa" ? VazirmatnFont.className : InterFont.className;

          return (
            <DynamicTiltEffect key={`${lang}-${slug}`} maxTilt={6}>
              <Link
                href={`/blog/${slug}`}
                locale={locale}
                // 💡 اصلاح: طرح‌بندی عمودی در موبایل
                className="block bg-stone-800 p-4 sm:p-6 rounded-xl shadow-lg hover:bg-stone-700 transition-all"
                dir={postDir}
              >
                {/* 🔑 اعمال md:flex-row برای اطمینان از stacking در موبایل */}
                <div className="flex flex-col md:flex-row gap-4">
                  {/* 🚩 ۱. تصویر کاور: w-full در موبایل، md:w-1/3 در دسکتاپ */}
                  <div className="w-full md:w-1/3 flex-shrink-0 rounded-lg overflow-hidden relative h-40 md:h-auto">
                    <Image
                      src={imageUrl}
                      alt={altText}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 320px" // 💡 بهینه سازی sizes
                      priority={false}
                    />
                  </div>

                  {/* 🚩 ۲. محتوای متنی */}
                  <div className={`md:w-2/3 flex-grow min-w-0 ${fontClass}`}>
                    {/* عنوان */}
                    <h2 className="text-xl sm:text-2xl font-semibold text-amber-300 mb-2">
                      {title}
                    </h2>

                    {/* 🔑 زبان و تاریخ در یک خط (با فاصله بینابینی) */}
                    <div className="flex justify-between items-center mb-3">
                      {/* تاریخ */}
                      <p className="text-sm text-amber-600 order-last md:order-first">
                        {date}
                      </p>

                      {/* زبان */}
                      <span className="text-xs bg-amber-700 text-black px-2 py-1 rounded flex items-center gap-1 order-first md:order-last">
                        {langInfo?.type === "image" ? (
                          <Image
                            src={langInfo.flag}
                            alt={langInfo.name}
                            width={16}
                            height={16}
                            className="inline-block"
                          />
                        ) : (
                          <span>{langInfo?.flag}</span>
                        )}
                        {langInfo?.name ?? lang}
                      </span>
                    </div>

                    {/* 🔑 خلاصه متن (Excerpt): برای موبایل حیاتی است */}
                    <p className="text-amber-500 mt-2 opacity-80 line-clamp-3">
                      {excerpt}
                    </p>

                    {/* لینک "بیشتر بخوانید" */}
                    <p className="text-amber-500 mt-3 font-semibold hover:underline">
                      {readMoreText} →
                    </p>
                  </div>
                </div>
              </Link>
            </DynamicTiltEffect>
          );
        })}
      </div>
    </div>
  );
};

export default Blog;
