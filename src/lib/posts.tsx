import fs from "fs";
import matter from "gray-matter";
import path from "path";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
// (در صورت نیاز به پلاگین‌های دیگر مانند پشتیبانی از جدول، آن‌ها را نصب و اضافه کنید)
// مثال: npm install remark-gfm (برای جداول و syntax پیشرفته)
// import remarkGfm from "remark-gfm";

// 💡 تغییر: content اکنون رشته HTML/JSX است
export interface PostData {
  slug: string;
  title: string;
  date: string;
  lang: string;
  content: string; // محتوای HTML رندر شده
  coverImage?: string | null;
}

const postsDirectory = path.join(process.cwd(), "src", "posts");

// 🆕 تابع جدید برای تبدیل Markdown به HTML
async function markdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse) // تحلیل Markdown
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw) // برای تفسیر HTML خام داخل Markdown
    .use(rehypeSanitize) // برای امنیت (مهم!)
    .use(rehypeStringify) // تبدیل به رشته HTML
    .process(markdown);

  return String(file);
}

// ⚠️ توجه: این تابع باید async باشد
export async function getAllPosts(): Promise<PostData[]> {
  const fileNames = fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".md"));

  const postsPromises = fileNames.map(async (fileName) => {
    const filePath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, "utf8");

    const { data, content } = matter(fileContents);

    // 💡 تبدیل Markdown به HTML
    const renderedContent = await markdownToHtml(content);

    return {
      slug: fileName.replace(/\.md$/, ""),
      title: data.title as string,
      date: data.date as string,
      lang: data.lang as string,
      content: renderedContent, // محتوای HTML
      coverImage: data.coverImage ?? null,
    };
  });

  const posts = await Promise.all(postsPromises);

  // مرتب‌سازی بر اساس تاریخ (جدیدترین اول)
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// ⚠️ توجه: این تابع باید async باشد
export async function getPostBySlug(slug: string): Promise<PostData | null> {
  const filePath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  // 💡 تبدیل Markdown به HTML
  const renderedContent = await markdownToHtml(content);

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    lang: data.lang as string,
    content: renderedContent, // محتوای HTML
    coverImage: data.coverImage || null,
  };
}
