import { GetStaticProps } from "next";
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
    <div>
      <h1>بلاگ</h1>
      <ul>
        {posts.map(({ slug, title, date }) => (
          <li key={slug}>
            <Link href={`/blog/${slug}`}>
              <a>{title}</a>
            </Link>
            <small> - {date}</small>
          </li>
        ))}
      </ul>
      <br />
      <a href="/">صفحه اصلی </a>
    </div>
  );
}
