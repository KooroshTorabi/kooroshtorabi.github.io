// pages/about.tsx

import Header from "@ui/Header";
import NeonButton from "@ui/NeonButton";
import type { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import { Inter, Vazirmatn } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/router";

// بارگذاری پویا برای افکت شیب (Tilt Effect)
const DynamicTiltEffect = dynamic(() => import("@ui/TiltEffect"), {
  ssr: false,
});

// تعریف فونت‌ها
const VazirmatnFont = Vazirmatn({
  subsets: ["latin", "arabic"],
  weight: ["400", "700"],
});
const InterFont = Inter({ subsets: ["latin"] });

// --- GetStaticProps (برای بارگذاری ترجمه) ---
export const getStaticProps = async ({ locale }: { locale: string }) => {
  const currentLocale = locale || "en";
  return {
    props: {
      ...(await serverSideTranslations(currentLocale, ["common", "about"])),
    },
  };
};

// --- Type Helpers برای خواندن آرایه‌ها از JSON ---
type ExperienceItem = {
  title: string;
  company: string;
  duration: string;
  description: string;
};

// 💡 نوع جدید برای دسته‌بندی مهارت‌ها
type SkillCategory = {
  category: string;
  tools: string[];
};

// --- کامپوننت صفحه ---
const AboutPage: NextPage = () => {
  const { locale } = useRouter();
  const { t, i18n } = useTranslation("about");

  // انتخاب کلاس فونت بر اساس زبان فعلی UI
  const isFa = i18n.language === "fa";
  const fontClass = isFa ? VazirmatnFont.className : InterFont.className;
  const pageDir = isFa ? "rtl" : "ltr";

  // داده‌های اصلی: 💡 استفاده از returnObjects: true برای آبجکت‌ها و آرایه‌ها
  const contact = t("contact", { returnObjects: true }) as any;
  const social = t("social", { returnObjects: true }) as any;

  // 💡 خواندن ساختار جدید مهارت‌ها
  const skillsData = t("section_skills", {
    returnObjects: true,
  }) as SkillCategory[];

  const experienceData = t("experience", {
    returnObjects: true,
  }) as ExperienceItem[];
  const educationData = t("education", { returnObjects: true }) as string[];

  return (
    <div
      className={`min-h-screen bg-stone-900 text-amber-300 px-5 py-5 ${fontClass}`}
      dir={pageDir}
    >
      <Header currentLang={locale} />

      <main className="max-w-3xl mx-auto mt-10">
        <h1 className="text-4xl font-bold mb-8 text-center text-amber-400">
          {t("title", "About Me / Resume")}
        </h1>

        {/* 1. بخش معرفی و اطلاعات تماس */}
        <section className="bg-stone-800 p-8 rounded-2xl shadow-lg mb-8">
          <div className="flex flex-col items-center justify-center text-center">
            {/* 🚩 محل قرارگیری عکس (Photo Placeholder) */}
            <div className="w-32 h-32 mb-4 rounded-full border-4 border-amber-500 overflow-hidden bg-stone-700 flex items-center justify-center shadow-2xl relative">
              {/* ⚠️ اینجا می‌توانید Image خود را قرار دهید */}
              <Image
                src="/images/KouroshTorabi.jpg"
                alt="Kourosh Torabi"
                width={128}
                height={128}
              ></Image>
              {/* <span className="text-6xl text-amber-600">👤</span> */}
            </div>

            <h2 className="text-3xl font-bold mb-1 text-amber-400">
              {contact.name || "Kourosh Torabijafroudi"}
            </h2>
            <p className="text-amber-500 mb-4">{contact.address}</p>

            <br></br>
            <br></br>

            {/* لینک‌های اجتماعی با NeonButton */}
            <div className="flex gap-4">
              {social.github_url && (
                <NeonButton
                  href={social.github_url}
                  locale={locale}
                  className="bg-stone-700 text-amber-300 hover:bg-amber-500 hover:text-black"
                >
                  🛠️ GitHub
                </NeonButton>
              )}
              {social.linkedin_url && (
                <NeonButton
                  href={social.linkedin_url}
                  locale={locale}
                  className="bg-stone-700 text-amber-300 hover:bg-amber-500 hover:text-black"
                >
                  👔 LinkedIn
                </NeonButton>
              )}
            </div>
          </div>
        </section>

        {/* 2. خلاصه‌ی حرفه‌ای (Professional Summary) */}
        <DynamicTiltEffect maxTilt={1}>
          <section className="bg-stone-800 p-8 rounded-2xl shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-amber-500">
              {t("section_about_title", "Professional Summary")}
            </h2>
            <p className="text-lg leading-relaxed mb-4">
              {t("section_about_p1")}
            </p>
            <p className="text-lg leading-relaxed">{t("section_about_p2")}</p>
          </section>
        </DynamicTiltEffect>

        {/* 3. دانش و مهارت‌ها (Skills) - ساختار دسته‌بندی شده جدید */}
        <section className="bg-stone-700 p-6 rounded-2xl shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-amber-500">
            {t("section_skills_title", "Knowledge and Skills")}
          </h2>
          {/* Loop through categories */}
          {Array.isArray(skillsData) &&
            skillsData.map((skillCat, index) => (
              <div
                key={index.toString()}
                className="mb-5 last:mb-0 border-b border-stone-600/50 pb-4"
              >
                <h3 className="text-xl font-bold mb-2 text-amber-400">
                  {skillCat.category}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {/* Loop through tools in each category */}
                  {Array.isArray(skillCat.tools) &&
                    skillCat.tools.map((tool, toolIndex) => (
                      <span
                        key={toolIndex.toString()}
                        className="bg-amber-500 text-stone-900 text-sm font-medium px-3 py-1 rounded-full hover:scale-105 transition shadow-md"
                      >
                        {tool}
                      </span>
                    ))}
                </div>
              </div>
            ))}
        </section>

        {/* 4. تجربه‌ی حرفه‌ای (Experience) */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold mb-4 text-amber-400">
            {t("section_experience_title", "Professional Experience")}
          </h2>
          {/* ✅ بررسی آرایه قبل از MAP برای رفع خطا */}
          {Array.isArray(experienceData) &&
            experienceData.map((item, index) => (
              <DynamicTiltEffect key={index.toString()} maxTilt={2}>
                <div className="bg-stone-800 p-6 rounded-xl shadow-lg mb-4 hover:bg-stone-700 transition">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-amber-300">
                      {item.title}
                    </h3>
                    <span className="text-sm text-amber-600 font-medium">
                      {item.duration}
                    </span>
                  </div>
                  <p className="text-amber-500 mb-2 italic">{item.company}</p>
                  <p className="text-amber-300 opacity-90 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </DynamicTiltEffect>
            ))}
        </section>

        {/* 5. تحصیلات و زبان‌ها (Education & Languages) */}
        <section className="mb-8 p-6 bg-stone-800 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-amber-500">
            {t("section_education_title", "Education")}
          </h2>
          <ul className="list-disc list-inside space-y-2 mb-6">
            {/* ✅ بررسی آرایه قبل از MAP برای رفع خطا */}
            {Array.isArray(educationData) &&
              educationData.map((item, index) => (
                <li
                  key={index.toString()}
                  className="text-lg text-amber-300 opacity-90"
                >
                  {item}
                </li>
              ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
