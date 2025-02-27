export default defineNuxtPlugin(async (nuxtApp) => {
  const currenciesStore = useCurrenciesStore();
  const userInfo = useCookie("user-info");

  await currenciesStore.initializeCurrencies();

  // console.log("Currency being stored:", userInfo.value?.currency);

  // If the cookie doesn't exist, create it using the store's default currency
  if (!userInfo.value) {
    userInfo.value = {
      currency: currenciesStore.selectedCurrency,
    };
  }

  // Update server-side currency state
  await $fetch("/api/currency/set-rates", {
    method: "POST",
    body: userInfo.value?.currency,
  });

  nuxtApp.provide("currenciesStore", currenciesStore);
});
