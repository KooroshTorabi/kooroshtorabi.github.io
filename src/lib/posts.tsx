import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), './src/pages/blog/posts');

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-');
}

export function getAllPosts() {
  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames.map(fileName => {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
      filename: fileName,
      slug: slugify(data.title),
      title: data.title,
      date: data.date,
    };
  });

  return posts;
}

export function getPostBySlug(slug: string) {
  const posts = getAllPosts();
  const post = posts.find(p => p.slug === slug);
  if (!post) return null;

  const fullPath = path.join(postsDirectory, post.filename);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title,
    date: data.date,
    content,
  };
}
