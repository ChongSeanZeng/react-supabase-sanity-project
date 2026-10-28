import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useLanguage } from '@/i18n';

interface PageMetaProps {
  title: string;
  description: string;
  keywords?: string[] | string;
  noindex?: boolean;
}

export const PageMeta: React.FC<PageMetaProps> = (props) => {
  const { t } = useLanguage();
  const {
    title,
    description,
    keywords,
    noindex = false,
  } = props;
  const localizedTitle = t(title);
  const localizedDescription = t(description);
  const keywordsContent = Array.isArray(keywords)
    ? keywords.map(t).join(', ')
    : keywords?.split(',').map((keyword) => t(keyword.trim())).join(', ');

  return (
    <Helmet defer={false}>
      <title>{localizedTitle}</title>
      <meta name='description' content={localizedDescription} />
      {!!keywords?.length && <meta name='keywords' content={keywordsContent} />}
      <meta
        name='robots'
        content={noindex ? 'noindex, nofollow' : 'index, follow'}
      />
      <meta property='og:title' content={localizedTitle} />
      <meta property='og:description' content={localizedDescription} />
    </Helmet>
  );
};

export const HelmetProviderWrapper: React.FC<React.PropsWithChildren> = (
  props,
) => {
  return <HelmetProvider>{props.children}</HelmetProvider>;
};
