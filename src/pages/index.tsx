// src/pages/index.tsx
import ArrowRight from "@icons/arrow-right.svg";
import { messagesMap } from "@src/messages";
import Button from "@ui/Button";
import LanguageSwitcher from "@ui/LanguageSwitcher";
import { useTranslations } from "next-intl";
import { Bokor, Pixelify_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

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
  const t = useTranslations(); // 👈 دریافت ترجمه‌ها
  // برای تغییر زبان، مسیر را دوباره بارگذاری می‌کنیم
  const switchLocale = (locale: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("lng", locale); // optional query param
    window.location.href = url.toString();
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-stone-900 p-10  ${PixlifyFont.className}`}
    >
      {/* دکمه‌های تغییر زبان */}
      <div className="space-x-4">
        <h1 className="text-4xl mb-6">{t("welcome")}</h1>
        <div className="absolute top-4 right-4 w-full max-w-xs flex justify-end">
          <LanguageSwitcher />
        </div>
      </div>
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold  mb-3">
            Creative Developer & Designer
          </h1>

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
              {/* Github icon */}
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              {/* Linkedin icon */}
            </a>
            <a
              href="mailto:hello@example.com"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              {/* Mail icon */}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// getStaticProps برای next-intl
// ----------------------------------------------------
export async function getStaticProps({ locale }: { locale?: string }) {
  const messages = messagesMap[locale ?? "en"] || messagesMap["en"];

  return {
    props: {
      messages,
    },
  };
}
