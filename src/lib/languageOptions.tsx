// src/pages/languageOptions.tsx

export interface LanguageOption {
  code: string;
  dir: "ltr" | "rtl";
  name: string;
  flag: string;
  type: "emoji" | "image";
}

// تعریف یک لیست ساده از زبان ها و پرچم ها
const languageOptions: LanguageOption[] = [
  // 👈 پرچم سفارشی
  {
    code: "fa",
    name: "فارسی",
    flag: "/images/sun-lion.svg",
    type: "image",
    dir: "rtl",
  },
  { code: "en", name: "English", flag: "🇬🇧", type: "emoji", dir: "ltr" },
  { code: "de", name: "Deutsch", flag: "🇩🇪", type: "emoji", dir: "ltr" },
];

export default languageOptions;
