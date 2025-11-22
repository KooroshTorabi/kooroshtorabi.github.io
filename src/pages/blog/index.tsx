import languageOptions from "@lib/languageOptions";
import BlogLanguageSwitcher from "@ui/BlogLanguageSwitcher";
import Header from "@ui/Header";
import type { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getAllPosts } from "../../lib/posts";

interface Post {
  slug: string;
  title: string;
  date: string;
  lang: string;
}

interface BlogProps {
  posts: Post[];
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const posts = getAllPosts();
  return {
    props: {
      posts,
      ...(await serverSideTranslations(locale || "en", ["common"])), // 👈 این خط مهمه
    },
  };
};
export default function Blog({ posts }: BlogProps) {
  const [selectedLang, setSelectedLang] = useState<string | null>(null); // null = All

  const filteredPosts =
    selectedLang === null
      ? posts
      : posts.filter((p) => p.lang === selectedLang);

  const dir =
    selectedLang && selectedLang !== "all"
      ? languageOptions.find((l) => l.code === selectedLang)?.dir || "ltr"
      : "ltr";

  return (
    <div
      className="min-h-screen bg-stone-900 text-amber-500 px-5 py-5 pb-5 pt-5 "
      dir={dir}
    >
      <Header currentLang={selectedLang ?? "all"} />

      <h1 className="text-4xl font-bold mb-6 text-center text-amber-400 pixelify-sans-regular">
        All Posts
      </h1>

      <div className="flex justify-center mb-10">
        <BlogLanguageSwitcher
          currentLang={selectedLang}
          onChange={(lang) => setSelectedLang(lang)}
        />
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {filteredPosts.map(({ slug, title, date, lang }) => {
          const langInfo = languageOptions.find((l) => l.code === lang);
          return (
            <Link
              key={`${lang}-${slug}`}
              href={{
                pathname: `/blog/${lang}/${slug}`,
                query: { blogLang: selectedLang ?? "all" },
              }}
              className="block bg-stone-800 p-6 rounded-xl shadow-lg hover:bg-stone-700 transition-all"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs bg-amber-700 text-black px-2 py-1 rounded flex items-center gap-1">
                  {langInfo?.type === "image" ? (
                    <Image
                      src={langInfo.flag}
                      alt={langInfo.name}
                      width={16}
                      height={16}
                      className="inline-block"
                    />
                  ) : (
                    <span>{langInfo?.flag}</span>
                  )}
                  {langInfo?.name ?? lang}
                </span>

                <p className="text-sm text-amber-600">{date}</p>
              </div>

              <h2 className="text-2xl font-semibold text-amber-300 pixelify-sans-regular">
                {title}
              </h2>

              <p className="text-amber-500 mt-3 opacity-80">Read more →</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
