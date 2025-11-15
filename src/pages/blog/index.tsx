import type { GetStaticProps } from "next";
import Link from "next/link";
import { getAllPosts } from "../../lib/posts";

interface Post {
  slug: string;
  title: string;
  date: string;
}

interface BlogProps {
  posts: Post[];
}

export const getStaticProps: GetStaticProps<BlogProps> = async () => {
  const posts = getAllPosts();
  return {
    props: { posts },
  };
};

export default function Blog({ posts }: BlogProps) {
  return (
    <div className="px-8 py-6">
      <h1>Blog</h1>
      <ul>
        {posts.map(({ slug, title, date }) => (
          <li key={slug}>
            <Link
              href={`/blog/${slug}`}
              className="pixelify-sans-regular  text-2xl text-blue-600 hover:underline"
            >
              {title}
            </Link>
            <small> - {date}</small>
          </li>
        ))}
      </ul>
      <br />
      <Link href="/blog">Main Blog Page</Link>
      <Link href="/">Main Page</Link>
    </div>
  );
}
