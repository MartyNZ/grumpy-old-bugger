export const useCurrencyState = () =>
  useState("currency", () => ({
    selected: {
      symbol: "$",
      name: "US Dollar",
      symbol_native: "$",
      decimal_digits: 2,
      rounding: 0,
      code: "USD",
      rate: 1,
    },
  }));
