export const useSnipcartCurrency = () => {
  const snipcart = ref(null);

  const initializeSnipcart = (currency) => {
    // If Snipcart is already loaded, set currency immediately
    if (window.Snipcart) {
      snipcart.value = window.Snipcart;
      snipcart.value.api.session.setCurrency(currency.code);
      console.log(
        "Direct currency set:",
        snipcart.value?.store.getState().cart.currency
      );
      return;
    }

    // Fallback to event listener if Snipcart isn't loaded yet
    document.addEventListener("snipcart.ready", () => {
      snipcart.value = window.Snipcart;
      snipcart.value.api.session.setCurrency(currency.code);
      console.log(
        "Event currency set:",
        snipcart.value?.store.getState().cart.currency
      );
    });
  };

  const updateCartCurrency = async (newCurrency, cartState, basePrice) => {
    if (!snipcart.value) return;

    console.log("Starting currency update with:", newCurrency.code);

    // Set currency first
    await snipcart.value.api.session.setCurrency(newCurrency.code);

    // Get fresh cart state after currency update
    const updatedCartState = snipcart.value.store.getState().cart;
    console.log("Cart state after currency update:", updatedCartState);

    const items = updatedCartState.items;
    if (items && items.length > 0) {
      for (const item of items) {
        const updatedPrice = (item.price * newCurrency.rate).toFixed(2);
        await snipcart.value.api.cart.items.update(item.uniqueId, {
          price: updatedPrice,
        });
      }
    }
  };
  return {
    snipcart,
    initializeSnipcart,
    updateCartCurrency,
  };
};
