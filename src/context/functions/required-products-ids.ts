const requiredProductsIds = (action) => {
  return action.coupon.products.edges.map((edge) => edge.node.databaseId);
};
export default requiredProductsIds;
