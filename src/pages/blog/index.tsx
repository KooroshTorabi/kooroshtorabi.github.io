// pages/blog/index.tsx

import languageOptions from "@lib/languageOptions";
import { getAllPosts } from "@lib/posts";
import BlogLanguageSwitcher from "@ui/BlogLanguageSwitcher";
import Header from "@ui/Header";
import type { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

// --- Type Definitions (بدون تغییر) ---
interface Post {
  slug: string;
  title: string;
  date: string;
  lang: string; // زبان داخلی پست
}

interface BlogProps {
  posts: Post[];
}

// --- GetStaticProps (SSG - استفاده از Locale تزریق شده) ---
export const getStaticProps: GetStaticProps<BlogProps> = async ({ locale }) => {
  const currentLocale = locale || "en";
  const posts = getAllPosts();

  return {
    props: {
      posts,
      // بارگذاری ترجمه‌ها بر اساس زبان UI صفحه (locale)
      ...(await serverSideTranslations(currentLocale, ["common", "blog"])),
    },
  };
};

// --- کامپوننت صفحه بلاگ ---
const Blog: NextPage<BlogProps> = ({ posts }) => {
  const { locale } = useRouter(); 
  const { t, i18n } = useTranslation("blog");

  const [selectedLang, setSelectedLang] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    if (selectedLang === null || selectedLang === "all") {
      return posts;
    }
    return posts.filter((p) => p.lang === selectedLang);
  }, [posts, selectedLang]);

  // جهت‌دهی کلی صفحه (بر اساس زبان UI)
  const currentLangInfo = languageOptions.find((l) => l.code === i18n.language);
  const pageDir = currentLangInfo?.dir || "ltr"; 

  // 🚩 تابع کمکی برای ترجمه عبارت "Read More" بر اساس زبان محتوای پست
  const getReadMoreText = (contentLang: string) => {
    // اگر پست به زبان فارسی بود، رشته فارسی را برگردان
    if (contentLang === 'fa') {
      return "بیشتر بخوانید";
    }
    // در غیر این صورت، از ترجمه UI یا پیش‌فرض انگلیسی استفاده کن
    // اگرچه می‌توانستیم یک کتابخانه کامل بارگذاری کنیم، اما برای یک عبارت ساده این کافی است.
    return t("read_more", "Read more"); 
  }


  return (
    <div
      className="min-h-screen bg-stone-900 text-amber-500 px-5 py-5 pb-5 pt-5 "
      dir={pageDir}
    >
      <Header currentLang={locale} />

      <h1 className="text-4xl font-bold mb-6 text-center text-amber-400 pixelify-sans-regular">
        {t("all_posts_title", "All Posts")}
      </h1>

      <div className="flex justify-center mb-10">
        <BlogLanguageSwitcher
          currentLang={selectedLang}
          onChange={(lang) => setSelectedLang(lang)}
        />
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {filteredPosts.map(({ slug, title, date, lang }) => {
          const langInfo = languageOptions.find((l) => l.code === lang);

          const postDir = langInfo?.dir || "ltr";
          
          // 🚩 استفاده از تابع کمکی برای گرفتن متن "بیشتر بخوانید"
          const readMoreText = getReadMoreText(lang);

          return (
            <Link
              key={`${lang}-${slug}`}
              href={`/blog/${slug}`} 
              locale={locale} 
              className="block bg-stone-800 p-6 rounded-xl shadow-lg hover:bg-stone-700 transition-all"
              dir={postDir}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs bg-amber-700 text-black px-2 py-1 rounded flex items-center gap-1">
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

                <p className="text-sm text-amber-600">{date}</p>
              </div>

              <h2 className="text-2xl font-semibold text-amber-300 pixelify-sans-regular">
                {title}
              </h2>

              <p className="text-amber-500 mt-3 opacity-80">
                {readMoreText} → 
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Blog;