const clearPrice = ({
  price,
  currency,
  removeSeparator,
}: {
  price: string;
  currency: string;
  removeSeparator?: boolean;
}) => {
  const regex = new RegExp('&nbsp;' + currency, 'g');
  if (removeSeparator) {
    return Number(price.replace(regex, '').replace(/,/g, ''));
  }
  return Number(price.replace(regex, '').replace(/,/g, '.'));
};

export default clearPrice;
