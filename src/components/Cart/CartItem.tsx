import Image from 'components/Image';
import CartContext from 'context/CartContext';
import { getProductBySlug } from 'lib/products';
import { useContext, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import Link from 'next/link';
const CartItem = ({
  id,
  quantity,
  variant,
  slug,
}: {
  id: number;
  quantity: number;
  variant?: string;
  slug: string;
}) => {
  const ctx = useContext(CartContext);
  const [newQuantity, setNewQuantty] = useState(quantity);
  const [productInfo, setProductInfo] = useState(null);
  const inputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (slug) {
      getProductBySlug(slug).then((res) => setProductInfo(res));
    }
  }, []);

  if (variant === 'advanced' && productInfo) {
    const { name, price, image, stockStatus } = productInfo.product;

    const increaseQuantityHandler = () => {
      setNewQuantty(newQuantity + 1);
      ctx.addItem({ id: id, name: name, quantity: 1, price: price });
    };

    const decreaseQuantityHandler = () => {
      setNewQuantty(newQuantity - 1);
      ctx.removeItem(id);
    };

    const inputChangeHandler = () => {
      if (inputRef.current.value.length > 0 && Number(inputRef.current.value) > 0) {
        const inputValue = inputRef.current.value;
        setNewQuantty(Number(inputRef.current.value));

        ctx.changeItemQuantity({ inputValue, id });
      }
    };

    const deleteItemHandler = () => {
      ctx.deleteItem(id);
    };
    return (
      <div className="flex pr-[2rem]  bg-white py-[2rem] gap-[2rem] border-t-[#858585] border-t-[0.1rem]">
        <Image
          srcSet={image?.srcSet}
          alt="product image"
          className="rounded-[1rem] shrink-0"
          imgTagclassName="w-[12rem] h-[16rem] object-cover rounded-[1rem] border-[0.1rem] border-[#858585] border-solid"
        />
        <div className="flex flex-col gap-[1rem] w-full">
          <div className="mt-[2rem] text-[2.1rem] text-[#525252] flex justify-between">
            <Link href={`products/${slug}`}>{`${name}`}</Link>
            <div>{String(price).replace(/&nbsp;/g, '')}</div>
          </div>
          <div className="text-[#858585] flex gap-[2rem] divide-x-[0.1rem]">
            <div>{String(price).replace(/&nbsp;/g, '')}</div>
            {stockStatus === 'OUT_OF_STOCK' ? (
              <div className="text-red-500 font-bold pl-[2rem]">Out In Stock</div>
            ) : stockStatus === 'IN_STOCK' ? (
              <div className="text-green-500 font-bold pl-[2rem]">In Stock</div>
            ) : stockStatus === 'ON_BACKORDER' ? (
              <div className="text-orange-500 font-bold pl-[2rem]">On Backorder</div>
            ) : (
              ''
            )}
          </div>
          <div className="flex  mt-auto justify-between">
            <div className="flex  w-min rounded-[1rem] border-solid border-[0.2rem] border-[#858585]">
              <button className="w-[3rem] pl-[0.2rem]" onClick={decreaseQuantityHandler}>
                <FontAwesomeIcon icon={solid('minus')} />
              </button>
              <input
                type="text"
                value={newQuantity}
                className="w-[3rem] text-center focus:outline-none"
                ref={inputRef}
                onChange={inputChangeHandler}
              ></input>
              <button className="w-[3rem] pr-[0.2rem]" onClick={increaseQuantityHandler}>
                <FontAwesomeIcon icon={solid('plus')} />
              </button>
            </div>
            <div className="flex items-center divide-x gap-[2rem]">
              <div>
                <FontAwesomeIcon icon={solid('heart')} /> Save
              </div>
              <button className="pl-[2rem]" onClick={deleteItemHandler}>
                <FontAwesomeIcon icon={solid('trash')} /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (productInfo) {
    const { name, price, image, stockStatus } = productInfo.product;

    return (
      <div className="flex px-[2rem] py-[1rem] rounded-[1.5rem] bg-slate-400 mb-[1rem] gap-[2rem]">
        <Image srcSet={image?.srcSet} width="75" height="75" alt="product image" />
        <div className="flex flex-col ">
          <div>{`${name}`}</div>
          <div>{`${quantity} x ${'price'}`}</div>
        </div>
      </div>
    );
  }
};
export default CartItem;
