import ArrowRight from "@icons/arrow-right.svg";
// import Github from "@/assets/icons/github.svg";
// import Linkedin from "@/assets/icons/linkedin.svg";
// import Mail from "@/assets/icons/mail.svg";
import Button from "@ui/Button";
import LanguageSwitcher from "@ui/LanguageSwitcher";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Bokor, Pixelify_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router"; // برای تغییر مسیر و زبان

const BokorFont = Bokor({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bokor",
});

const PixlifyFont = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pixlify",
});

export default function HomePage() {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();

  const currentLocale = router.locale;

  const changeLanguage = (currentLng: string | undefined) => {
    const supportedLocales = ["fa", "en", "de"];
    const currentIndex = supportedLocales.indexOf(currentLng + "");
    // انتخاب زبان بعدی در لیست (و بازگشت به اول در صورت رسیدن به آخر)
    const nextIndex = (currentIndex + 1) % supportedLocales.length;
    const nextLng = supportedLocales[nextIndex];

    router.push(router.asPath, router.asPath, { locale: nextLng });
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-stone-900 p-10  ${PixlifyFont.className}`}
    >
      {/* دکمه‌های تغییر زبان */}
      <div className="space-x-4">
        <h1 className="text-4xl mb-6">{t("welcome")}</h1>
        {/* 👈 قرار دادن دراپ‌داون در بالا/کنار صفحه */}
        <div className="absolute top-4 right-4 w-full max-w-xs flex justify-end">
          <LanguageSwitcher />
        </div>
      </div>
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-5xl md:text-6xl font-bold  mb-3">
            Kourosh Torabijafroudi
          </h3>

          <p className="font-inter text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            I'm driven by curiosity and a love for problem-solving — I get
            energized turning ideas into clean, performant software that solves
            real user needs. I enjoy exploring modern tools like TypeScript and
            React, crafting thoughtful UX, and shipping projects that make an
            impact.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Link href="/resume">
              <Button className="bg-slate-900 hover:bg-slate-800">
                View Resume
                <Image src={ArrowRight} alt={""} className="ml-2 w-4 h-4" />
              </Button>
            </Link>

            <Link href="/contact">
              <Button>Get in Touch</Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              {/* <Github className="w-6 h-6" /> */}
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              {/* <Linkedin className="w-6 h-6" /> */}
            </a>
            <a
              href="mailto:hello@example.com"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              {/* <Mail className="w-6 h-6" /> */}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// 👈 تابع getServerSideProps: ضروری برای Pages Router
// این تابع در سرور اجرا می شود و فایل ترجمه مورد نیاز برای زبان فعلی را لود می کند.
export async function getServerSideProps({ locale }: { locale: string }) {
  // لود کردن فایل common.json برای زبان فعلی (locale)
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
