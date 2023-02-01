import { gql } from '@apollo/client';

export const MUTATION_CREATE_CART = gql`
  mutation CreateCart($items: [CartItemInput], $coupons: [String]) {
    emptyCart(input: {}) {
      clientMutationId
    }
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

export const QUERY_ORDER_TOTAL_AMOUNT = gql`
  query orderTotalAmount($id: ID) {
    order(id: $id, idType: ID) {
      total
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
      order {
        id
        databaseId
      }
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

export const MUTATION_UPDATE_ORDER = gql`
  mutation UpdateOrder($orderId: Int, $isPaid: Boolean) {
    updateOrder(input: { orderId: $orderId, isPaid: $isPaid }) {
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
