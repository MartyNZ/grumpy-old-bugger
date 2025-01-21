import currenciesData from "~/assets/data/currencies.json";

export const useCurrenciesStore = defineStore("currencies", {
  state: () => ({
    availableCurrencies: {},
  }),
  actions: {
    async initializeCurrencies() {
      const currentRates = useCookie("current-rates");

      this.availableCurrencies = Object.entries(
        currenciesData.currenciesData
      ).reduce((acc, [code, details]) => {
        acc[code] = {
          ...details,
          rate: currentRates.value?.data?.[code].value || null,
        };
        return acc;
      }, {});
      // console.log("From State: ", JSON.stringify(this.availableCurrencies));
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCurrenciesStore, import.meta.hot));
}
