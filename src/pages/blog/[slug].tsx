import { GetStaticPaths, GetStaticProps } from "next";
import { getAllPosts, getPostBySlug } from "../../lib/posts";
import { marked } from "marked";

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

export async function getStaticProps({
  params: { slug },
}: {
  params: { slug: string };
}): Promise<{ props: PostProps } | { notFound: true }> {
  // const slug = params?.slug as string;
  const post = getPostBySlug(slug);

  if (!post) {
    return { notFound: true };
  }

  const contentHtml = await marked(post.content);

  return {
    props: {
      title: post.title,
      date: post.date,
      contentHtml,
    },
  };
}

export default function Post({ title, date, contentHtml }: PostProps) {
  return (
    <>
      <article>
        <h1>{title}</h1>
        <small>{date}</small>
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </article>
      <br />
      <a href="/">صفحه اصلی </a>
    </>
  );
}
