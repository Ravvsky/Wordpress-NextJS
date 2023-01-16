const excludedProductCategoriesIds = (action) => {
  return action.coupon.excludedProductCategories.edges.map((edge) => edge.node.databaseId);
};

export default excludedProductCategoriesIds;
