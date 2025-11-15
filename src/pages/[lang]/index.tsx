import { HomePage } from "@src/components/HomePage";
import { messagesMap } from "@src/messages";
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
} from "next";

type PathParams = {
  lang: string;
};

/**
 * Next.js را مطلع می‌کند که کدام زبان‌ها باید به صورت استاتیک تولید شوند.
 */
export const getStaticPaths: GetStaticPaths<PathParams> = async () => {
  // ما فقط 'fa' و 'de' را در نظر می‌گیریم. Next.js مسیر پیش‌فرض '/' را به عنوان 'en' در نظر می‌گیرد.
  const supportedLocales = ["fa", "de"];
  const paths = supportedLocales.map((lang) => ({
    params: { lang },
  }));

  return {
    paths,
    fallback: false,
  };
};

/**
 * پیام‌های ترجمه را برای هر مسیر زبان (locale) در زمان Build بارگذاری می‌کند.
 * این پیام‌ها به عنوان 'messages' به HomePage ارسال می‌شوند.
 */
export const getStaticProps: GetStaticProps<any, PathParams> = async (
  context: GetStaticPropsContext<PathParams>,
) => {
  const locale = context.params?.lang;

  if (!locale) {
    return { notFound: true };
  }

  // پیام‌های ترجمه شده از messagesMap را بارگذاری می‌کند.
  const messages = (messagesMap as Record<string, any>)[locale];

  if (!messages) {
    console.error(`Messages not found for locale: ${locale}`);
    return {
      notFound: true,
    };
  }

  return {
    props: {
      messages,
      locale,
    },
  };
};

// از آنجا که HomePage کامپوننت اصلی برای این مسیر است، آن را به عنوان دیفالت صادر می‌کنیم.
export default HomePage;
