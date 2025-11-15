/** @type {import('next').NextConfig} */
const nextConfig = {
  // 💥 این تنظیم برای GitHub Pages الزامی است 💥
  output: "export",

  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
