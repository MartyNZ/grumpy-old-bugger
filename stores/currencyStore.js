import { currencies } from "~/assets/data/currencies";
const currencyArray = Object.values(currencies).map((currency) => {
  if (currency.index === currencies.length) {
    return currency.code;
  } else {
    return `${currency.code}%2C`;
  }
});
console.log(currencyArray);
export const useCurrencyStore = defineStore("currencies", {
  state: () => {
    return {
      currencies: {},
    };
  },
  actions: {
    async fetchCurrencyRates() {
      const data = await useAsyncData("currencies", () =>
        $fetch(
          `https://api.currencyapi.com/v3/convert?apikey=cur_live_hWPrWYz61czoqcngc4aqy1kAFAbLNL9r16cfBpzn&currencies=${currencyArray}&date=2024-12-04&value=1`
        )
      );
      this.currencies = data.value;
      return this.currencies;
      console.log("From State: ", JSON.stringify(this.currencies));
    },
  },
});
