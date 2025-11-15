// 💥 ایمپورت نامگذاری شده از کامپوننت مشترک
import { HomePage } from "@src/components/HomePage";
import { messagesMap } from "@src/messages/index";
import type { GetStaticProps } from "next";

// 💥 FIX: استفاده از یک تابع بسته‌بندی‌کننده (Wrapper) برای اطمینان از خروجی پیش‌فرض
export default function IndexPage(props: any) {
  // رندر کردن کامپوننت اصلی با props دریافتی
  return <HomePage {...props} />;
}

// این getStaticProps همیشه locale "en" را برمی‌گرداند.
export const getStaticProps: GetStaticProps = async () => {
  const locale = "en";
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
