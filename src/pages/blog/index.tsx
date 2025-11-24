// pages/blog/index.tsx

import languageOptions from "@lib/languageOptions";
// 💡 فرض بر این است که getAllPosts اکنون excerpt را برمی‌گرداند.
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
import { Pixelify_Sans, Vazirmatn } from "next/font/google";

// 🚩 تعریف فونت‌ها
const VazirmatnFont = Vazirmatn({
  subsets: ["latin", "arabic"],
  weight: ["400", "700"],
});
const PixlifyFont = Pixelify_Sans({ subsets: ["latin"], weight: ["400"] });

const DEFAULT_COVER_IMAGE = "/images/default-blog-cover.jpg";

// --- Type Definitions (اضافه شدن excerpt) ---
interface Post {
  slug: string;
  title: string;
  date: string;
  lang: string;
  coverImage?: string | null;
  excerpt: string; // 🔑 اضافه شدن خلاصه متن برای نمایش در لیست
}

interface BlogProps {
  posts: Post[];
}

// --- GetStaticProps (بدون تغییر) ---
export const getStaticProps: GetStaticProps<BlogProps> = async ({ locale }) => {
  const currentLocale = locale || "en";
  // 🔑 فرض بر این است که getAllPosts اکنون excerpt را هم برمی‌گرداند
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

  const filteredPosts = useMemo(() => {
    if (selectedLang === null || selectedLang === "all") {
      return posts;
    }
    return posts.filter((p) => p.lang === selectedLang);
  }, [posts, selectedLang]);

  const currentLangInfo = languageOptions.find((l) => l.code === i18n.language);
  const pageDir = currentLangInfo?.dir || "ltr";

  const getReadMoreText = (contentLang: string) => {
    if (contentLang === "fa") {
      return "بیشتر بخوانید";
    }
    return tCommon("readMore", "Read more");
  };

  return (
    <div
      // 💡 اصلاح: کاهش Padding در موبایل (px-3) و افزایش در sm:px-5
      className="min-h-screen bg-stone-900 text-amber-500 px-3 sm:px-5 py-5 pb-5 pt-5"
      dir={pageDir}
    >
      <Header currentLang={locale} />

      <h1 className="text-4xl font-bold mb-3 mt-6 text-center text-amber-400 pixelify-sans-regular">
        {tBlog("allPosts", "All Posts")}
      </h1>

      <div className="flex justify-center mb-6">
        <BlogLanguageSwitcher
          currentLang={selectedLang}
          onChange={(lang) => setSelectedLang(lang)}
        />
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {filteredPosts.map((post) => {
          const { slug, title, date, lang, coverImage, excerpt } = post; // 🔑 excerpt اضافه شد
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
                // 💡 اصلاح: طرح‌بندی انعطاف‌پذیر (عمودی در موبایل، افقی در دسکتاپ)
                className="block bg-stone-800 p-4 sm:p-6 rounded-xl shadow-lg hover:bg-stone-700 transition-all"
                dir={postDir}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* 🚩 ۱. تصویر کاور: تمام عرض در موبایل، w-1/3 در دسکتاپ */}
                  <div className="w-full sm:w-1/3 flex-shrink-0 rounded-lg overflow-hidden relative h-40 sm:h-auto">
                    <Image
                      src={imageUrl}
                      alt={altText}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 320px"
                      priority={false}
                    />
                  </div>

                  {/* 🚩 ۲. محتوای متنی */}
                  <div className={`sm:w-2/3 flex-grow min-w-0 ${fontClass}`}>
                    {/* عنوان */}
                    <h2 className="text-xl sm:text-2xl font-semibold text-amber-300 mb-2">
                      {title}
                    </h2>

                    {/* 🔑 زبان و تاریخ در یک خط (با فاصله بینابینی) */}
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-sm text-amber-600 order-last sm:order-first">
                        {date}
                      </p>

                      <span className="text-xs bg-amber-700 text-black px-2 py-1 rounded flex items-center gap-1 order-first sm:order-last">
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
