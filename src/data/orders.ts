import { gql } from '@apollo/client';

export const MUTATION_CREATE_CART = gql`
  mutation CreateCart($items: [CartItemInput], $coupons: [String]) {
    fillCart(input: { coupons: $coupons, items: $items }) {
      clientMutationId
      cart {
        total
        availableShippingMethods {
          rates {
            label
          }
        }
      }
    }
  }
`;

export const QUERY_AVAILABLE_SHIPPING_METHODS = gql`
  query availableShippingMethods {
    cart {
      availableShippingMethods {
        rates {
          cost
          label
          id
        }
      }
    }
  }
`;

export const MUTATION_CHECKOUT = gql`
  mutation CheckoutOrder(
    $customerNote: String
    $billing: CustomerAddressInput
    $shippingMethod: [String]
    $shipToDifferentAddress: Boolean
    $shipping: CustomerAddressInput
  ) {
    checkout(
      input: {
        paymentMethod: "dotpay"
        customerNote: $customerNote
        billing: $billing
        shippingMethod: $shippingMethod
        shipToDifferentAddress: $shipToDifferentAddress
        shipping: $shipping
      }
    ) {
      clientMutationId
      customer {
        sessionToken
        jwtAuthToken
      }
    }
    emptyCart(input: { clearPersistentCart: true }) {
      clientMutationId
    }
  }
`;

export const MUTATION_UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($country: CountriesEnum) {
    updateCustomer(input: { shipping: { country: $country } }) {
      clientMutationId
    }
  }
`;
export const AUTH = gql`
  mutation Auth($username: String!, $password: String!) {
    login(input: { password: $password, username: $username }) {
      authToken
      sessionToken
    }
  }
`;
