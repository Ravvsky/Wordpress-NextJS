import CartContext from 'context/CartContext';
import { useContext } from 'react';
import CartItem from './CartItem';

const CarrItemsList = (props) => {
  const ctx = useContext(CartContext);

  return (
    <>
      {ctx.items &&
        ctx.items.map((item, index) => {
          return (
            <CartItem
              key={index}
              quantity={item.quantity}
              variant={props.variant}
              id={item.id}
              slug={item.slug}
            ></CartItem>
          );
        })}
    </>
  );
};

export default CarrItemsList;
