import type { Config } from "tailwindcss";

export default {
  content: [
    // "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 🚩 سفارشی‌سازی استایل‌های Prose
      typography: ({ theme }) => ({
        // ما از prose-invert (تم تیره) و prose-amber استفاده می‌کنیم
        invert: {
          css: {
            // اعمال استایل برای جداول درون تم تیره
            table: {
              width: "100%",
              "border-collapse": "collapse",
              "border-top": `1px solid ${theme("colors.amber.600")}`, // خط بالای جدول
              "border-left": `1px solid ${theme("colors.amber.600")}`, // خط چپ جدول
              "border-right": `1px solid ${theme("colors.amber.600")}`, // خط راست جدول
              "--tw-prose-invert-table-border": theme("colors.amber.600"), // اگر از متغیر استفاده می‌کند
            },
            "thead th": {
              "border-bottom": `2px solid ${theme("colors.amber.600")}`,
            },
            "tbody tr": {
              "border-bottom": `1px solid ${theme("colors.amber.700")}`,
            },
            "th, td": {
              // 💡 این مهم است: تنظیم خطوط سلول‌ها
              border: `1px solid ${theme("colors.amber.700")}`,
              padding: theme("spacing.3"),
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
  important: true,
} satisfies Config;
