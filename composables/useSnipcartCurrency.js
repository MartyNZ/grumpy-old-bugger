export const useSnipcartCurrency = () => {
  const snipcart = ref(null);

  const initializeSnipcart = (currency) => {
    // If Snipcart is already loaded, set currency immediately
    if (window.Snipcart) {
      snipcart.value = window.Snipcart;
      snipcart.value.api.session.setCurrency(currency.code);
      // console.log(
      //   "Direct currency set:",
      //   snipcart.value?.store.getState().cart.currency
      // );
      return;
    }

    // Fallback to event listener if Snipcart isn't loaded yet
    document.addEventListener("snipcart.ready", () => {
      snipcart.value = window.Snipcart;
      snipcart.value.api.session.setCurrency(currency.code);
      // console.log(
      //   "Event currency set:",
      //   snipcart.value?.store.getState().cart.currency
      // );
    });
  };

  const updateCartCurrency = async (newCurrency, cartState, basePrice) => {
    if (!snipcart.value) return;

    // Batch all updates
    const updates = [];

    // Set currency first
    updates.push(snipcart.value.api.session.setCurrency(newCurrency.code));

    // Queue item updates
    const items = cartState.items;
    if (items && items.length > 0) {
      for (const item of items) {
        const updatedPrice = (item.price * newCurrency.rate).toFixed(2);
        updates.push(
          snipcart.value.api.cart.items.update(item.uniqueId, {
            price: updatedPrice,
          })
        );
      }
    }

    // Execute all updates at once
    await Promise.all(updates);
  };
  return {
    snipcart,
    initializeSnipcart,
    updateCartCurrency,
  };
};
