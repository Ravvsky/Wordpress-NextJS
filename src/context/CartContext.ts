import React from 'react';

const CartContext = React.createContext({
  items: [],
  totalAmount: 0,
  appliedCoupon: [],
  error: '',
  addItem: (item) => {},
  removeItem: (id) => {},
  changeItemQuantity: (item) => {},
  deleteItem: (id) => {},
  applyCoupon: (coupon) => {},
  removeCoupon: (coupon) => {},
});

export default CartContext;
