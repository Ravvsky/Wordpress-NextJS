import Button from 'components/Button';
import Input from 'components/Input';
import Label from 'components/Label';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Link from 'next/link';
import deliveryFormInitialValues from './initialValues';
import deliveryValidationSchema from './validationSchema';
import countries from 'countries-list';

import { useContext, useEffect, useState } from 'react';
import { createCart, updateCustomer } from 'lib/orders';
import { useRouter } from 'next/router';
import CartContext from 'context/CartContext';
const DeliveryForm = (props) => {
  const router = useRouter();
  const ctx = useContext(CartContext);

  const [country, setCountry] = useState('');
  const [deliveryForm, setDeliveryForm] = useState();

  const allCountries = countries.countries;
  const options = Object.entries(allCountries).map(([key, country]) => (
    <option key={key} value={key}>
      {country.native}
    </option>
  ));

  const submitHandler = (values) => {
    const cartProducts: { productId: number; quantity: number }[] = ctx.items.map(({ id, quantity }) => ({
      productId: id,
      quantity,
    }));

    const cartCoupons: string[] = ctx.appliedCoupon.map(({ code }) => code);

    setDeliveryForm(values);
    // router.push('/checkout?step=delivery', undefined, { shallow: true });
    // createCart(cartProducts, cartCoupons);
  };

  const countryFieldChangeHandler = (e) => {
    updateCustomer(e.target.value);
    setCountry(e.target.value);
  };

  useEffect(() => {
    props.deliveryForm(deliveryForm);
  }, [deliveryForm, props]);
  return (
    <Formik
      initialValues={deliveryFormInitialValues}
      onSubmit={submitHandler}
      validationSchema={deliveryValidationSchema}
    >
      <Form className="flex flex-col gap-[2rem] mt-[2rem]">
        <div className="flex justify-between gap-[2rem]">
          <div className="flex flex-col w-full">
            <Label htmlFor="firstName">First name</Label>
            <Field name="firstName" type="text" component={Input} />
            <ErrorMessage name="firstName" />
          </div>
          <div className="flex flex-col w-full">
            <Label htmlFor="lastName">First name</Label>
            <Field name="lastName" type="text" component={Input} />
            <ErrorMessage name="lastName" />
          </div>
        </div>
        <div className="flex flex-col">
          <Label htmlFor="address">Address</Label>
          <Field name="address" type="text" component={Input} />
          <ErrorMessage name="address" />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="secondAddress">Address second line</Label>
          <Field name="secondAddress" type="text" component={Input} />
          <ErrorMessage name="secondAddress" />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="city">City</Label>
          <Field name="city" type="text" component={Input} />
          <ErrorMessage name="city" />
        </div>
        <div className="flex  gap-[2rem]">
          <div className="flex flex-col">
            <Label htmlFor="country">Country</Label>
            <Field
              name="country"
              type="text"
              as="select"
              onChange={(val) => {
                countryFieldChangeHandler(val);
              }}
              value={country}
            >
              {options}
            </Field>
            <ErrorMessage name="country" />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="state">State</Label>
            <Field name="state" type="text" component={Input} />
            <ErrorMessage name="state" />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Field name="postalCode" type="text" component={Input} />
            <ErrorMessage name="postalCode" />
          </div>
        </div>
        <div className="flex flex-col">
          <Label htmlFor="email">E-mail</Label>
          <Field name="email" type="text" component={Input} />
          <ErrorMessage name="email" />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="phone">Phone</Label>
          <Field name="phone" type="text" component={Input} />
          <ErrorMessage name="phone" />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="company">Company</Label>
          <Field name="company" type="text" component={Input} />
          <ErrorMessage name="company" />
        </div>

        <div className="flex flex-col"></div>
        <div className="flex justify-between">
          <Link href="/checkout?step=delivery">
            <Button
              className="bg-gray-400 hover:bg-gray-600 transition ease-in-out duration-200 p-[2rem] rounded-3xl"
              type="button"
            >
              Back to cart
            </Button>
          </Link>
          <Button
            className="bg-gray-400 hover:bg-gray-600 transition ease-in-out duration-200 p-[2rem] rounded-3xl"
            type="submit"
          >
            Continue to delivery
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export default DeliveryForm;
