const excludedProductsIds = (action) => {
  return action.coupon.excludedProducts.edges.map((edge) => edge.node.databaseId);
};

export default excludedProductsIds;
