export default defineNuxtPlugin(async () => {
  console.log(
    "2. Cookies plugin running:",
    process.server ? "Server Side" : "Client Side"
  );
  const userInfo = useCookie("user-info");
  if (!userInfo.value) {
    userInfo.value = {
      currency: {
        symbol: "$",
        name: "US Dollar",
        symbol_native: "$",
        decimal_digits: 2,
        rounding: 0,
        code: "USD",
        name_plural: "US dollars",
        type: "fiat",
        rate: 1,
        countries: [
          "AC",
          "AS",
          "BQ",
          "DG",
          "EC",
          "FM",
          "GU",
          "HT",
          "IO",
          "MH",
          "MP",
          "PA",
          "PR",
          "PW",
          "SV",
          "TC",
          "TL",
          "UM",
          "US",
          "VG",
          "VI",
          "ZW",
        ],
      },
      language: "en",
    };
  }

  const currentRates = useCookie("current-rates");
  if (
    !currentRates.value ||
    Date.now() - currentRates.value.timestamp > 60 * 60 * 24 * 1000
  ) {
    const response = await fetch(
      "https://api.currencyapi.com/v3/latest?apikey=cur_live_hWPrWYz61czoqcngc4aqy1kAFAbLNL9r16cfBpzn&currencies=EUR%2CUSD%2CCAD%2CAUD%2CNZD%2CGBP"
    );
    const latestRates = await response.json();
    // Set cookie
    currentRates.value = latestRates;

    // Set server storage via API endpoint
    await $fetch("/api/currency/set-rates", {
      method: "POST",
      body: latestRates,
    });
  }
});
