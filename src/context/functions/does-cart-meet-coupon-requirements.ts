import cartProductsCategoriesIds from './cart-products-categories-ids';
import excludedProductCategoriesIds from './excluded-product-categories-ids';
import isProductExcludedFromCoupon from './is-product-excluded-from-coupon';
import requiredProductCategoriesIds from './required-product-categories-ids';
import requiredProductsIds from './required-products-ids';

const doesCartMeetCouponRequirements = (state, action) => {
  const isProductCategoryExcludedFromCoupon = (productCategory) =>
    excludedProductCategoriesIds(action).includes(productCategory);

  const hasRequiredProduct = (productId) => state.items.some((obj) => obj.id === productId);

  const hasRequiredProducts = () => requiredProductsIds(action).length > 0;

  const hasRequiredProductCategories = () => requiredProductCategoriesIds(action).length > 0;

  const hasRequiredProductCategoriesInCart = () =>
    requiredProductCategoriesIds(action).every((val) => cartProductsCategoriesIds(state.items).includes(val));

  const hasRequiredProductsInCart = () => requiredProductsIds(action).every(hasRequiredProduct);

  const result = {
    error: '',
    valid: true,
  };

  if (
    state.items.some((item) => isProductExcludedFromCoupon({ action: action, product: item })) ||
    cartProductsCategoriesIds(state.items).some(isProductCategoryExcludedFromCoupon)
  ) {
    result.error = 'One or more products in your cart are excluded from this coupon.';
    result.valid = false;
  } else if (hasRequiredProducts() || hasRequiredProductCategories()) {
    if (!hasRequiredProductCategoriesInCart() || !hasRequiredProductsInCart()) {
      result.error = '';
      result.valid = false;
    }
  }
  return result;
};

export default doesCartMeetCouponRequirements;
