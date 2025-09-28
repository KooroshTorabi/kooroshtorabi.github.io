// lib/posts.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "/src/pages/blog/posts");

export interface PostData {
  id: string;
  title: string;
  date: string;
}

export function getSortedPostsData(): PostData[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    return {
      id,
      title: matterResult.data.title as string,
      date: matterResult.data.date as string,
    };
  });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}
