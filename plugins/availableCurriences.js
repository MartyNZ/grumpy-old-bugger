/* get global page data on start */
export default defineNuxtPlugin(async (nuxtApp) => {
  const currenciesStore = useCurrenciesStore();
  await currenciesStore.initializeCurrencies();

  // Add all the stores to the Nuxt context
  nuxtApp.provide("currenciesStore", currenciesStore);
});
