import { useTranslations } from 'next-intl';
import { GetStaticProps, GetStaticPaths } from 'next';
import { locales } from '../../../i18n.config.js';

export default function IndexPage() {
  const t = useTranslations('Index');
  return <h1>{t('title')}</h1>;
}

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
  const lang = context.params.lang as string;
  return {
    props: {
      messages: (await import(`../../messages/${lang}.json`)).default,
      locale: lang,
    },
  };
};
