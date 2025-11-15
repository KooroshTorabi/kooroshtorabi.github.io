// 💥 ایمپورت نامگذاری شده از کامپوننت مشترک
import { HomePage } from "@src/components/HomePage";
import { messagesMap } from "@src/messages/index";
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
} from "next";

type PathParams = {
  lang: string;
};

// این تابع مسئول تولید مسیرهای استاتیک برای زبان‌های غیر از پیش‌فرض (fa, de) است.
export const getStaticPaths: GetStaticPaths<PathParams> = async () => {
  const supportedLocales = ["fa", "de"];

  const paths = supportedLocales.map((locale) => {
    return { params: { lang: locale } };
  });

  return {
    paths,
    fallback: false,
  };
};

// این تابع پیام‌های ترجمه شده را برای هر مسیر استاتیک بارگذاری می‌کند.
export const getStaticProps: GetStaticProps<any, PathParams> = async (
  context: GetStaticPropsContext<PathParams>,
) => {
  const locale = context.params?.lang;

  if (!locale) {
    return { notFound: true };
  }

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

// 💥 FIX: استفاده از یک تابع بسته‌بندی‌کننده (Wrapper) برای اطمینان از خروجی پیش‌فرض
export default function LangPage(props: any) {
  // رندر کردن کامپوننت اصلی با props دریافتی
  return <HomePage {...props} />;
}
