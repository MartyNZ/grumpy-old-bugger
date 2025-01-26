export const usePriceCalculations = () => {
  const calculatePrices = (variant, currency, quantity, promo) => {
    const itemPrice = ((variant.price / 100) * currency.rate).toFixed(2);
    const totalPrice = (itemPrice * quantity).toFixed(2);
    const discountedPrice = promo
      ? (totalPrice * ((100 - promo.discount) / 100)).toFixed(2)
      : 0;
    return { itemPrice, totalPrice, discountedPrice };
  };
  return { calculatePrices };
};
