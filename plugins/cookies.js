// import { getRates } from "../server/utils/storage.js";

export default defineNuxtPlugin(async () => {
  const userInfo = useCookie("user-info", {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    secure: true,
    sameSite: "lax",
  });

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
  // Check and update rates
  const response = await $fetch("/api/currency/set-rates", {
    method: "GET", // Changed from POST since we're using cached handler
  });

  if (!response || Date.now() - response.timestamp > 60 * 60 * 24 * 1000) {
    const latestRates = await fetch(
      "https://api.currencyapi.com/v3/latest?apikey=cur_live_hWPrWYz61czoqcngc4aqy1kAFAbLNL9r16cfBpzn¤cies=EUR%2CUSD%2CCAD%2CAUD%2CNZD%2CGBP"
    );
    const rates = await latestRates.json();
    await $fetch("/api/currency/set-rates", {
      method: "POST",
      body: rates,
    });
  }
});
