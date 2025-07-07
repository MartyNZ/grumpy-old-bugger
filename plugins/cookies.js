export default defineNuxtPlugin(async (nuxtApp) => {
  const currenciesStore = useCurrenciesStore();
  await currenciesStore.initializeCurrencies();

  const userInfo = useCookie("user-info", {
    default: () => ({
      currency: currenciesStore.selectedCurrency,
    }),
    watch: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  // Update server-side currency state
  await $fetch("/api/currency/set-rates", {
    method: "POST",
    body: userInfo.value?.currency,
  });

  // Make userInfo available globally
  nuxtApp.provide("userInfo", userInfo);
  nuxtApp.provide("currenciesStore", currenciesStore);
});
