// pages/blog/[slug].tsx

import languageOptions from "@lib/languageOptions";
import { getAllPosts, getPostBySlug, type PostData } from "@lib/posts";
import NeonButton from "@src/components/ui/NeonButton";
import Header from "@ui/Header";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import { Pixelify_Sans, Vazirmatn } from "next/font/google";
import Link from "next/link";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

// 🚩 بارگذاری پویا برای افکت موج جدید
const DynamicWaveEffect = dynamic(() => import("@ui/WaveEffect"), {
  ssr: false,
  loading: () => (
    // 💡 کاهش ارتفاع در موبایل
    <div className="w-full h-48 sm:h-80 md:h-96 bg-stone-700 animate-pulse" />
  ),
});

const VazirmatnFont = Vazirmatn({ subsets: ["latin"], weight: ["400"] });
const PixlifyFont = Pixelify_Sans({ subsets: ["latin"], weight: ["400"] });

const DEFAULT_COVER_IMAGE = "/images/default-blog-cover.jpg";

// --- Type Definitions ---
interface PostPageProps {
  post: PostData;
  contentHtml: string;
  uiLang: string;
  contentTKeys: { backToBlog: string; mainPage: string };
}

async function processMarkdown(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}

// --- GetStaticPaths (تصحیح شده) ---
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts();
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

// --- GetStaticProps (تصحیح شده) ---
export const getStaticProps: GetStaticProps<PostPageProps> = async ({
  params,
  locale,
}) => {
  const uiLang = locale || "en";
  const slug = params?.slug as string;

  if (!slug) return { notFound: true };

  const post = await getPostBySlug(slug);
  if (!post) return { notFound: true };

  const contentHtml: string = await processMarkdown(post.content || "");

  const contentLang = post.lang || "en";
  const namespaces = ["common"];

  const uiTranslations = await serverSideTranslations(uiLang, namespaces);
  const contentTranslations = await serverSideTranslations(
    contentLang,
    namespaces,
  );

  const contentCommonT =
    contentTranslations._nextI18Next?.initialI18nStore?.[contentLang]?.common ||
    {};

  const contentTKeys = {
    backToBlog: contentCommonT.backToBlog || "Back to Blog",
    mainPage: contentCommonT.mainPage || "Main Page",
  };

  return {
    props: {
      post,
      contentHtml,
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
  const { t } = useTranslation("common");

  const contentLang = post.lang || "en";
  const langInfo = languageOptions.find((l) => l.code === contentLang);
  const dir = langInfo?.dir || "ltr";
  const fontClass =
    contentLang === "fa" ? VazirmatnFont.className : PixlifyFont.className;

  const imageUrl = post.coverImage || DEFAULT_COVER_IMAGE;

  return (
    <div
      // 💡 اصلاح Mobile: کاهش Padding در موبایل
      className={`min-h-screen bg-stone-900 text-amber-300 px-3 sm:px-5 py-5 ${fontClass} `}
      dir={dir}
    >
      <Header currentLang={uiLang} />

      {/* 🚩 کانتینر تصویر کاور */}
      <div className="max-w-3xl mx-auto rounded-xl overflow-hidden shadow-2xl mt-5">
        <div
          // 💡 اصلاح Mobile: کاهش ارتفاع در موبایل
          className="w-full h-48 sm:h-80 md:h-96"
        >
          <DynamicWaveEffect imageUrl={imageUrl} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-5">
        <article
          // 💡 اصلاح Mobile: کاهش Padding در موبایل
          className="max-w-3xl mx-auto bg-stone-800 p-4 sm:p-8 rounded-2xl shadow-lg mt-5"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-amber-400 mb-4">
            {post.title}
          </h1>
          <p className="text-sm text-amber-500 mb-8">
            {post.date} ({langInfo?.name ?? contentLang})
          </p>

          <div
            className="prose prose-invert prose-amber max-w-none prose-p:mb-8"
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
