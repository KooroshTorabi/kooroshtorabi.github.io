import ArrowRight from "@icons/arrow-right.svg";
// import Github from "@/assets/icons/github.svg";
// import Linkedin from "@/assets/icons/linkedin.svg";
// import Mail from "@/assets/icons/mail.svg";
import Button from "@ui/Button";
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
  return (
    <div
      className={`min-h-screen flex flex-col bg-pink-500 p-10  ${PixlifyFont.className}`}
    >
      <div className="bg-green-600 min-h-screen p-10">
        استایل Tailwind اعمال شده است!
      </div>
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold  mb-133">
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
