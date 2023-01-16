import { useReducer, useEffect } from 'react';
import CartContext from './CartContext';
import clearPrice from './functions/clear-price';

import doesCartMeetCouponRequirements from './functions/does-cart-meet-coupon-requirements';

import doesProductMeetCouponRequirements from './functions/does-product-meet-coupon-requirements';
import doesCouponMeetGeneralRequirements from './functions/does-coupon-meet-general-requirements';
const defaultCartState = {
  items: [],
  totalAmount: 0,
  error: '',
  appliedCoupon: [],
};

const cartReducer = (state, action) => {
  if (action.type === 'ADD') {
    const existingCartItemIndex = state.items.findIndex((item) => item.id === action.item.id);
    const existingCartItem = state.items[existingCartItemIndex];

    const price = clearPrice(
      (existingCartItem && { price: existingCartItem.price, currency: 'zł' }) || {
        price: action.item.price,
        currency: 'zł',
      }
    );

    console.log(existingCartItem);

    const updatedTotalAmount = Number(state.totalAmount) + price * action.item.quantity;
    const appliedCoupon =
      state.appliedCoupon && action.coupon
        ? [...state.appliedCoupon, action.coupon]
        : state.appliedCoupon
        ? [...state.appliedCoupon]
        : action.coupon
        ? [action.coupon]
        : [];

    let updatedItems;

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + action.item.quantity,
      };

      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems = state.items.concat(action.item);
    }
    const updatedCart = {
      items: updatedItems,
      totalAmount: updatedTotalAmount.toFixed(2),
      appliedCoupon: appliedCoupon,
    };
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    return updatedCart;
  }

  if (action.type === 'REMOVE') {
    const existingCartItemIndex = state.items.findIndex((item) => item.id === action.id);
    const existingItem = state.items[existingCartItemIndex];

    const clearPrice = Number(existingItem.price.replace(/&nbsp;zł/g, '').replace(/,/g, '.'));

    const updatedTotalAmount = Number(state.totalAmount) - clearPrice;

    let updatedItems;
    if (existingItem.quantity === 1) {
      updatedItems = state.items.filter((item) => item.id !== action.id);
    } else {
      const updatedItem = { ...existingItem, quantity: existingItem.quantity - 1 };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    }
    const updatedCart = {
      items: updatedItems,
      totalAmount: updatedTotalAmount.toFixed(2),
    };
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    return updatedCart;
  }

  if (action.type === 'CHANGE_QUANTITY') {
    const existingCartItemIndex = state.items.findIndex((item) => item.id === action.item.id);
    const existingItem = state.items[existingCartItemIndex];
    let updatedItems;

    const updatedItem = { ...existingItem, quantity: action.item.inputValue };
    updatedItems = [...state.items];
    updatedItems[existingCartItemIndex] = updatedItem;
    const clearPrice = Number(existingItem.price.replace(/&nbsp;zł/g, '').replace(/,/g, '.'));
    const deletedAmount = clearPrice * existingItem.quantity;
    const updatedTotalAmount = Number(state.totalAmount) - deletedAmount + action.item.inputValue * clearPrice;
    const updatedCart = {
      items: updatedItems,
      totalAmount: updatedTotalAmount.toFixed(2),
    };
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    return updatedCart;
  }

  if (action.type === 'DELETE') {
    let updatedItems;
    updatedItems = state.items.filter((item) => item.id !== action.id);
    const existingCartItemIndex = state.items.findIndex((item) => item.id === action.id);
    const existingItem = state.items[existingCartItemIndex];
    const deletedAmount =
      Number(existingItem.price.replace(/&nbsp;zł/g, '').replace(/,/g, '.')) * existingItem.quantity;
    const updatedTotalAmount = state.totalAmount - deletedAmount;

    const updatedCart = {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    return updatedCart;
  }

  if (action.type === 'APPLY_COUPON') {
    let updatedItems = [];
    let updatedTotalAmount = 0;
    let error = '';
    let couponApplied = false;
    const totalAmountBeforeCoupon = state.totalAmount;

    if (doesCouponMeetGeneralRequirements(action, state).valid === false) {
      error = doesCouponMeetGeneralRequirements(action, state).error;
      const updatedCart = { ...state };
      updatedCart.error = error;
      updatedCart.appliedCoupon = [...state.appliedCoupon];

      return updatedCart;
    }
    if (action.coupon.discountType === 'PERCENT' || action.coupon.discountType === 'FIXED_PRODUCT') {
      for (let i = 0; i < state.items.length; i++) {
        const product = state.items[i];
        const productCouponValidity = doesProductMeetCouponRequirements(action, product);
        if (productCouponValidity.valid === false) {
          updatedItems.push(product);
          updatedTotalAmount += clearPrice({ price: product.price, currency: 'zł' }) * product.quantity;
          error = productCouponValidity.message;
          continue;
        }

        const price = clearPrice({ price: product.price, currency: 'zł' });
        product.appliedCoupon = product.appliedCoupon ? [...product.appliedCoupon, action.coupon] : [action.coupon];
        let priceAfterCoupon;
        switch (action.coupon.discountType) {
          case 'PERCENT':
            priceAfterCoupon = price - (action.coupon.amount / 100) * price;
            break;
          case 'FIXED_PRODUCT':
            priceAfterCoupon = price - action.coupon.amount;
            break;
        }

        product.price = (priceAfterCoupon.toFixed(2) + '&nbsp;zł').replace(/\./g, ',');

        updatedItems.push(product);
        updatedTotalAmount = updatedTotalAmount + priceAfterCoupon * product.quantity;
        couponApplied = true;
      }
    }

    if (action.coupon.discountType === 'FIXED_CART') {
      const cartCouponValidity = doesCartMeetCouponRequirements(state, action);
      if (cartCouponValidity.valid === false) {
        const updatedCart = {
          items: state.items,
          totalAmount: state.totalAmount,
          appliedCoupon: [...state.appliedCoupon],
          error: cartCouponValidity.error,
        };
        localStorage.setItem('cart', JSON.stringify(updatedCart));

        return updatedCart;
      }
      updatedItems = state.items;
      updatedTotalAmount = +state.totalAmount - action.coupon.amount;
      couponApplied = true;
    }
    const discountedAmount = (+totalAmountBeforeCoupon - updatedTotalAmount).toFixed(2);
    let appliedCoupon;
    if (couponApplied) {
      const actionCoupon = { ...action.coupon };
      actionCoupon.discountedAmount = discountedAmount;
      appliedCoupon = [...state.appliedCoupon, actionCoupon];
    } else {
      appliedCoupon = [...state.appliedCoupon];
    }

    const updatedCart = {
      items: updatedItems,
      totalAmount: updatedTotalAmount.toFixed(2),
      appliedCoupon: appliedCoupon,
      error: error,
    };
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    return updatedCart;
  }
  if (action.type === 'REMOVE_COUPON') {
    const appliedCoupon = state.appliedCoupon.find((coupon) => {
      return coupon.code === action.coupon.code;
    });
    const appliedCouponIndex = state.appliedCoupon.findIndex((coupon) => {
      return coupon.code === action.coupon.code;
    });
    const updatedCart = { ...state };
    updatedCart.appliedCoupon.splice(appliedCouponIndex, appliedCouponIndex + 1);
    if (action.coupon.discountType === 'PERCENT' || action.coupon.discountType === 'FIXED_PRODUCT') {
      const productsWithAppliedCoupon = state.items.filter(
        (item) => item.appliedCoupon.filter((coupon) => coupon.code === action.coupon.code).length > 0
      );

      const couponAmount = appliedCoupon.amount;

      productsWithAppliedCoupon.map((product) => {
        const price = clearPrice({ price: product.price, currency: 'zł' });
        product.price =
          action.coupon.discountType === 'PERCENT' ? price / (1 - couponAmount / 100) : price + couponAmount;
        product.price = (product.price.toFixed(2) + '&nbsp;zł').replace(/\./g, ',');
        return product;
      });
      state.totalAmount = (+state.totalAmount + +appliedCoupon.discountedAmount).toFixed(2);
      localStorage.setItem('cart', JSON.stringify({ ...state }));

      return { ...state };
    } else {
      updatedCart.totalAmount = (+updatedCart.totalAmount + +appliedCoupon.discountedAmount).toFixed(2);
      localStorage.setItem('cart', JSON.stringify(updatedCart));

      return updatedCart;
    }
  }
  if (action.type === 'INITIAL') {
    return {
      items: action.item.items,
      totalAmount: action.item.totalAmount,
      appliedCoupon: action.item.appliedCoupon || [],
      error: action.item.error || '',
    };
  }
  return defaultCartState;
};

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(cartReducer, defaultCartState);

  useEffect(() => {
    if (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('cart'))) {
      dispatchCartAction({ type: 'INITIAL', item: JSON.parse(localStorage.getItem('cart')) });
    }
  }, []);

  const addItemHandler = (item) => {
    dispatchCartAction({ type: 'ADD', item: item });
  };

  const removeItemHandler = (id) => {
    dispatchCartAction({ type: 'REMOVE', id: id });
  };

  const changeItemQuantityHandler = (item) => {
    dispatchCartAction({ type: 'CHANGE_QUANTITY', item: item });
  };

  const deleteItemHandler = (id) => {
    dispatchCartAction({ type: 'DELETE', id: id });
  };

  const applyCoupon = (coupon) => {
    dispatchCartAction({ type: 'APPLY_COUPON', coupon: coupon });
  };

  const removeCoupon = (coupon) => {
    dispatchCartAction({ type: 'REMOVE_COUPON', coupon: coupon });
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    error: cartState.error,
    appliedCoupon: cartState.appliedCoupon,
    addItem: addItemHandler,
    removeItem: removeItemHandler,
    changeItemQuantity: changeItemQuantityHandler,
    deleteItem: deleteItemHandler,
    applyCoupon: applyCoupon,
    removeCoupon: removeCoupon,
  };
  return <CartContext.Provider value={cartContext}>{props.children}</CartContext.Provider>;
};

export default CartProvider;
