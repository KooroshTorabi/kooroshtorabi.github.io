// src/lib/posts.tsx

import fs from "fs";
import matter from "gray-matter";
import path from "path";

export interface PostData {
  slug: string;
  title: string;
  date: string;
  lang: string;
  content: string;
}

const postsDirectory = path.join(process.cwd(), "src", "posts");

// همه پست‌ها را بخوان
export function getAllPosts(): PostData[] {
  const fileNames = fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".md"));

  // console.log("\\\\\\\\\\\\\\\\\\\\\===========>>>>>\n\r"+postsDirectory);
  const posts = fileNames.map((fileName) => {
    const filePath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, "utf8");

    const { data, content } = matter(fileContents);

    return {
      slug: fileName.replace(/\.md$/, ""),
      title: data.title as string,
      date: data.date as string,
      lang: data.lang as string,
      content: content,
    };
  });

  // مرتب‌سازی بر اساس تاریخ (جدیدترین اول)
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// یک پست را بر اساس slug پیدا کن
export function getPostBySlug(slug: string): PostData | null {
  const filePath = path.join(postsDirectory, `${slug}.md`);
  console.log(`Checking file path: ${filePath}`); // 👈 اضافه کردن این خط
  if (!fs.existsSync(filePath)) return null;
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    lang: data.lang as string,
    content,
  };
}
