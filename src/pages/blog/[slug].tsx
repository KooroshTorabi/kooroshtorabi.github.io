// pages/blog/[slug].tsx

import languageOptions from "@lib/languageOptions";
// 💡 توجه: getAllPosts و getPostBySlug اکنون async هستند
import { getAllPosts, getPostBySlug, type PostData } from "@lib/posts"; 
import NeonButton from "@src/components/ui/NeonButton";
import Header from "@ui/Header";

// 💡 ماژول‌های Unified جایگزین marked می‌شوند
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm"; // 👈 پشتیبانی از جداول، تسک لیست‌ها و لینک‌های خودکار

import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import { Pixelify_Sans, Vazirmatn } from "next/font/google";
import Link from "next/link";
import Image from "next/image"; // برای استفاده صحیح از Image

// 🚩 بارگذاری پویا برای جلوگیری از رندر SSR
const DynamicTileEffect = dynamic(() => import("@ui/TileEffect"), {
  ssr: false, 
  loading: () => (
    <div className="h-64 sm:h-80 md:h-96 bg-stone-700 animate-pulse" />
  ),
});

// 🚩 بارگذاری پویا برای افکت موج جدید
const DynamicWaveEffect = dynamic(() => import("@ui/WaveEffect"), {
  ssr: false,
  loading: () => (
    <div className="h-64 sm:h-80 md:h-96 bg-stone-700 animate-pulse" />
  ),
});

const VazirmatnFont = Vazirmatn({ subsets: ["latin"], weight: ["400"] });
const PixlifyFont = Pixelify_Sans({ subsets: ["latin"], weight: ["400"] });

// 🚩 مسیر تصویر پیش‌فرض 
const DEFAULT_COVER_IMAGE = "/images/default-blog-cover.jpg";

// --- Type Definitions (اضافه شدن پراپ ترجمه‌ها) ---
interface PostPageProps {
  post: PostData; 
  contentHtml: string;
  uiLang: string; 
  contentTKeys: { backToBlog: string; mainPage: string };
}

// 🆕 تابع تبدیل Markdown به HTML با Unified (به جای marked)
async function processMarkdown(markdown: string): Promise<string> {
    const file = await unified()
        .use(remarkParse)
        .use(remarkGfm) // 👈 پشتیبانی از جداول و سینتکس GitHub
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeSanitize) // ایمن‌سازی محتوای HTML تولید شده
        .use(rehypeStringify)
        .process(markdown);
    
    return String(file);
}


// --- GetStaticPaths (تصحیح شده) ---
export const getStaticPaths: GetStaticPaths = async () => {
  // 🔑 تصحیح: استفاده از await برای حل Promise
  const posts = await getAllPosts(); 
  
  const uiLangs = ["en", "fa", "de"];
  // 💥 اکنون posts یک آرایه واقعی است و map کار می‌کند
  const uniqueSlugs = Array.from(new Set(posts.map((p) => p.slug)));

  const paths = uniqueSlugs.flatMap((slug) =>
    uiLangs.map((uiLang) => ({
      params: { slug },
      locale: uiLang,
    })),
  );

  return { paths, fallback: false };
};


// --- GetStaticProps (اصلاح شده) ---
export const getStaticProps: GetStaticProps<PostPageProps> = async ({
  params,
  locale,
}) => {
  const uiLang = locale || "en";
  const slug = params?.slug as string;

  if (!slug) return { notFound: true };
  
  // 🔑 تصحیح: استفاده از await برای حل Promise
  const post = await getPostBySlug(slug);
  if (!post) return { notFound: true };
  
  // 💡 تبدیل Markdown به HTML با Unified (برای جداول)
  const contentHtml: string = await processMarkdown(post.content || "");
  
  const contentLang = post.lang || "en";
  const namespaces = ["common"];

  // 1. بارگذاری ترجمه‌های UI
  const uiTranslations = await serverSideTranslations(uiLang, namespaces);

  // 2. بارگذاری ترجمه‌های محتوا برای دکمه‌ها
  const contentTranslations = await serverSideTranslations(
    contentLang,
    namespaces,
  );

  // 🚩 دسترسی ایمن به ترجمه‌ها 
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
      contentHtml, // 👈 محتوای HTML تبدیل شده توسط Unified
      uiLang,
      contentTKeys, 
      ...uiTranslations, 
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

  return (
    <div
      className={`min-h-screen bg-stone-900 text-amber-300 px-5 py-5 ${fontClass} `}
      dir={dir}
    >
      <Header currentLang={uiLang} />

      {/* 🚩 کانتینر تصویر کاور */}
      <div className="max-w-3xl mx-auto rounded-xl overflow-hidden shadow-2xl mt-5">
        <div className="w-full h-64 sm:h-80 md:h-96">
          {/* ✅ استفاده از DynamicWaveEffect */}
          <DynamicWaveEffect imageUrl={imageUrl} />
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto mt-5">
        <article className="max-w-3xl mx-auto bg-stone-800 p-8 rounded-2xl shadow-lg mt-5">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-400 mb-4">
            {post.title}
          </h1>
          <p className="text-sm text-amber-500 mb-8">
            {post.date} ({langInfo?.name ?? contentLang})
          </p>

          <div
            className="prose prose-invert prose-amber max-w-none prose-p:mb-18"
            
            // ⚠️ اینجا باید از محتوای HTML تولید شده استفاده کنید
            dangerouslySetInnerHTML={{ __html: contentHtml }} 
          />

          <div className="mt-8 flex gap-4">
            <NeonButton
              href={`/blog`}
              locale={uiLang}
              className="px-6 py-3 rounded-lg bg-stone-700 text-amber-300 font-semibold hover:bg-amber-500 hover:text-black transition"
            >
              ← {contentTKeys.backToBlog}
            </NeonButton>

            <Link
              href={`/`}
              locale={uiLang}
              className="px-6 py-3 rounded-lg bg-stone-700  text-amber-300 font-semibold hover:bg-amber-500   hover:text-black transition"
            >
              {contentTKeys.mainPage}
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PostPage;