/* get global page data on start */
export default defineNuxtPlugin(async (nuxtApp) => {
  const currencyRates = useCurrencyStore();
  await currencyRates.fetchCurrencyRates();
  nuxtApp.provide("currencyRates", currencyRates);
  // console.log("Plugin: currencyList fetched");
});
