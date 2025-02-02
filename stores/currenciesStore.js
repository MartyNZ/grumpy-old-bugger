import currenciesData from "~/assets/data/currencies.json";

export const useCurrenciesStore = defineStore("currencies", {
  state: () => ({
    availableCurrencies: {},
  }),
  actions: {
    async initializeCurrencies() {
      const { data: ratesData } = await useFetch("/api/currency/set-rates");

      // console.log("Rates data received:", ratesData.value);

      this.availableCurrencies = Object.entries(
        currenciesData.currenciesData
      ).reduce((acc, [code, details]) => {
        acc[code] = {
          ...details,
          rate: ratesData.value?.data?.[code]?.value || null,
        };
        return acc;
      }, {});
      // console.log("Populated availableCurrencies:", this.availableCurrencies);
    },
  },
});
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCurrenciesStore, import.meta.hot));
}
