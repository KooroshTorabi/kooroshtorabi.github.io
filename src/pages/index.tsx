import { GetStaticProps } from "next";
import { getSortedPostsData, PostData } from "../lib/posts";

interface Props {
  allPostsData: PostData[];
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const allPostsData = getSortedPostsData();
  return { props: { allPostsData } };
};

export default function Home({ allPostsData }: Props) {
  return (
    <ul>
      {allPostsData.map(({ id, title, date }) => (
        <li key={id}>
          <h2>{title}dfdfdf</h2>
          <p>{date}</p>
        </li>
      ))}
    </ul>
  );
}
