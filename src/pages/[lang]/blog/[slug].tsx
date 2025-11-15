import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { GetStaticProps, GetStaticPaths } from 'next';

interface Frontmatter {
  title: string;
  date: string;
  excerpt: string;
}

interface PostPageProps {
  frontmatter: Frontmatter;
  content: string;
}

const PostPage: React.FC<PostPageProps> = ({ frontmatter, content }) => {
  return (
    <div>
      <h1>{frontmatter.title}</h1>
      <p>{frontmatter.date}</p>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const postsDirectory = path.join(process.cwd(), '_posts');
  const filenames = fs.readdirSync(postsDirectory);
  const paths = [];

  for (const filename of filenames) {
    const [slug, lang] = filename.replace('.md', '').split('.');
    if (slug && lang) {
      paths.push({
        params: {
          lang,
          slug,
        },
      });
    }
  }

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  if (!context.params) {
    return { notFound: true };
  }
  const { lang, slug } = context.params as { lang: string; slug: string };
  const filePath = path.join(process.cwd(), '_posts', `${slug}.${lang}.md`);

  // Check if file exists before reading
  if (!fs.existsSync(filePath)) {
    return { notFound: true };
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter, content } = matter(fileContents);
  const htmlContent = marked(content);

  return {
    props: {
      frontmatter,
      content: htmlContent,
      messages: (await import(`../../../messages/${lang}.json`)).default,
    },
  };
};

export default PostPage;
