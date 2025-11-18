import { marked } from "marked";
import type { GetStaticPaths, GetStaticProps } from "next";
import { getAllPosts, getPostBySlug } from "../../lib/posts";

interface PostProps {
  title: string;
  date: string;
  contentHtml: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts();
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PostProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const post = getPostBySlug(slug);

  if (!post) return { notFound: true };

  const contentHtml = await marked(post.content);

  return {
    props: {
      title: post.title,
      date: post.date,
      contentHtml,
    },
  };
};

export default function Post({ title, date, contentHtml }: PostProps) {
  return (
    <div className="min-h-screen bg-stone-900 text-amber-300 px-6 py-12">
      {/* Container */}
      <article className="max-w-3xl mx-auto bg-stone-800 p-8 rounded-2xl shadow-lg">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-amber-400 mb-4 pixelify-sans-regular">
          {title}
        </h1>

        {/* Date */}
        <p className="text-sm text-amber-500 mb-8">{date}</p>

        {/* Markdown Content */}
        <div
          className="prose prose-invert prose-amber max-w-none"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>

      {/* Buttons */}
      <div className="max-w-3xl mx-auto flex justify-center gap-6 mt-12">
        <a
          href="/blog"
          className="px-6 py-3 rounded-lg bg-stone-800 text-amber-300 font-semibold hover:bg-stone-700 transition"
        >
          ⬅ Back to Blog
        </a>

        <a
          href="/"
          className="px-6 py-3 rounded-lg bg-amber-600 text-black font-semibold hover:bg-amber-500 transition"
        >
          Main Page
        </a>
      </div>
    </div>
  );
}
