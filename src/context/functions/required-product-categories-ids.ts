const requiredProductCategoriesIds = (action) => {
  return action.coupon.productCategories.edges.map((edge) => edge.node.databaseId);
};

export default requiredProductCategoriesIds;
