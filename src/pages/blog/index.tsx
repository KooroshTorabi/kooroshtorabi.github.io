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
    <div className="min-h-screen bg-stone-900 text-amber-500 px-6 py-10">
      {/* Page Title */}
      <h1 className="text-4xl font-bold mb-10 text-center text-amber-400 pixelify-sans-regular">
        Blog Posts
      </h1>

      {/* Posts List */}
      <div className="max-w-3xl mx-auto space-y-6">
        {posts.map(({ slug, title, date }) => (
          <Link
            key={slug}
            href={`/blog/${slug}`}
            className="block bg-stone-800 p-6 rounded-xl shadow-lg hover:bg-stone-700 transition-all"
          >
            <h2 className="text-2xl font-semibold text-amber-300 pixelify-sans-regular">
              {title}
            </h2>

            <p className="text-sm text-amber-600 mt-1">{date}</p>

            <p className="text-amber-500 mt-3 opacity-80">Read more →</p>
          </Link>
        ))}
      </div>

      {/* Buttons */}
      <div className="max-w-3xl mx-auto flex justify-center gap-6 mt-12">
        <Link
          href="/"
          className="px-6 py-3 rounded-lg bg-amber-600 text-black font-semibold hover:bg-amber-500 transition"
        >
          ⬅ Back to Main Page
        </Link>

        <Link
          href="/blog"
          className="px-6 py-3 rounded-lg bg-stone-800 text-amber-300 font-semibold hover:bg-stone-700 transition"
        >
          Blog Home
        </Link>
      </div>
    </div>
  );
}
