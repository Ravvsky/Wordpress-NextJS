import { getProductBySlug, getRecentPosts } from 'lib/products';

import Layout from 'components/Layout';
import Section from 'components/Section';
import Container from 'components/Container';
import Content from 'components/Content';
import Image from 'components/Image';
import Breadcrumbs from 'components/Breadcrumbs';
import Gallery from 'components/Gallery';
import Paragraph from 'components/GutenbergBlocks/core/Paragraph';
import Heading from 'components/GutenbergBlocks/core/Heading';
import { useContext, useState } from 'react';
import CartContext from 'context/CartContext';
export default function Product({ product, slug }) {
  const {
    name,
    description,
    shortDescription,
    regularPrice,
    price,
    seo,
    databaseId,
    image: thumbnail,
    stockStatus,
    productCategories,
    onSale,
  } = product;

  const gallery = product.galleryImages.edges;
  let breadcrumbs = seo.breadcrumbs;
  const test = [];
  for (let i = 0; i < gallery.length; i++) {
    test.push(
      <Image
        src={gallery[i].node.sourceUrl}
        alt={gallery[i].node.altText}
        srcSet={gallery[i].node.srcSet}
        sizes={gallery[i].node.sizes}
        key={i}
      />
    );
  }
  const ctx = useContext(CartContext);

  const addProductHandler = () => {
    ctx.addItem({
      id: databaseId,
      name: name,
      quantity: quantity,
      price: price,
      thumbnail: thumbnail,
      stockStatus: stockStatus,
      slug: slug,
      productCategories: productCategories,
      onSale: onSale,
    });
  };

  const [quantity, setQuantity] = useState(1);

  const plusQuantityHandler = () => {
    setQuantity(quantity + 1);
  };
  const minusQuantityHandler = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };
  return (
    <Layout>
      <Content>
        <Section>
          <Container className="bg-red-100	">
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <div className="flex">
              <Gallery className="flex-[60%]" />
              <div className="flex-[40%]">
                <Heading
                  attributes={{
                    main: {
                      anchor: '',
                      content: name,
                      level: 2,
                      style: undefined,
                    },
                  }}
                >
                  {name}
                </Heading>
                <button onClick={addProductHandler}>TEST</button>
                <div>
                  <input type="number" value={quantity} readOnly />
                  <button className="quantity-up p-[2rem] bg-red-500" onClick={plusQuantityHandler}>
                    +
                  </button>
                  <button className="quantity-down p-[2rem] bg-green-500" onClick={minusQuantityHandler}>
                    -
                  </button>
                </div>
                {/*
                <Paragraph
                  attributes={{
                    main: {
                      anchor: '',
                      content: shortDescription,
                      dropCap: false,
                      style: undefined,
                    },
                    innerBlocks: undefined,
                  }}
                ></Paragraph> */}
              </div>
            </div>
            {/* {test.map((item) => {
              return item;
            })} */}
          </Container>
        </Section>
      </Content>
    </Layout>
  );
}

export async function getStaticProps({ params = { slug: '' } } = {}) {
  const { product } = await getProductBySlug(params?.slug);
  if (!product) {
    return {
      props: {},
      notFound: true,
    };
  }
  const slug = params?.slug;
  const props = {
    product,
    slug,
  };
  return {
    props,
  };
}

export async function getStaticPaths() {
  // Only render the most recent posts to avoid spending unecessary time
  // querying every single post from WordPress

  // Tip: this can be customized to use data or analytitcs to determine the
  // most popular posts and render those instead

  const { posts } = await getRecentPosts({
    count: process.env.POSTS_PRERENDER_COUNT, // Update this value in next.config.js!
    queryIncludes: 'index',
  });

  const paths = posts
    .filter(({ slug }) => typeof slug === 'string')
    .map(({ slug }) => ({
      params: {
        slug,
      },
    }));
  return {
    paths,
    fallback: 'blocking',
  };
}
