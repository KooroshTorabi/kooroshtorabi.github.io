// pages/blog/[slug].tsx

import languageOptions from "@lib/languageOptions";
import { getAllPosts, getPostBySlug, type PostData } from "@lib/posts";
import Header from "@ui/Header";
import { marked } from "marked";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Pixelify_Sans, Vazirmatn } from "next/font/google";
import Link from "next/link";

const VazirmatnFont = Vazirmatn({ subsets: ["latin"], weight: ["400"] });
const PixlifyFont = Pixelify_Sans({ subsets: ["latin"], weight: ["400"] });

// --- Type Definitions ---
interface PostPageProps {
  post: PostData;
  contentHtml: string;
  uiLang: string; // زبان UI (locale)
}

// --- GetStaticPaths (تولید مسیرها) ---
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts();

  // زبان‌های UI که در next.config.js تعریف شده‌اند
  const uiLangs = ["en", "fa", "de"];

  // استخراج اسلاگ‌های منحصر به فرد
  const uniqueSlugs = Array.from(new Set(posts.map((p) => p.slug)));

  // تولید یک مسیر برای هر اسلاگ به ازای هر زبان UI
  const paths = uniqueSlugs.flatMap((slug) =>
    uiLangs.map((uiLang) => ({
      params: { slug }, // پارامتر پویا
      locale: uiLang, // زبان UI (Locale)
    })),
  );

  return { paths, fallback: false };
};

// --- GetStaticProps (بارگذاری داده‌ها و ترجمه‌ها) ---
export const getStaticProps: GetStaticProps<PostPageProps> = async ({
  params,
  locale, // 👈 زبان UI به‌طور خودکار از آدرس گرفته می‌شود
}) => {
  const uiLang = locale || "en";
  const slug = params?.slug as string;

  if (!slug) return { notFound: true };

  // پست را بر اساس اسلاگ پیدا می‌کنیم
  const post = getPostBySlug(slug);
  if (!post) return { notFound: true };

  const contentHtml: string = await marked.parse(post.content || "");

  return {
    props: {
      post,
      contentHtml,
      uiLang,
      // بارگذاری فایل‌های ترجمه (common) برای زبان UI فعلی (uiLang)
      ...(await serverSideTranslations(uiLang, ["common"])),
    },
  };
};

// --- کامپوننت صفحه پست ---
const PostPage: NextPage<PostPageProps> = ({ post, contentHtml, uiLang }) => {
  // استفاده از زبان UI (uiLang) برای ترجمه عناصر UI
  const { t } = useTranslation("common");

  // تعیین جهت‌دهی (dir) و فونت بر اساس زبان محتوای پست (post.lang)
  const contentLang = post.lang || "en";
  const langInfo = languageOptions.find((l) => l.code === contentLang);
  const dir = langInfo?.dir || "ltr";
  const fontClass =
    contentLang === "fa" ? VazirmatnFont.className : PixlifyFont.className;

  return (
    <div
      className={`min-h-screen bg-stone-900 text-amber-300 px-5 py-5 ${fontClass}`}
      dir={dir}
    >
      {/* Header: از uiLang به عنوان زبان فعلی استفاده می‌شود */}
      <Header currentLang={uiLang} />

      <article className="max-w-3xl mx-auto bg-stone-800 p-8 rounded-2xl shadow-lg mt-5">
        <h1 className="text-3xl md:text-4xl font-bold text-amber-400 mb-4">
          {post.title}
        </h1>
        <p className="text-sm text-amber-500 mb-8">
          {post.date} ({langInfo?.name ?? contentLang})
        </p>

        <div
          className="prose prose-invert prose-amber max-w-none"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: محتوای مارک‌داون
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        <div className="mt-8 flex gap-4">
          <Link
            // بازگشت به فهرست بلاگ (مثلاً /fa/blog)
            href={`/blog`}
            locale={uiLang}
            className="px-6 py-3 rounded-lg bg-stone-700 text-amber-300 font-semibold hover:bg-amber-500 hover:text-black transition"
          >
            ← {t("backToBlog", { lng: contentLang })}
          </Link>
          <Link
            // بازگشت به صفحه اصلی (مثلاً /fa)
            href={`/`}
            locale={uiLang}
            className="px-6 py-3 rounded-lg bg-stone-700  text-amber-300 font-semibold hover:bg-amber-500   hover:text-black transition"
          >
            {t("mainPage", { lng: contentLang })}
          </Link>
        </div>
      </article>
    </div>
  );
};

export default PostPage;
