import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { removeLastTrailingSlash } from 'lib/util';
import { auth } from './orders';
let client;

export async function getApolloClient(jwtToken?: string) {
  if (!client) {
    client = await _createApolloClient(jwtToken);
  }
  return client;
}

export async function _createApolloClient(jwtToken?: string) {
  if (!jwtToken) {
    jwtToken = await auth();
  }
  return new ApolloClient({
    link: new HttpLink({
      uri: removeLastTrailingSlash(process.env.WORDPRESS_GRAPHQL_ENDPOINT),
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
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
}
