import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import CheckoutForm from 'components/CheckoutForm';
import Layout from 'components/Layout';
import Container from 'components/Container';
import { GetServerSideProps } from 'next';
import clearPrice from 'context/functions/clear-price';
import { orderTotalAmount } from 'lib/orders';
import { useRouter } from 'next/router';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Payment(props) {
  const [clientSecret, setClientSecret] = React.useState('');
  const [price, setPrice] = useState(0);
  const router = useRouter();

  React.useEffect(() => {
    console.log(props.orderDatabaseId);
    if (props.orderId) {
      orderTotalAmount(props.orderId).then((res) =>
        setPrice(clearPrice({ price: res.cartData.data.order.total, currency: 'zł' }))
      );

      // Create PaymentIntent as soon as the page loads
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: [{ id: props.orderId }] }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    } else {
      // router.push('/cart');
    }
  }, [props.orderId]);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="App">
      <Layout>
        <Container>
          {props.orderId && clientSecret && (
            <div className="flex py-[2rem]">
              <section className="w-full">
                <h2 className="mb-[2rem]">Payment</h2>
                <Elements options={options} stripe={stripePromise}>
                  {props.orderId && (
                    <CheckoutForm price={price} orderId={props.orderId} orderDatabaseId={props.orderDatabaseId} />
                  )}
                </Elements>
              </section>
              <section className="w-full"></section>
            </div>
          )}
        </Container>
      </Layout>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const orderId = context.query.order;
  const orderDatabaseId = context.query.orderId;
  return { props: { orderId: orderId || null, orderDatabaseId: orderDatabaseId || null } };
};
