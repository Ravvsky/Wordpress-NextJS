import { getApolloClient } from 'lib/apollo-client';

import {
  QUERY_ALL_PAGES_INDEX,
  QUERY_ALL_PAGES_ARCHIVE,
  QUERY_ALL_PAGES,
  QUERY_PAGE_BY_URI,
  QUERY_PAGE_SEO_BY_URI,
} from 'data/pages';

/**
 * pagePathBySlug
 */

export function pagePathBySlug(slug) {
  return `/${slug}`;
}

/**
 * getPageByUri
 */

export async function getPageByUri(uri) {
  const apolloClient = getApolloClient();
  const apiHost = new URL(process.env.WORDPRESS_GRAPHQL_ENDPOINT).host;

  let pageData;
  let seoData;

  try {
    pageData = await apolloClient.query({
      query: QUERY_PAGE_BY_URI,
      variables: {
        uri,
      },
    });
  } catch (e) {
    console.log(`[pages][getPageByUri] Failed to query page data: ${e.message}`);
    throw e;
  }

  if (!pageData?.data.page) return { page: undefined };
  interface pageInterface {
    metaTitle?: string;
    metaDescription?: string;
    readingTime?: number;
    canonical?: string;
    description?: string;
    og?: {
      author: string;
      description: string;
      image: {
        sourceUrl: string;
        mediaDetails: {
          height: number;
          width: number;
        };
      };
      modifiedTime: string;
      publishedTime: string;
      publisher: string;
      title: string;
      type: string;
    };
    article?: {};
    robots?: {};
    twitter?: {};
  }

  const page = [pageData?.data.page].map(mapPageData)[0] as pageInterface;

  // If the SEO plugin is enabled, look up the data
  // and apply it to the default settings

  if (process.env.WORDPRESS_PLUGIN_SEO === 'true') {
    try {
      seoData = await apolloClient.query({
        query: QUERY_PAGE_SEO_BY_URI,
        variables: {
          uri,
        },
      });
    } catch (e) {
      console.log(`[pages][getPageByUri] Failed to query SEO plugin: ${e.message}`);
      console.log('Is the SEO Plugin installed? If not, disable WORDPRESS_PLUGIN_SEO in next.config.js.');
      throw e;
    }
    interface seoInterface {
      seo?: {
        canonical: string;
        title: string;
        metaDesc: string;
        readingTime: number;
        opengraphAuthor: string;
        opengraphDescription: string;
        opengraphImage: {
          sourceUrl: string;
          mediaDetails: {
            height: number;
            width: number;
          };
        };
        opengraphModifiedTime: string;
        opengraphPublishedTime: string;
        opengraphPublisher: string;
        opengraphTitle: string;
        opengraphType: string;
        metaRobotsNofollow: string;
        metaRobotsNoindex: string;
        twitterDescription: string;
        twitterImage: {
          altText: string;
          sourceUrl: string;
          mediaDetails: {};
        };
        twitterTitle: string;
      };
    }

    const { seo }: seoInterface = seoData?.data?.page || {};

    page.metaTitle = seo.title;
    page.description = seo.metaDesc;
    page.readingTime = seo.readingTime;

    // The SEO plugin by default includes a canonical link, but we don't want to use that
    // because it includes the WordPress host, not the site host. We manage the canonical
    // link along with the other metadata, but explicitly check if there's a custom one
    // in here by looking for the API's host in the provided canonical link

    if (seo.canonical && !seo.canonical.includes(apiHost)) {
      page.canonical = seo.canonical;
    }

    page.og = {
      author: seo.opengraphAuthor,
      description: seo.opengraphDescription,
      image: seo.opengraphImage,
      modifiedTime: seo.opengraphModifiedTime,
      publishedTime: seo.opengraphPublishedTime,
      publisher: seo.opengraphPublisher,
      title: seo.opengraphTitle,
      type: seo.opengraphType,
    };

    page.robots = {
      nofollow: seo.metaRobotsNofollow,
      noindex: seo.metaRobotsNoindex,
    };

    page.twitter = {
      description: seo.twitterDescription,
      image: seo.twitterImage,
      title: seo.twitterTitle,
    };
  }

  return {
    page,
  };
}

/**
 * getAllPages
 */

const allPagesIncludesTypes = {
  all: QUERY_ALL_PAGES,
  archive: QUERY_ALL_PAGES_ARCHIVE,
  index: QUERY_ALL_PAGES_INDEX,
};

export async function getAllPages(options: { queryIncludes?: string } = {}) {
  const { queryIncludes = 'index' } = options;

  const apolloClient = getApolloClient();

  const data = await apolloClient.query({
    query: allPagesIncludesTypes[queryIncludes],
  });

  const pages = data?.data.pages.edges.map(({ node = {} }) => node).map(mapPageData);

  return {
    pages,
  };
}

/**
 * getTopLevelPages
 */

export async function getTopLevelPages(options) {
  const { pages } = await getAllPages(options);

  const navPages = pages.filter(({ parent }) => parent === null);

  // Order pages by menuOrder
  navPages.sort((a, b) => parseFloat(a.menuOrder) - parseFloat(b.menuOrder));

  return navPages;
}

/**
 * mapPageData
 */

export function mapPageData(page = {}) {
  interface childrenInterface {
    edges?: any[];
  }
  interface dataInterface {
    featuredImage?: {
      node?: {
        altText: string;
        caption: string;
        id: string;
        sizes: string;
        sourceUrl: string;
        srcSet: string;
      };
      altText: string;
      caption: string;
      sourceUrl: string;
      srcSet: string;
      sizes: string;
      id: string;
    };
    parent?: {
      node?: {
        id: string;
        slug: string;
        uri: string;
        title: string;
      };
      id: string;
      slug: string;
      uri: string;
      title: string;
    };
    children?: childrenInterface;
  }

  const data: dataInterface = { ...page };
  if (data.featuredImage) {
    data.featuredImage = data.featuredImage.node;
  }

  if (data.parent) {
    data.parent = data.parent.node;
  }

  if (data.children) {
    data.children = data.children.edges.map(({ node }) => node) as childrenInterface;
  }

  return data;
}

/**
 * getBreadcrumbsByUri
 */

export function getBreadcrumbsByUri(uri, pages) {
  const breadcrumbs = [];
  const uriSegments = uri.split('/').filter((segment) => segment !== '');

  // We don't want to show the current page in the breadcrumbs, so pop off
  // the last chunk before we start

  uriSegments.pop();

  // Work through each of the segments, popping off the last chunk and finding the related
  // page to gather the metadata for the breadcrumbs

  do {
    const breadcrumb = pages.find((page) => page.uri === `/${uriSegments.join('/')}/`);

    // If the breadcrumb is the active page, we want to pass udefined for the uri to
    // avoid the breadcrumbs being rendered as a link, given it's the current page

    if (breadcrumb) {
      breadcrumbs.push({
        id: breadcrumb.id,
        title: breadcrumb.title,
        uri: breadcrumb.uri,
      });
    }

    uriSegments.pop();
  } while (uriSegments.length > 0);

  // When working through the segments, we're doing so from the lowest child to the parent
  // which means the parent will be at the end of the array. We need to reverse to show
  // the correct order for breadcrumbs

  breadcrumbs.reverse();

  return breadcrumbs;
}
