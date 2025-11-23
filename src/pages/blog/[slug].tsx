// pages/blog/[slug].tsx

import languageOptions from "@lib/languageOptions";
import { getAllPosts, getPostBySlug, type PostData } from "@lib/posts";
import Header from "@ui/Header";
import { marked } from "marked";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Pixelify_Sans, Vazirmatn } from "next/font/google";
import Image from "next/image"; // 🚩 Image component
import Link from "next/link";

const VazirmatnFont = Vazirmatn({ subsets: ["latin"], weight: ["400"] });
const PixlifyFont = Pixelify_Sans({ subsets: ["latin"], weight: ["400"] });

// 🚩 مسیر تصویر پیش‌فرض (باید در public/images/ باشد)
const DEFAULT_COVER_IMAGE = "/images/default-blog-cover.jpg";

// --- Type Definitions (اضافه شدن پراپ ترجمه‌ها) ---
interface PostPageProps {
  post: PostData; // فرض بر این است که شامل coverImage?: string است
  contentHtml: string;
  uiLang: string; // زبان UI (locale)
  // 🚩 ترجمه‌های دکمه‌ها بر اساس زبان محتوای پست
  contentTKeys: { backToBlog: string; mainPage: string };
}

// --- GetStaticPaths (بدون تغییر) ---
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts();
  const uiLangs = ["en", "fa", "de"];
  const uniqueSlugs = Array.from(new Set(posts.map((p) => p.slug)));

  const paths = uniqueSlugs.flatMap((slug) =>
    uiLangs.map((uiLang) => ({
      params: { slug },
      locale: uiLang,
    })),
  );

  return { paths, fallback: false };
};

// --- GetStaticProps (اصلاح شده برای بارگذاری ترجمه محتوا و رفع خطای بیلد) ---
export const getStaticProps: GetStaticProps<PostPageProps> = async ({
  params,
  locale,
}) => {
  const uiLang = locale || "en";
  const slug = params?.slug as string;

  if (!slug) return { notFound: true };

  const post = getPostBySlug(slug);
  if (!post) return { notFound: true };

  marked.setOptions({
    //... سایر تنظیمات
    breaks: true, // 👈 این گزینه خطوط جدید تکی را به <br> تبدیل می‌کند
  });
  const contentHtml: string = await marked.parse(post.content || "");
  const contentLang = post.lang || "en";
  const namespaces = ["common"];

  // 1. بارگذاری ترجمه‌های UI
  const uiTranslations = await serverSideTranslations(uiLang, namespaces);

  // 2. بارگذاری ترجمه‌های محتوا برای دکمه‌ها
  const contentTranslations = await serverSideTranslations(
    contentLang,
    namespaces,
  );

  // 🚩 دسترسی ایمن به ترجمه‌ها برای رفع خطاهای TypeScript
  const contentCommonT =
    contentTranslations._nextI18Next?.initialI18nStore?.[contentLang]?.common ||
    {};

  // 🚩 استخراج کلیدهای ترجمه مورد نیاز
  const contentTKeys = {
    backToBlog: contentCommonT.backToBlog || "Back to Blog",
    mainPage: contentCommonT.mainPage || "Main Page",
  };

  return {
    props: {
      post,
      contentHtml,
      uiLang,
      contentTKeys, // 👈 تزریق ترجمه‌های دکمه (زبان محتوا)
      ...uiTranslations, // 👈 تزریق ترجمه‌های UI (زبان رابط کاربری)
    },
  };
};

// --- کامپوننت صفحه پست ---
const PostPage: NextPage<PostPageProps> = ({
  post,
  contentHtml,
  uiLang,
  contentTKeys,
}) => {
  // t() فقط برای ترجمه سایر عناصر UI (در صورت لزوم) استفاده می‌شود
  const { t } = useTranslation("common");

  const contentLang = post.lang || "en";
  const langInfo = languageOptions.find((l) => l.code === contentLang);
  const dir = langInfo?.dir || "ltr";
  const fontClass =
    contentLang === "fa" ? VazirmatnFont.className : PixlifyFont.className;

  // 🚩 منطق تعیین تصویر کاور
  const imageUrl = post.coverImage || DEFAULT_COVER_IMAGE;
  const altText = `Cover image for post: ${post.title}`;

  return (
    <div
      className={`min-h-screen bg-stone-900 text-amber-300 px-5 py-5 ${fontClass} `}
      dir={dir}
    >
      <Header currentLang={uiLang} />

      {/* 🚩 کانتینر تصویر کاور */}

      <div className="max-w-3xl mx-auto rounded-xl overflow-hidden shadow-2xl mt-5">
        <Image
          src={imageUrl}
          alt={altText}
          // ابعاد تصویر را تنظیم کنید (مثلاً عرض 800 و ارتفاع 450 برای نسبت 16:9)
          width={100}
          height={250} // 👈 کاهش ارتفاع
          className="object-cover w-svw h-64 sm:h-80 md:h-96"
          priority={true}
        />
      </div>
      <article className="max-w-3xl mx-auto bg-stone-800 p-8 rounded-2xl shadow-lg mt-5">
        <h1 className="text-3xl md:text-4xl font-bold text-amber-400 mb-4">
          {post.title}
        </h1>
        <p className="text-sm text-amber-500 mb-8">
          {post.date} ({langInfo?.name ?? contentLang})
        </p>

        <div
          className="prose prose-invert prose-amber max-w-none prose-p:mb-8"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: محتوای مارک‌داون
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        <div className="mt-8 flex gap-4">
          <Link
            href={`/blog`}
            locale={uiLang}
            className="px-6 py-3 rounded-lg bg-stone-700 text-amber-300 font-semibold hover:bg-amber-500 hover:text-black transition"
          >
            {/* 🚩 استفاده از ترجمه تزریق شده زبان محتوا */}←{" "}
            {contentTKeys.backToBlog}
          </Link>
          <Link
            href={`/`}
            locale={uiLang}
            className="px-6 py-3 rounded-lg bg-stone-700  text-amber-300 font-semibold hover:bg-amber-500   hover:text-black transition"
          >
            {/* 🚩 استفاده از ترجمه تزریق شده زبان محتوا */}
            {contentTKeys.mainPage}
          </Link>
        </div>
      </article>
    </div>
  );
};

export default PostPage;
