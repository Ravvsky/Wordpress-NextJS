import { gql } from '@apollo/client';

export const PRODUCTS_FIELDS = gql`
  fragment ProductFields on Post {
    id
    categories {
      edges {
        node {
          databaseId
          id
          name
          slug
        }
      }
    }
    databaseId
    date
    isSticky
    postId
    slug
    title
  }
`;

export const QUERY_ALL_PRODUCTS_INDEX = gql`
  query AllPostsIndex {
    products(first: 10000) {
      edges {
        node {
          id
          slug
        }
      }
    }
  }
`;

export const QUERY_ALL_PRODUCTS_ARCHIVE = gql`
  query AllProductArchive {
    posts(first: 10000) {
      edges {
        node {
          ...PostFields
          author {
            node {
              avatar {
                height
                url
                width
              }
              id
              name
              slug
            }
          }
          excerpt
        }
      }
    }
  }
`;

export const QUERY_ALL_PRODUCTS = gql`
  query AllProducts {
    products(first: 10000, where: { visibility: VISIBLE }) {
      edges {
        node {
          id
          slug
        }
      }
    }
  }
`;

export const QUERY_PRODUCT_BY_SLUG = gql`
  query ProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      name
      description
      shortDescription
      type
      ... on SimpleProduct {
        price
        regularPrice
        galleryImages {
          edges {
            node {
              sourceUrl
              altText
              sizes
              srcSet
            }
          }
        }
      }
    }
  }
`;

export const QUERY_PRODUCT_PER_PAGE = gql`
  query ProductPerPage {
    allSettings {
      readingSettingsPostsPerPage
    }
  }
`;
