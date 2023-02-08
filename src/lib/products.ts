import { getApolloClient } from 'lib/apollo-client';

import { updateUserAvatar } from 'lib/users';
import { sortObjectsByDate } from 'lib/datetime';

import {
  QUERY_ALL_PRODUCTS_INDEX,
  QUERY_ALL_PRODUCTS_ARCHIVE,
  QUERY_ALL_PRODUCTS,
  QUERY_PRODUCT_BY_SLUG,
  QUERY_PRODUCT_PER_PAGE,
  QUERY_COUPON,
} from 'data/products';

/**
 * getCouponCode
 */

export async function getCouponCode(code: string) {
  const apolloClient = await getApolloClient();
  let couponData: {
    data: {
      coupon: any;
    };
  };

  try {
    couponData = await apolloClient.query({
      query: QUERY_COUPON,
      variables: {
        code: code,
      },
    });
  } catch (e) {
    return { error: e.message };
  }
  const coupon = couponData.data.coupon;
  return { coupon };
}

/**
 * productPathBySlug
 */

export function postPathBySlug(slug: any) {
  return `/products/${slug}`;
}

/**
 * getProductBySlug
 */

export async function getProductBySlug(slug: any) {
  const apolloClient = await getApolloClient();
  const includeAuthor = false;
  let postData: {
    data: {
      product: any;
    };
  };

  try {
    postData = await apolloClient.query({
      query: QUERY_PRODUCT_BY_SLUG,
      variables: {
        slug,
        includeAuthor,
      },
    });
  } catch (e) {
    console.log(`[products][getPostBySlug] Failed to query post data: ${e.message}`);
    throw e;
  }
  if (!postData?.data.product) return { product: undefined };
  interface postInterface {
    categories?: {
      databaseId?: number;
      id?: string;
      name?: string;
      slug?: string;
    };
    databaseId?: number;
    metaTitle?: string;
    blocks?: {
      attributesJSON: string;
      name: string;
    };
    metaDescription?: string;
    readingTime?: number;
    canonical?: string;
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
  const product = [postData?.data.product].map(mapPostData)[0] as postInterface;

  // If the SEO plugin is enabled, look up the data
  // and apply it to the default settings

  return {
    product,
  };
}

/**
 * getAllProductss
 */

const allPostsIncludesTypes = {
  all: QUERY_ALL_PRODUCTS,
  archive: QUERY_ALL_PRODUCTS_ARCHIVE,
  index: QUERY_ALL_PRODUCTS_INDEX,
};

export async function getAllPosts(options: { queryIncludes?: string } = {}) {
  const { queryIncludes = 'index' } = options;
  const apolloClient = await getApolloClient();

  const data = await apolloClient.query({
    query: allPostsIncludesTypes[queryIncludes],
  });
  const posts = data?.data.products.edges.map(({ node = {} }) => node);
  return {
    posts: Array.isArray(posts) && posts.map(mapPostData),
  };
}

/**
 * getRecentPosts
 */

export async function getRecentPosts({ count, ...options }) {
  const { posts } = await getAllPosts(options);
  const sorted = sortObjectsByDate(posts);
  return {
    posts: sorted.slice(0, count),
  };
}

/**
 * sanitizeExcerpt
 */

export function sanitizeExcerpt(excerpt: any) {
  if (typeof excerpt !== 'string') {
    throw new Error(`Failed to sanitize excerpt: invalid type ${typeof excerpt}`);
  }

  let sanitized = excerpt;

  // If the theme includes [...] as the more indication, clean it up to just ...

  sanitized = sanitized.replace(/\s?\[&hellip;\]/, '&hellip;');

  // If after the above replacement, the ellipsis includes 4 dots, it's
  // the end of a setence

  sanitized = sanitized.replace('....', '.');
  sanitized = sanitized.replace('.&hellip;', '.');

  // If the theme is including a "Continue..." link, remove it

  sanitized = sanitized.replace(/\w*<a class="more-link".*<\/a>/, '');

  return sanitized;
}

/**
 * mapPostData
 */

export function mapPostData(post = {}) {
  interface dataInterface {
    author?: {
      node: any;
      avatar: {
        height: number;
        url: string;
        width: number;
      };
    };
    categories?: {
      edges?: {
        [x: string]: any;
        __typename: string;
        node: {};
      };
    };
    featuredImage?: {
      node?: {
        altText: string;
        caption: string;
        sourceUrl: string;
        srcSet: string;
        sizes: string;
        id: string;
      };
      altText: string;
      caption: string;
      sourceUrl: string;
      srcSet: string;
      sizes: string;
      id: string;
    };
    postId: number;
  }
  const data: dataInterface = {
    ...post,
    postId: 0,
  };
  // Clean up the author object to avoid someone having to look an extra
  // level deeper into the node

  if (data.author) {
    data.author = {
      ...data.author.node,
    };
  }

  // The URL by default that comes from Gravatar / WordPress is not a secure
  // URL. This ends up redirecting to https, but it gives mixed content warnings
  // as the HTML shows it as http. Replace the url to avoid those warnings
  // and provide a secure URL by default

  if (data.author?.avatar) {
    data.author.avatar = updateUserAvatar(data.author.avatar);
  }

  // Clean up the categories to make them more easy to access

  if (data.categories) {
    data.categories = data.categories.edges.map(({ node }) => {
      return {
        ...node,
      };
    });
  }

  // Clean up the featured image to make them more easy to access

  if (data.featuredImage) {
    data.featuredImage = data.featuredImage.node;
  }

  return data;
}

/**
 * getRelatedPosts
 */

export async function getRelatedPosts(
  categories: { databaseId?: number; id?: string; name?: string; slug?: string },
  postId: number,
  count: number = 5
): Promise<any> {
  if (!Array.isArray(categories) || categories.length === 0) return;
  interface relatedInterface {
    category?: {
      databaseId?: number;
      id?: string;
      name?: string;
      slug: string;
    };
    posts?: { title: string; slug: string };
  }

  let related: relatedInterface = {
    category: categories && categories.shift(),
  };

  if (!Array.isArray(related.posts) || related.posts.length === 0) {
    const relatedPosts: {} = await getRelatedPosts(categories, postId, count);
    related = relatedPosts || related;
  }

  if (Array.isArray(related.posts) && related.posts.length > count) {
    return related.posts.slice(0, count);
  }

  return related;
}

/**
 * sortStickyPosts
 */

export function sortStickyPosts(posts) {
  return [...posts].sort((post) => (post.isSticky ? -1 : 1));
}

/**
 * getPostsPerPage
 */

export async function getPostsPerPage() {
  //If POST_PER_PAGE is defined at next.config.js
  if (process.env.POSTS_PER_PAGE) {
    console.warn(
      'You are using the deprecated POST_PER_PAGE variable. Use your WordPress instance instead to set this value ("Settings" > "Reading" > "Blog pages show at most").'
    );
    return Number(process.env.POSTS_PER_PAGE);
  }

  try {
    const apolloClient = await getApolloClient();

    const { data } = await apolloClient.query({
      query: QUERY_PRODUCT_PER_PAGE,
    });

    return Number(data.allSettings.readingSettingsPostsPerPage);
  } catch (e) {
    console.log(`Failed to query post per page data: ${e.message}`);
    throw e;
  }
}

/**
 * getPageCount
 */

export async function getPagesCount(posts: string | any[], postsPerPage: number) {
  const _postsPerPage = postsPerPage ?? (await getPostsPerPage());
  return Math.ceil(posts.length / _postsPerPage);
}

/**
 * getPaginatedPosts
 */
type getPaginatedPostsProps = {
  currentPage: number | string;
  queryIncludes?: string;
};
export async function getPaginatedPosts({ currentPage = 1, ...options }: getPaginatedPostsProps) {
  const { posts } = await getAllPosts(options);
  const postsPerPage = await getPostsPerPage();
  const pagesCount = await getPagesCount(posts, postsPerPage);

  let page = Number(currentPage);

  if (typeof page === 'undefined' || isNaN(page)) {
    page = 1;
  } else if (page > pagesCount) {
    return {
      posts: [],
      pagination: {
        currentPage: undefined,
        pagesCount,
      },
    };
  }

  const offset = postsPerPage * (page - 1);
  const sortedPosts = sortStickyPosts(posts);
  return {
    posts: sortedPosts.slice(offset, offset + postsPerPage),
    pagination: {
      currentPage: page,
      pagesCount,
    },
  };
}

export async function getAllProducts({ first, after }) {
  const apolloClient = await getApolloClient();
  let cartData;
  try {
    cartData = await apolloClient.query({
      query: QUERY_ALL_PRODUCTS,
      variables: {
        first: first,
        after: after,
      },
    });
  } catch (e) {
    console.log(e);
    return { error: e.message };
  }

  const cart = cartData.data;
  console.log(cartData);

  return { cart };
}
