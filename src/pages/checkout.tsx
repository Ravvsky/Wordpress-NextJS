import Button from 'components/Button';
import Container from 'components/Container';
import Input from 'components/Input';
import Label from 'components/Label';
import Layout from 'components/Layout';
import Section from 'components/Section';
import CartContext from 'context/CartContext';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { availableShippingMethods, checkoutOrder, createCart } from 'lib/orders';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import BillingForm from 'components/CheckoutForms/BillingForm/BillingForm';
import DeliveryForm from 'components/CheckoutForms/DeliveryForm.tsx/DeliveryForm';

const CheckOutPage = () => {
  const router = useRouter();
  const ctx = useContext(CartContext);

  const [personalForm, setPersonalForm] = useState();
  const billingDataHandler = (data) => {
    setPersonalForm(data);
  };

  const [deliveryForm, setDeliveryForm] = useState();
  const deliveryDataHandler = (data) => {
    if (data) {
      setDeliveryForm(data);
    }
  };
  const [checkboxValue, setCheckboxValue] = useState(false);
  const checkboxValueHandler = (data) => {
    setCheckboxValue(data);
  };

  const [step, setStep] = useState('');
  const [shippingMethods, setShippingMethods] = useState([{}]);
  const [choosenShippingMethod, setChoosenShippingMethod] = useState('');
  useEffect(() => {
    setStep(router.query.step || ''), [];
    const cartProducts: { productId: number; quantity: number }[] = ctx.items.map(({ id, quantity }) => ({
      productId: id,
      quantity,
    }));

    const cartCoupons: string[] = ctx.appliedCoupon.map(({ code }) => code);
    createCart(cartProducts, cartCoupons).then(() => {
      availableShippingMethods().then((res) => setShippingMethods(res.cart.cart.availableShippingMethods[0].rates));
    });
  }, [ctx.appliedCoupon, ctx.items, router.query.step]);

  const validationSchema = Yup.object({
    firstName: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
    lastName: Yup.string().max(20, 'Must be 20 characters or less').required('Required'),
  });

  const checkoutOrderHandler = () => {
    const checkoutOrderData = {
      customerNote: personalForm.customerNote,
      billing: {
        address1: personalForm.address,
        address2: personalForm.secondAddress,
        city: personalForm.city,
        company: personalForm.company,
        country: personalForm.country,
        email: personalForm.email,
        firstName: personalForm.firstName,
        lastName: personalForm.lastName,
        overwrite: true,
        phone: personalForm.phone,
        postcode: personalForm.postalCode,
        state: personalForm.state,
      },
      shippingMethod: [choosenShippingMethod],
      shipToDifferentAddress: checkboxValue,
      shipping: deliveryForm
        ? {
            address1: deliveryForm.address,
            address2: deliveryForm.secondAddress,
            city: deliveryForm.city,
            company: deliveryForm.company,
            country: deliveryForm.country,
            email: deliveryForm.email,
            firstName: deliveryForm.firstName,
            lastName: deliveryForm.lastName,
            overwrite: true,
            phone: deliveryForm.phone,
            postcode: deliveryForm.postalCode,
            state: deliveryForm.state,
          }
        : {},
    };
    checkoutOrder(checkoutOrderData).then((res) => {
      router.push(`/payment?order=${res.cart.checkout.order.id}&orderId=${res.cart.checkout.order.databaseId}`);
    });
  };

  return (
    <Layout>
      <Section className="bg-[#ffffff]">
        <Container>
          <div className="flex">
            <div className="flex flex-col p-[2rem]  gap-[2rem]">
              <section>
                <h2>{step === 'delivery' ? 'Delivery informations' : 'Personal details'}</h2>
                <span>If you alread have an account Sign in here</span>
                {step === '' && <BillingForm personalForm={billingDataHandler} checkboxValue={checkboxValueHandler} />}
                {step === 'delivery' && checkboxValue && <DeliveryForm deliveryForm={deliveryDataHandler} />}
                {step === 'delivery' && shippingMethods && (
                  <div className="flex flex-col">
                    {shippingMethods.map((shippingMethod, index) => {
                      return (
                        <Button
                          type="button"
                          key={index}
                          className="text-black"
                          onClick={() => {
                            setChoosenShippingMethod(shippingMethod.id);
                          }}
                        >{`${shippingMethod.label} ${shippingMethod.cost} zł`}</Button>
                      );
                    })}
                    <Button type="button" className={undefined} onClick={checkoutOrderHandler}>
                      Go to payment
                    </Button>
                  </div>
                )}
              </section>
            </div>
            <div className="bg-[#383838] w-full px-[2rem]"> s</div>
          </div>
        </Container>
      </Section>
    </Layout>
  );
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default CheckOutPage;
