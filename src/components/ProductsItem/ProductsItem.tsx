import Image from 'components/Image';

const ProductsItem = ({ data, ...rest }) => {
  const { uri, name, onSale, regularPrice, price, image, galleryImages, type, shortDescription: description } = data;
  return (
    <a href={uri} className="flex justify-center flex-col" {...rest}>
      <Image data={{ image, galleryImages }} width="175px" squared noUI alt="" />
      <div className="flex flex-col h-[17.5rem] w-[17.5rem] items-center">
        <div className="product-name">
          {onSale && (
            <>
              <span className="badge">On Sale</span>
              <br />
            </>
          )}
          {name}
          {description && (
            <>
              <br />
              {/* {parse(description, {
                replace({ name, children }) {
                  if (name === 'p') {
                    return <small>{domToReact(children)}</small>;
                  }
                },
              })} */}

              {description}
            </>
          )}
          {/* <Price type={type} onSale={onSale} price={price} regularPrice={regularPrice} /> */}
        </div>
      </div>
    </a>
  );
};

export default ProductsItem;
