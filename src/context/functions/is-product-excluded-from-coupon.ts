import excludedProductsIds from './excluded-products-ids';

const isProductExcludedFromCoupon = ({ action, product }) => excludedProductsIds(action).includes(product.id);

export default isProductExcludedFromCoupon;
