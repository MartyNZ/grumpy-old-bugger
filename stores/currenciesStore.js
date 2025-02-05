import currenciesData from "~/assets/data/currencies.json";

export const useCurrenciesStore = defineStore("currencies", {
  state: () => ({
    availableCurrencies: {},
    selectedCurrency: {
      symbol: "$",
      name: "US Dollar",
      symbol_native: "$",
      decimal_digits: 2,
      rounding: 0,
      code: "USD",
      rate: 1,
    },
  }),

  actions: {
    async initializeCurrencies(userCurrency) {
      const { data: ratesData } = await useFetch("/api/currency/set-rates");

      this.availableCurrencies = Object.entries(
        currenciesData.currenciesData
      ).reduce((acc, [code, details]) => {
        acc[code] = {
          ...details,
          rate: ratesData.value?.data?.[code]?.value || null,
        };
        return acc;
      }, {});

      if (userCurrency) {
        this.selectedCurrency = this.availableCurrencies[userCurrency.code];
      }
    },

    updateSelectedCurrency(currency) {
      this.selectedCurrency = currency;
    },
  },

  getters: {
    currentCurrency: (state) => state.selectedCurrency,
  },
});
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCurrenciesStore, import.meta.hot));
}
