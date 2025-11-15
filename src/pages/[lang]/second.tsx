import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { GetStaticProps, GetStaticPaths } from 'next';

export default function SecondPage() {
  const t = useTranslations('Second');
  return (
    <div className="bg-blue-500 text-stone-600">
      <h1>{t('title')}</h1>
      <p>{t('content')}</p>
      <Link href="/">Main page</Link>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { lang: 'en' } },
      { params: { lang: 'fa' } },
    ],
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
  if (!context.params) {
    return { notFound: true };
  }
  const lang = context.params.lang as string;
  return {
    props: {
      messages: (await import(`../../messages/${lang}.json`)).default,
      locale: lang,
    },
  };
};
