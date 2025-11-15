// src/pages/blog/[slug].tsx

import { marked } from "marked";
import type { GetStaticPaths, GetStaticPropsContext } from "next"; // اضافه کردن GetStaticPropsContext
import { useTranslation } from "next-i18next"; // 👈 ایمپورت هوک ترجمه
import { serverSideTranslations } from "next-i18next/serverSideTranslations"; // 👈 ایمپورت i18n
import { getAllPosts, getPostBySlug } from "../../lib/posts";

// 👈 اضافه کردن i18n: TFunction (از next-i18next)
interface PostProps {
  title: string;
  date: string;
  contentHtml: string;
  // ویژگی‌های ترجمه برای next-i18next
  _nextI18Next?: {};
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts();

  // 👈 لیست زبان‌ها به صورت Hardcode شده برای جلوگیری از خطای CI/CD
  // const locales = ["fa", "en", "de"];

  // const paths: Array<{ params: { slug: string }; locale: string }> = [];

  // خواندن از Env Var یا استفاده از لیست پیش‌فرض
  const envLocales = process.env.NEXT_PUBLIC_LOCALES;

  // تبدیل رشته "fa,en,de" به آرایه یا استفاده از پیش‌فرض
  const locales = envLocales ? envLocales.split(",") : ["fa", "en", "de"];

  const paths: Array<{ params: { slug: string }; locale: string }> = [];

  for (const locale of locales) {
    posts.forEach((post) => {
      paths.push({
        params: { slug: post.slug },
        locale: locale,
      });
    });
  }

  return {
    paths,
    fallback: false,
  };
};

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

  // لود کردن ترجمه‌ها (common)
  const translationProps = await serverSideTranslations(locale, ["common"]);

  return {
    props: {
      ...translationProps,
      title: post.title,
      date: post.date,
      contentHtml,
    },
  };
}

// ----------------------------------------------------
// 3. کامپوننت Post: استفاده از ترجمه
// ----------------------------------------------------

export default function Post({ title, date, contentHtml }: PostProps) {
  const { t } = useTranslation("common"); // 👈 استفاده از هوک ترجمه

  return (
    <>
      <article>
        {/* شما می‌توانید عنوان و محتوای پست را نیز با توجه به زبان تغییر دهید، 
           اگرچه در اینجا از محتوای استاتیک markdown استفاده شده است. */}
        <h1>{title}</h1>
        <small>{date}</small>
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </article>
      <br />
      {/* 👈 استفاده از ترجمه برای لینک */}
      <a href="/">{t("main-page")}</a>
    </>
  );
}
