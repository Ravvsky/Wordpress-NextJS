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
  query ($first: Int, $after: String) {
    products(first: $first, after: $after, where: { supportedTypesOnly: true }) {
      edges {
        cursor
        node {
          id
          slug
          ... on ContentNode {
            uri
          }
          name
          type
          shortDescription
          image {
            id
            sourceUrl
            altText
          }
          galleryImages {
            nodes {
              id
              sourceUrl
              altText
            }
          }
          ... on SimpleProduct {
            onSale
            price
            regularPrice
          }
          ... on VariableProduct {
            onSale
            price
            regularPrice
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
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
      databaseId
      ... on SimpleProduct {
        price(format: FORMATTED)
        regularPrice(format: FORMATTED)
        onSale
        image {
          srcSet(size: THUMBNAIL)
        }
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
        productCategories {
          edges {
            node {
              databaseId
              name
              link
              uri
            }
          }
        }
        stockStatus
        seo {
          breadcrumbs {
            text
            url
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

export const QUERY_COUPON = gql`
  query QueryCoupon($code: ID!) {
    coupon(id: $code, idType: CODE) {
      code
      discountType
      amount
      description
      excludeSaleItems
      minimumAmount
      maximumAmount
      dateExpiry
      individualUse
      excludedProducts {
        edges {
          node {
            databaseId
          }
        }
      }
      excludedProductCategories {
        edges {
          node {
            databaseId
          }
        }
      }
      products {
        edges {
          node {
            databaseId
          }
        }
      }
      productCategories {
        edges {
          node {
            databaseId
          }
        }
      }
    }
  }
`;
