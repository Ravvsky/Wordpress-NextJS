import Image from 'components/Image';
import cartIcon from 'assets/icons/shopping-cart.png';
import { useContext, useEffect, useState } from 'react';
import CartContext from 'context/CartContext';
import CartItem from './CartItem';
import { gql } from '@apollo/client';
import { getApolloClient } from 'lib/apollo-client';
import Link from 'next/link';
import CartItemsList from './CartItemsList';

const Cart = (props) => {
  const ctx = useContext(CartContext);

  const ADD_TODO = gql`
    mutation test {
      addCartItems(
        input: { clientMutationId: "some", items: [{ productId: 187, quantity: 3 }, { productId: 213, quantity: 3 }] }
      ) {
        clientMutationId
        added {
          key
          product {
            node {
              databaseId
            }
          }
          variation {
            node {
              databaseId
            }
          }
          quantity
        }
        cartErrors {
          type
          reasons
          productId
          quantity
          variationId
          variation {
            attributeName
            attributeValue
          }
          extraData
        }
        cart {
          contents {
            nodes {
              key
              quantity
            }
          }
        }
      }
      checkout(input: { paymentMethod: "dotpay" }) {
        clientMutationId
        order {
          cartHash
        }
      }
    }
  `;
  async function createOrder(slug: any) {
    const apolloClient = getApolloClient();
    // {
    //   "input": {
    //     "clientMutationId": "someId",
    //     "items": [
    //       {
    //         "productId": 213,
    //         "quantity": 3
    //       },
    //       {
    //         "productId": 191,
    //         "quantity": 2
    //       }
    //     ]
    //   }
    // }

    const TEST_MUTATION = gql`
      mutation test {
        addCartItems(
          input: {
            clientMutationId: "someID"
            items: [{ productId: 213, quantity: 10 }, { productId: 191, quantity: 10 }]
          }
        ) {
          clientMutationId
          added {
            key
            product {
              node {
                databaseId
              }
            }
            variation {
              node {
                databaseId
              }
            }
            quantity
          }
          cartErrors {
            type
            reasons
            productId
            quantity
            variationId
            variation {
              attributeName
              attributeValue
            }
            extraData
          }
          cart {
            contents {
              nodes {
                key
                quantity
              }
            }
          }
        }
        checkout(input: { paymentMethod: "dotpay" }) {
          clientMutationId
          order {
            cartHash
          }
        }
      }
    `;
    let postData;
    try {
      postData = await apolloClient.mutate({
        mutation: TEST_MUTATION,
      });
    } catch (e) {
      console.log(`[products][getPostBySlug] Failed to query post data: ${e.message}`);
      throw e;
    }

    console.log(postData);
  }
  return (
    <div className="group relative">
      <Image alt="cart icon" src={cartIcon.src} width="30px" className="p-[1rem] " imgTagclassName="border-none" />
      <div className="absolute hidden right-0 w-max  group-hover:block">
        <CartItemsList />

        <div className="flex flex-col gap-[1rem]">
          <div className="bg-lime-500 p-[2rem] rounded-3xl">
            <Link href="/checkout">PROCEED TO CHECKOUT</Link>
          </div>
          <div className="bg-blue-400 p-[2rem]  rounded-3xl">
            <Link href="/cart">VIEW AND EDIT CART</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
