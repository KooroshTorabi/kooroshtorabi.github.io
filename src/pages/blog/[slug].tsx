// src/pages/blog/[slug].tsx

import { messagesMap } from "@messages/index";
import { marked } from "marked";
import type { GetStaticPaths, GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import { getAllPosts, getPostBySlug } from "../../lib/posts";

interface PostProps {
  title: string;
  date: string;
  contentHtml: string;
  messages: Record<string, string>; // پیام‌های ترجمه
}

// ----------------------------------------------------
// 1. getStaticPaths
// ----------------------------------------------------
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts();

  // فقط slugها را برمی‌گردانیم
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

// ----------------------------------------------------
// 2. getStaticProps
// ----------------------------------------------------
export async function getStaticProps({
  params,
  locale = "en",
}: GetStaticPropsContext<{ slug: string }>): Promise<
  { props: PostProps } | { notFound: true }
> {
  const slug = params?.slug as string;
  const post = getPostBySlug(slug);

  if (!post) {
    return { notFound: true };
  }

  const contentHtml = await marked(post.content);

  // لود کردن پیام‌های ترجمه برای locale
  const messages = messagesMap[locale] || messagesMap["en"];

  return {
    props: {
      messages,
      title: post.title,
      date: post.date,
      contentHtml,
    },
  };
}

// ----------------------------------------------------
// 3. کامپوننت Post
// ----------------------------------------------------
export default function Post({ title, date, contentHtml }: PostProps) {
  const t = useTranslations();

  return (
    <>
      <article>
        <h1>{title}</h1>
        <small>{date}</small>
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </article>
      <br />
      <a href="/">{t("main-page")}</a>
    </>
  );
}
