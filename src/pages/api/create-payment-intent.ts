// This is your test secret API key.
import clearPrice from 'context/functions/clear-price';
import { orderTotalAmount } from 'lib/orders';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const calculateOrderAmount = async (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  const res = await orderTotalAmount(items);
  return clearPrice({ price: res.cartData.data.order.total, currency: 'zł', removeSeparator: true });
};

export default async function handler(req, res) {
  const { order } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: await calculateOrderAmount(order[0].id),
    currency: 'pln',
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
}
