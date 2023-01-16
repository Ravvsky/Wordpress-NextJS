const cartProductsCategoriesIds = (items) => {
  return items.flatMap((item) => item.productCategories.edges.map((edge) => edge.node.databaseId));
};

export default cartProductsCategoriesIds;
