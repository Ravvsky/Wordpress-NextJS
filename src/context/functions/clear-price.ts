const clearPrice = ({ price, currency }: { price: string; currency: string }) => {
  const regex = new RegExp('&nbsp;' + currency, 'g');

  return Number(price.replace(regex, '').replace(/,/g, '.'));
};

export default clearPrice;
