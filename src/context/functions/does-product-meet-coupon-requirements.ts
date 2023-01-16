import excludedProductCategoriesIds from './excluded-product-categories-ids';
import isProductExcludedFromCoupon from './is-product-excluded-from-coupon';

const doesProductMeetCouponRequirements = (action, product) => {
  if (isProductExcludedFromCoupon({ action, product }))
    return { valid: false, message: 'Error: Product is excluded from coupon' };

  const excludedCategoriesIds = excludedProductCategoriesIds(action);
  if (product.productCategories.edges.some((item) => excludedCategoriesIds.includes(item.node.databaseId))) {
    return { valid: false, message: 'Error: Product belongs to an excluded category' };
  }

  if (action.coupon.excludeSaleItems && product.onSale) {
    return { valid: false, message: 'Error: Product is on sale and coupon excludes sale items' };
  }

  if (action.coupon.products.edges.length > 0 && !action.coupon.products.edges.includes(product.id)) {
    return { valid: false, message: 'Error: Product is not included in coupon' };
  }

  if (action.coupon.productCategories.edges.length > 0) {
    const allowedCategoriesIds = action.coupon.productCategories.edges.map((item) => item.node.databaseId);
    if (product.productCategories.edges.some((item) => !allowedCategoriesIds.includes(item.node.databaseId))) {
      return { valid: false, message: 'Error: Product does not belong to an allowed category' };
    }
  }

  return { valid: true };
};

export default doesProductMeetCouponRequirements;
