const doesCouponMeetGeneralRequirements = (action, state) => {
  if (+state.totalAmount < (action.coupon.minimumAmount ?? 0)) {
    return { valid: false, error: 'Minimum amount not reached' };
  } else if (+state.totalAmount > (action.coupon.maximumAmount ?? Number.MAX_SAFE_INTEGER)) {
    return { valid: false, error: 'Maximum amount exceeded' };
  } else if (Date.now() > Date.parse(action.coupon.dateExpiry)) {
    return { valid: false, error: 'Coupon has expired' };
  } else if (state.appliedCoupon?.some((coupon) => coupon.individualUse === true)) {
    return { valid: false, error: 'Coupon cannot be used with other coupons' };
  } else if (state.appliedCoupon?.some((coupon) => coupon.code === action.coupon.code)) {
    return { valid: false, error: 'Coupon has already been applied' };
  } else return { valid: true };
};

export default doesCouponMeetGeneralRequirements;
