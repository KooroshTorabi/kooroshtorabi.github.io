// lib/posts.ts

import fs from "fs";
import matter from "gray-matter";
import path from "path";

const postsDirectory = path.join(process.cwd(), "./src/pages/blog/posts");

/**
 * تبدیل عنوان به slug
 */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
}

/**
 * خواندن همه پست‌ها از فولدرهای زبان
 */
export function getAllPosts() {
  if (!fs.existsSync(postsDirectory)) return [];

  // لیست فولدرهای زبان
  const languages = fs
    .readdirSync(postsDirectory)
    .filter((dir) => fs.statSync(path.join(postsDirectory, dir)).isDirectory());

  const posts: Array<{
    filename: string;
    slug: string;
    title: string;
    date: string;
    lang: string;
  }> = [];

  languages.forEach((lang) => {
    const langDir = path.join(postsDirectory, lang);

    if (!fs.existsSync(langDir)) return;

    const files = fs.readdirSync(langDir).filter(
      (f) => f.endsWith(".md") && fs.statSync(path.join(langDir, f)).isFile(), // فقط فایل‌ها
    );

    files.forEach((filename) => {
      try {
        const fullPath = path.join(langDir, filename);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data } = matter(fileContents);

        // فقط پست‌هایی که title و date دارند
        if (!data.title || !data.date) return;

        posts.push({
          filename,
          slug: slugify(data.title),
          title: data.title,
          date: data.date,
          lang,
        });
      } catch (err) {
        console.warn(`Error reading post: ${filename} in lang=${lang}`, err);
      }
    });
  });

  return posts;
}

/**
 * خواندن یک پست بر اساس slug و lang
 */
export function getPostBySlug(lang: string, slug: string) {
  const langDir = path.join(postsDirectory, lang);

  if (!fs.existsSync(langDir)) {
    console.warn(`Language folder not found: ${langDir}`);
    return null;
  }

  const files = fs
    .readdirSync(langDir)
    .filter(
      (f) => f.endsWith(".md") && fs.statSync(path.join(langDir, f)).isFile(),
    );

  for (const file of files) {
    try {
      const fullPath = path.join(langDir, file);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      if (!data.title) continue;

      if (slugify(data.title) === slug) {
        return {
          slug,
          title: data.title,
          date: data.date,
          content,
          lang,
        };
      }
    } catch (err) {
      console.warn(`Error reading file ${file} in lang=${lang}`, err);
    }
  }

  return null; // اگر پیدا نشد
}
