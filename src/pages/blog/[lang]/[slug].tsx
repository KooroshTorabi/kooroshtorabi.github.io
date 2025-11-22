// pages/blog/[lang]/[slug].tsx

import Header from "@ui/Header";
import { marked } from "marked";
import type { GetStaticPaths, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Pixelify_Sans, Vazirmatn } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getAllPosts, getPostBySlug } from "../../../lib/posts";

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

interface PostProps {
  title: string;
  date: string;
  contentHtml: string;
  lang: string;
}

export const getStaticProps: GetStaticProps<PostProps> = async ({ params }) => {
  const lang = params?.lang as string;
  const slug = params?.slug as string;

  if (!lang || !slug) return { notFound: true };

  const post = getPostBySlug(lang, slug);
  if (!post) return { notFound: true };

  const contentHtml = await marked(post.content);

  return {
    props: {
      title: post.title,
      date: post.date,
      contentHtml,
      lang,
      ...(await serverSideTranslations(lang, ["common"])), // اضافه کردن ترجمه‌ها
    },
  };
};
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts();
  const paths = posts.map((post) => ({
    params: { lang: post.lang, slug: post.slug },
  }));

  return { paths, fallback: "blocking" };
};

export default function Post({
  title,
  date,
  contentHtml,
  lang: postLang,
}: PostProps) {
  const { t, i18n } = useTranslation("common");

  const router = useRouter();
  const fromLang = router.query.fromLang as string | undefined; // زبان انتخابی قبلی در بلاگ

  const dir = postLang === "fa" ? "rtl" : "ltr";
  const fontClass =
    postLang === "fa" ? VazirmatnFont.className : PixlifyFont.className;

  useEffect(() => {
    if (postLang && i18n.language !== postLang) {
      i18n.changeLanguage(postLang);
    }
  }, [postLang, i18n]);

  return (
    <div
      className={`min-h-screen  ${fontClass} bg-stone-900 text-amber-300 px-5 py-5 pb-5 pt-5`}
      dir={dir}
    >
      <Header currentLang={postLang} />

      {/* Post Container */}
      <article className="max-w-3xl mx-auto bg-stone-800 p-8 rounded-2xl shadow-lg mt-5">
        <h1 className="text-3xl md:text-4xl font-bold text-amber-400 mb-4 pixelify-sans-regular">
          {title}
        </h1>

        <p className="text-sm text-amber-500 mb-8">{date}</p>

        <div
          className="prose prose-invert prose-amber max-w-none"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>

      {/* Buttons */}
      <div className="max-w-3xl mx-auto flex justify-center gap-6 mt-12">
        <Link
          href={{
            pathname: "/blog",
            query: { lang: fromLang || postLang }, // برگشت به زبان قبلی یا زبان پست
          }}
          className="px-6 py-3 rounded-lg bg-stone-800 text-amber-300 font-semibold hover:bg-stone-700 transition"
        >
          ⬅ Back to Blog
        </Link>

        <Link
          href="/"
          className="px-6 py-3 rounded-lg bg-amber-600 text-black font-semibold hover:bg-amber-500 transition"
        >
          Main Page
        </Link>
      </div>
    </div>
  );
}
