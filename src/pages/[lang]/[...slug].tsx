import { messagesMap } from "@src/messages";
import LanguageSwitcher from "@ui/LanguageSwitcher"; // نیاز به دکمه تغییر زبان در همه صفحات
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
} from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";

type PathParams = {
  lang: string;
  slug: string[]; // برای مثال، ['resume'] یا ['contact']
};

// 1. تعریف تمام مسیرهای پایه موجود در برنامه (به جز صفحه اصلی /)
// فرض می‌کنیم که این‌ها صفحات دیگری هستند که نیاز به ترجمه دارند.
const PAGES = ["resume", "contact"];

export const getStaticPaths: GetStaticPaths<PathParams> = async () => {
  // زبان‌هایی که برای آن‌ها مسیر تولید می‌کنیم (غیر از 'en' که در ریشه قرار دارد)
  const supportedLocales = ["fa", "de"];
  const paths: { params: PathParams }[] = [];

  supportedLocales.forEach((locale) => {
    PAGES.forEach((page) => {
      paths.push({
        params: {
          lang: locale,
          slug: [page], // مثلاً برای /fa/resume، slug می‌شود ['resume']
        },
      });
    });
  });

  // fallback: false تضمین می‌کند که فقط مسیرهای تعریف شده در بالا بیلد شوند
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<any, PathParams> = async (
  context: GetStaticPropsContext<PathParams>,
) => {
  const locale = context.params?.lang;
  // slug[0] نام صفحه اصلی است (resume یا contact)
  const slug = context.params?.slug?.[0];

  // اگر زبان یا نام صفحه درست نبود، ۴۰۴ برگردان
  if (!locale || !slug || !PAGES.includes(slug)) {
    return { notFound: true };
  }

  // بارگذاری پیام‌ها بر اساس پارامتر زبان
  const messages = (messagesMap as Record<string, any>)[locale];

  if (!messages) {
    console.error(`Messages not found for locale: ${locale}`);
    return {
      notFound: true,
    };
  }

  // برگرداندن props شامل پیام‌ها، زبان، و نام صفحه برای استفاده در کامپوننت
  return {
    props: {
      messages,
      locale,
      slug,
    },
  };
};

// کامپوننت مشترک برای رندر کردن تمام صفحات تو در تو (Nested)
export function CatchAllPage(props: { slug: string }) {
  const t = useTranslations();
  const isRTL = t("dir") === "rtl";

  // pageKey نام صفحه فعلی است (resume یا contact)
  const pageKey = props.slug;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-stone-900 p-10 text-white"
    >
      {/* کامپوننت تغییر زبان در بالا */}
      <div
        className={`absolute top-4 w-full max-w-xs flex ${isRTL ? "justify-start left-4" : "justify-end right-4"}`}
      >
        <LanguageSwitcher />
      </div>

      <div className="max-w-4xl mx-auto py-16">
        {/* دکمه بازگشت به صفحه اصلی */}
        <Link href={isRTL ? "/fa" : "/"} legacyBehavior>
          <a className="text-amber-500 hover:text-amber-400 mb-8 inline-flex items-center">
            <span className={isRTL ? "ml-2" : "mr-2"}>{isRTL ? "→" : "←"}</span>
            {t("backToHome")}
          </a>
        </Link>

        {/* عنوان صفحه (مثلاً: Resume.title یا Contact.title) */}
        <h1
          className={`text-5xl font-bold mb-6 ${isRTL ? "text-right" : "text-left"}`}
        >
          {t(`${pageKey}.title`)}
        </h1>

        {/* توضیح صفحه (مثلاً: Resume.description) */}
        <p
          className={`text-xl text-slate-400 mb-8 ${isRTL ? "text-right" : "text-left"}`}
        >
          {t(`${pageKey}.description`)}
        </p>

        {/* --- محتوای متناسب با صفحه --- */}
        {pageKey === "resume" && (
          <div
            className={`mt-10 p-6 bg-stone-800 rounded-lg shadow-xl ${isRTL ? "text-right" : "text-left"}`}
          >
            <h2 className="text-3xl font-semibold mb-4 text-amber-500">
              {t("resume.experience")}
            </h2>
            <p className="text-slate-300">{t("resume.experienceDetails")}</p>
          </div>
        )}

        {pageKey === "contact" && (
          <div
            className={`mt-10 p-6 bg-stone-800 rounded-lg shadow-xl ${isRTL ? "text-right" : "text-left"}`}
          >
            <h2 className="text-3xl font-semibold mb-4 text-amber-500">
              {t("contact.formTitle")}
            </h2>
            <p className="text-slate-300">{t("contact.instructions")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CatchAllPage;
