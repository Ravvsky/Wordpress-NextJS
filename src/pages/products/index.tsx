import { ApolloProvider } from '@apollo/client';
import ProductsList from 'components/ProductsList';
import { getApolloClient } from 'lib/apollo-client';
import { useEffect, useState } from 'react';

const ProductListPage = () => {
  const [apolloClient, setApolloClient] = useState(null);

  useEffect(() => {
    getApolloClient().then((client) => {
      setApolloClient(client);
    });
  }, []);

  if (!apolloClient) return null;

  return (
    <ApolloProvider client={apolloClient}>
      <ProductsList first={5} />
    </ApolloProvider>
  );
};

export default ProductListPage;
