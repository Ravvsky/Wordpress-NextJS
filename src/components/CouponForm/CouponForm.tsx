import CartContext from 'context/CartContext';
import { getCouponCode } from 'lib/products';
import { useContext, useEffect, useState } from 'react';

const CouponForm = () => {
  const [couponData, setCouponData] = useState(null);
  const [error, setError] = useState('');
  const [inputValue, setInputValue] = useState('');
  const ctx = useContext(CartContext);
  const couponFormHandler = async (event) => {
    event.preventDefault();
    const coupon = await getCouponCode(event.target[0].value);

    if (coupon.error) {
      setError(coupon.error);
      setCouponData(null);
    } else {
      setCouponData(coupon.coupon);
      setError('');
      ctx.applyCoupon(coupon.coupon);
    }
  };

  useEffect(() => {
    setError(ctx.error);
  }, [ctx.error]);

  const changeHandler = (event) => {
    setInputValue(event.target.value);
  };

  const removeCouponHandler = (coupon) => {
    const couponRemoveData = {
      code: coupon.code,
      discountType: coupon.discountType,
    };

    ctx.removeCoupon(couponRemoveData);
  };
  return (
    <form className="flex flex-col " onSubmit={couponFormHandler}>
      <label htmlFor="coupon">Promocode</label>
      <div className="flex ">
        <input
          type="text"
          name="coupon"
          placeholder="Promocode"
          className="border-[0.1rem] rounded-l-3xl border-[#E8E8E8] w-full"
          onChange={changeHandler}
          value={inputValue}
        ></input>
        <button type="submit" className="border-[0.1rem] border-l-0 rounded-r-3xl border-[#E8E8E8] px-[2rem]">
          Apply
        </button>
      </div>
      <div className="flex flex-col">
        {error && error}
        {ctx.appliedCoupon?.length > 0 && <p>Applied Coupons:</p> &&
          ctx.appliedCoupon.map((coupon, index) => (
            <div key={index} className="flex flex-row justify-between">
              {coupon.description || coupon.code}
              <button type="button" onClick={() => removeCouponHandler(coupon)}>
                REMOVE
              </button>
            </div>
          ))}
      </div>
    </form>
  );
};

export default CouponForm;
