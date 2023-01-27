import { getApolloClient } from './apollo-client';
import {
  AUTH,
  MUTATION_CHECKOUT,
  MUTATION_CREATE_CART,
  MUTATION_UPDATE_CUSTOMER,
  QUERY_AVAILABLE_SHIPPING_METHODS,
} from '../data/orders';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { removeLastTrailingSlash } from './util';
export async function auth() {
  const apolloClient = new ApolloClient({
    link: new HttpLink({
      uri: removeLastTrailingSlash(process.env.WORDPRESS_GRAPHQL_ENDPOINT),
    }),
    cache: new InMemoryCache({
      typePolicies: {
        RootQuery: {
          queryType: true,
        },
        RootMutation: {
          mutationType: true,
        },
      },
    }),
  });

  let authData: {
    data: {
      login: any;
    };
  };

  try {
    authData = await apolloClient.mutate({
      mutation: AUTH,
      variables: {
        username: 'finklo',
        password: 'finklo',
      },
    });
  } catch (e) {
    console.log(e);
    return { error: e.message };
  }

  const auth = authData.data.login.authToken;

  return auth;
}

export async function createCart(items, coupons) {
  const apolloClient = await getApolloClient();
  let cartData: {
    data: {
      items: any;
      coupons: any;
    };
  };

  console.log(items);

  try {
    cartData = await apolloClient.mutate({
      mutation: MUTATION_CREATE_CART,
      variables: {
        coupons: coupons,
        items: items,
      },
    });
  } catch (e) {
    return { error: e.message };
  }
  console.log(cartData);
  return { cartData };
}

export async function checkoutOrder({ customerNote, billing, shippingMethod, shipToDifferentAddress, shipping }) {
  const apolloClient = await getApolloClient();
  let cartData: {
    data: {
      coupons: any;
      items: any;
      shippingMethods: any;
    };
  };

  try {
    cartData = await apolloClient.mutate({
      mutation: MUTATION_CHECKOUT,
      variables: {
        customerNote: customerNote,
        billing: billing,
        shippingMethod: shippingMethod,
        shipToDifferentAddress: shipToDifferentAddress,
        shipping: shipping,
      },
    });
  } catch (e) {
    console.log(e);
    return { error: e.message };
  }
  console.log(cartData.data);

  const cart = cartData.data;
  return { cart };
}

export async function updateCustomer(country) {
  const apolloClient = await getApolloClient();
  let customerData;

  try {
    customerData = await apolloClient.mutate({
      mutation: MUTATION_UPDATE_CUSTOMER,
      variables: {
        country: country,
      },
    });
  } catch (e) {
    console.log(e);
    return { error: e.message };
  }

  const customer = customerData.data;
  return { customer };
}

export async function availableShippingMethods() {
  const apolloClient = await getApolloClient();
  let cartData;

  try {
    cartData = await apolloClient.query({
      query: QUERY_AVAILABLE_SHIPPING_METHODS,
    });
  } catch (e) {
    console.log(e);
    return { error: e.message };
  }

  const cart = cartData.data;
  console.log(cartData);

  return { cart };
}
