import { Helmet } from 'react-helmet';

import { WebpageJsonLd } from 'lib/json-ld';
import { helmetSettingsFromMetadata } from 'lib/site';
import useSite from 'hooks/use-site';

import Layout from 'components/Layout';
import Header from 'components/Header';
import Section from 'components/Section';
import Container from 'components/Container';
import SectionTitle from 'components/SectionTitle';
import PostCard from 'components/PostCard';
import Pagination from 'components/Pagination/Pagination';

import styles from 'styles/templates/Archive.module.scss';

const DEFAULT_POST_OPTIONS = {};
interface PropsInterface {
  title?: string;
  // eslint-disable-next-line no-undef
  Title?: JSX.Element;
  posts: {};
  postOptions?: {
    excludeMetadata?: string[];
  };
  slug: string;
  metadata: {
    canonical: string;
    og: {
      url?: string;
      type?: string;
      title?: string;
    };
    twitter: {
      title?: string;
    };
    article?: {};
    description?: string;
    title?: string;
  };
  pagination?: {
    currentPage: number;
    pagesCount: number;
    basePath: string;
  };
}
//posts metadata
export default function TemplateArchive({
  title = 'Archive',
  Title,
  posts,
  postOptions = DEFAULT_POST_OPTIONS,
  slug,
  metadata,
  pagination,
}: PropsInterface) {
  const { metadata: siteMetadata = {} } = useSite();

  if (process.env.WORDPRESS_PLUGIN_SEO !== 'true') {
    metadata.title = `${title} - ${siteMetadata.title}`;
    metadata.og.title = metadata.title;
    metadata.twitter.title = metadata.title;
  }

  const helmetSettings = helmetSettingsFromMetadata(metadata);

  return (
    <Layout>
      <Helmet {...helmetSettings} />

      <WebpageJsonLd title={title} description={metadata.description} siteTitle={siteMetadata.title} slug={slug} />

      <Header>
        <Container>
          <h1>{Title || title}</h1>
          {metadata.description && (
            <p
              className={styles.archiveDescription}
              dangerouslySetInnerHTML={{
                __html: metadata.description,
              }}
            />
          )}
        </Container>
      </Header>

      <Section>
        <Container>
          <SectionTitle>Posts</SectionTitle>
          {Array.isArray(posts) && (
            <>
              <ul className={styles.posts}>
                {posts.map((post) => {
                  return (
                    <li key={post.slug}>
                      <PostCard post={post} options={postOptions} />
                    </li>
                  );
                })}
              </ul>
              {pagination && (
                <Pagination
                  currentPage={pagination?.currentPage}
                  pagesCount={pagination?.pagesCount}
                  basePath={pagination?.basePath}
                  addCanonical={false}
                />
              )}
            </>
          )}
        </Container>
      </Section>
    </Layout>
  );
}
