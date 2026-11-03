import { Inter, Vazirmatn } from "next/font/google";

// تعریف واحد فونت‌ها برای جلوگیری از تداخل query های next/font در Turbopack
export const VazirmatnFont = Vazirmatn({
  subsets: ["latin", "arabic"],
  weight: ["400", "700"],
});

export const InterFont = Inter({
  subsets: ["latin"],
});
