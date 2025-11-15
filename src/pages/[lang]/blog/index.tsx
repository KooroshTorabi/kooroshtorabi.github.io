import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { GetStaticProps, GetStaticPaths } from 'next';
import { locales } from '../../../../i18n.config.js';

interface Frontmatter {
  title: string;
  date: string;
  excerpt: string;
}

interface Post {
  slug: string;
  frontmatter: Frontmatter;
}

interface BlogIndexProps {
  posts: Post[];
  lang: string;
}

const BlogIndex: React.FC<BlogIndexProps> = ({ posts, lang }) => {
  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {posts.map(post => (
          <li key={post.slug}>
            <Link href={`/${lang}/blog/${post.slug}`}>
              <h2>{post.frontmatter.title}</h2>
              <p>{post.frontmatter.date}</p>
              <p>{post.frontmatter.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: locales.map(lang => ({ params: { lang } })),
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
  if (!context.params) {
    return { notFound: true };
  }
  const { lang } = context.params as { lang: string };
  const postsDirectory = path.join(process.cwd(), '_posts');
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames
    .filter(filename => filename.endsWith(`.${lang}.md`))
    .map(filename => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data: frontmatter } = matter(fileContents);

      return {
        slug: filename.replace(`.${lang}.md`, ''),
        frontmatter,
      };
    });

  return {
    props: {
      posts,
      lang,
      messages: (await import(`../../../messages/${lang}.json`)).default,
      locale: lang,
    },
  };
};

export default BlogIndex;
