import { useQuery } from '@apollo/client';
import ProductsItem from 'components/ProductsItem';
import { QUERY_ALL_PRODUCTS } from 'data/products';

const ProductsList = (props) => {
  const { data, loading, error, fetchMore } = useQuery(QUERY_ALL_PRODUCTS, {
    variables: { first: props.first, after: '' },
  });

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        after: data.products.pageInfo.endCursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          ...prev,
          products: {
            ...prev.products,
            edges: [...prev.products.edges, ...fetchMoreResult.products.edges],
            pageInfo: fetchMoreResult.products.pageInfo,
          },
        };
      },
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data.products.edges.map(({ node }) => (
        <ProductsItem key={node.id} data={node} />
      ))}
      <button type="button" onClick={handleFetchMore}>
        FETCH MORE
      </button>
    </div>
  );
};

export default ProductsList;
