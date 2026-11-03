import { getAllPosts, type PostData } from "@lib/posts";
import languageOptions from "@lib/languageOptions";
import Header from "@ui/Header";
import NeonButton from "@ui/NeonButton";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { InterFont, VazirmatnFont } from "@lib/fonts";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

interface HomePageProps {
  latestPosts: PostData[];
}

export default function HomePage({ latestPosts }: HomePageProps) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const locale = router.locale;
  const isFa = locale === "fa";
  const dir = isFa ? "rtl" : "ltr";
  const fontClass = isFa ? VazirmatnFont.className : InterFont.className;

  return (
    <div
      className={`min-h-screen bg-transparent text-amber-300 ${fontClass}`}
      dir={dir}
    >
      <div className="px-3 sm:px-5 pt-4">
        <Header currentLang={locale} />
      </div>

      <main className="max-w-4xl mx-auto px-5 pt-10 sm:pt-14 pb-16 flex flex-col items-center">
        {/* 🔹 بخش معرفی (Hero) */}
        <section className="text-center">
          <div className="w-36 h-36 sm:w-40 sm:h-40 mx-auto mb-6 rounded-full border-4 border-amber-500 overflow-hidden bg-stone-700 shadow-2xl">
            <Image
              src="/images/KouroshTorabi.jpg"
              alt={t("heroTitle")}
              width={160}
              height={160}
              className="object-cover w-full h-full"
            />
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-amber-400 mb-3">
            {t("heroTitle")}
          </h1>
          <p className="text-lg sm:text-2xl text-amber-500 mb-6">
            {t("heroSubtitle")}
          </p>
          <p className="max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-amber-200/90">
            {t("heroIntro")}
          </p>
        </section>

        {/* 🔹 کارت‌های معرفی (درباره من و وبلاگ) */}
        <section className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="bg-stone-800 rounded-2xl p-8 shadow-[0_0_30px_rgba(251,191,36,0.18)] ring-1 ring-amber-300/10">
            <h2 className="text-2xl font-semibold text-amber-400 mb-3">
              {t("aboutCardTitle")}
            </h2>
            <p className="text-amber-300/90 leading-relaxed mb-6">
              {t("aboutCardText")}
            </p>
            <NeonButton
              href="/about"
              locale={locale}
              className="bg-stone-700 text-amber-300 hover:bg-amber-500 hover:text-black"
            >
              {t("aboutButton")}
            </NeonButton>
          </div>

          <div className="bg-stone-800 rounded-2xl p-8 shadow-[0_0_30px_rgba(251,191,36,0.18)] ring-1 ring-amber-300/10">
            <h2 className="text-2xl font-semibold text-amber-400 mb-3">
              {t("blogCardTitle")}
            </h2>
            <p className="text-amber-300/90 leading-relaxed mb-6">
              {t("blogCardText")}
            </p>
            <NeonButton
              href="/blog"
              locale={locale}
              className="bg-stone-700 text-amber-300 hover:bg-amber-500 hover:text-black"
            >
              {t("blogButton")}
            </NeonButton>
          </div>
        </section>

        {/* 🔹 آخرین نوشته‌ها */}
        {latestPosts.length > 0 && (
          <section className="mt-16 w-full">
            <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 mb-6 text-center">
              {t("latestPosts")}
            </h2>
            <div className="space-y-4">
              {latestPosts.map((post) => {
                const langInfo = languageOptions.find(
                  (l) => l.code === post.lang,
                );
                const postDir = langInfo?.dir || "ltr";
                const postFont =
                  post.lang === "fa"
                    ? VazirmatnFont.className
                    : InterFont.className;
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    locale={locale}
                    dir={postDir}
                    className={`block bg-stone-800 rounded-xl p-5 shadow-[0_0_30px_rgba(251,191,36,0.18)] ring-1 ring-amber-300/10 hover:bg-stone-700 transition ${postFont}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-amber-300">
                        {post.title}
                      </h3>
                      <span className="text-sm text-amber-600 whitespace-nowrap">
                        {post.date}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-8 text-center">
              <NeonButton
                href="/blog"
                locale={locale}
                className="bg-stone-700 text-amber-300 hover:bg-amber-500 hover:text-black"
              >
                {t("viewAllPosts")}
              </NeonButton>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  const posts = await getAllPosts();
  const latestPosts = posts.slice(0, 3);

  return {
    props: {
      latestPosts,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
