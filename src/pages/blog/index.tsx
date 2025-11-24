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
  // مطمئن شوید مسیر @ui/TiltEffect صحیح است
  ssr: false,
});

// 🚩 ایمپورت فونت‌ها
import { Pixelify_Sans, Vazirmatn } from "next/font/google"; // اضافه شد

// 🚩 تعریف فونت‌ها
const VazirmatnFont = Vazirmatn({
  subsets: ["latin", "arabic"],
  weight: ["400", "700"],
});
const PixlifyFont = Pixelify_Sans({ subsets: ["latin"], weight: ["400"] });

const DEFAULT_COVER_IMAGE = "/images/default-blog-cover.jpg";

// --- Type Definitions ---
interface Post {
  slug: string;
  title: string;
  date: string;
  lang: string;
  coverImage?: string | null; // ✅ اختیاری
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
  const { t: tCommon } = useTranslation("common"); // استفاده برای کلیدهای عمومی

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
    if (contentLang === "fa") {
      return "بیشتر بخوانید";
    }
    // ✅ اصلاح شد: استفاده از کلید "readMore"
    return tCommon("readMore", "Read more");
  };

  return (
    <div
      className="min-h-screen bg-stone-900 text-amber-500 px-5 py-5 pb-5 pt-5 "
      dir={pageDir}
    >
      <Header currentLang={locale} />

      <h1 className="text-4xl font-bold mb-6 text-center text-amber-400 pixelify-sans-regular">
        {tBlog("allPosts", "All Posts")}
      </h1>

      <div className="flex justify-center mb-10">
        <BlogLanguageSwitcher
          currentLang={selectedLang}
          onChange={(lang) => setSelectedLang(lang)}
        />
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {filteredPosts.map((post) => {
          const { slug, title, date, lang, coverImage } = post;
          const langInfo = languageOptions.find((l) => l.code === lang);
          const postDir = langInfo?.dir || "ltr";
          const readMoreText = getReadMoreText(lang);

          const imageUrl = coverImage || DEFAULT_COVER_IMAGE;
          const altText = `Cover image for post: ${title}`;
          const fontClass =
            lang === "fa" ? VazirmatnFont.className : PixlifyFont.className;
          return (
            <DynamicTiltEffect key={`${lang}-${slug}`} maxTilt={6}>
              <Link
                href={`/blog/${slug}`}
                locale={locale}
                className="block bg-stone-800 p-6 rounded-xl shadow-lg hover:bg-stone-700 transition-all flex items-center space-x-4 rtl:space-x-reverse"
                dir={postDir}
              >
                {/* 🚩 کانتینر تصویر */}
                <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden relative">
                  <Image
                    src={imageUrl}
                    alt={altText}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 320px"
                    priority={false}
                  />
                </div>

                {/* 🚩 محتوای متنی */}
                <div className={`flex-grow min-w-0 m-3 ${fontClass}`}>
                  <div className="flex justify-between items-start mb-2">
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
                  <h2 className="text-xl sm:text-2xl font-semibold text-amber-300 truncate">
                    {title}
                  </h2>
                  <p className="text-amber-500 mt-3 opacity-80">
                    {readMoreText} →
                  </p>
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
