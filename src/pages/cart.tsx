import getCountryByCords from 'api/getCountryByCords';
import CartItemsList from 'components/Cart/CartItemsList';
import Container from 'components/Container';
import CouponForm from 'components/CouponForm';
import Layout from 'components/Layout';
import Section from 'components/Section';
import CartContext from 'context/CartContext';
import { availableShippingMethods, createCart, updateCustomer } from 'lib/orders';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';

const CartPage = () => {
  const ctx = useContext(CartContext);
  const [totalAmount, setTotalAmount] = useState(0);
  const [location, setLocation] = useState('');
  const [shippingCost, setShippingCost] = useState();
  useEffect(() => {
    setTotalAmount(ctx.totalAmount);
  }, [ctx.totalAmount]);

  useEffect(() => {
    getCountryByCords()
      .then((response) => {
        if (response && response.address) {
          setLocation(response.address.country_code.toUpperCase());
        }
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (location) {
      const cartProducts: { productId: number; quantity: number }[] = ctx.items.map(({ id, quantity }) => ({
        productId: id,
        quantity,
      }));

      const cartCoupons: string[] = ctx.appliedCoupon.map(({ code }) => code);
      createCart(cartProducts, cartCoupons).then(() => {
        updateCustomer(location).then(() =>
          availableShippingMethods().then((res) => {
            const shippingMethods = res.cart.cart.availableShippingMethods[0].rates;
            const cheapestShippingMethod = [...shippingMethods]
              .sort((a, b) => parseInt(a.cost) - parseInt(b.cost))
              .find((shippingMethod) => parseInt(shippingMethod.cost) > 0);
            setShippingCost(cheapestShippingMethod.cost);
          })
        );
      });
    }
  }, [location]);
  return (
    <Layout>
      <Section className="bg-[#E8E8E8]">
        <Container>
          <div className="flex gap-[2rem]  ">
            <div className="basis-2/3 bg-white rounded-[2rem] p-[2rem]">
              <h2 className="pb-[2rem]">Cart</h2>
              <CartItemsList variant="advanced" />
            </div>
            <div className="basis-1/3 bg-white rounded-[2rem] p-[2rem] flex flex-col">
              <h2>Delivery</h2>
              <div className="flex flex-col justify-between text-[2rem]">
                <div className="flex  justify-between">
                  <span>Subtotal:</span> <span>{totalAmount} zł</span>
                </div>
                <div className="flex  justify-between">
                  <span>Shipping:</span> <span>{shippingCost} zł</span>
                </div>
                <div className="flex  justify-between">
                  <span>Total:</span> <span>{(+totalAmount + +(shippingCost || 0)).toFixed(2)} zł</span>
                </div>
              </div>
              <CouponForm />
              <div className="flex flex-col gap-[1rem] mt-auto">
                <Link href="/checkout">
                  <a className="bg-blue-400 p-[2rem]  rounded-3xl text-center text-stone-200">Proceed to checkout</a>
                </Link>
                <Link href="/">
                  <a className="bg-white-400 p-[2rem] border-[0.1rem] border-[#E8E8E8] rounded-3xl text-center">
                    Continue shopping
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </Layout>
  );
};

export async function getStaticProps() {
  return {
    props: {},
  };
}

export default CartPage;
