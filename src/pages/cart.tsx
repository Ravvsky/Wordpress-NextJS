import CartItemsList from 'components/Cart/CartItemsList';
import Container from 'components/Container';
import CouponForm from 'components/CouponForm';
import Layout from 'components/Layout';
import Section from 'components/Section';
import CartContext from 'context/CartContext';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';

const CartPage = () => {
  const ctx = useContext(CartContext);
  const [totalAmount, setTotalAmount] = useState(0);
  useEffect(() => {
    setTotalAmount(ctx.totalAmount);
  }, [ctx.totalAmount]);

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
              <div className="flex justify-between text-[2rem]">
                <span>Total</span> <span>{totalAmount} zł</span>
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
