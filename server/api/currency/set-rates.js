export default defineCachedEventHandler(
  async (event) => {
    const storage = useStorage("rates");

    if (event.method === "POST") {
      const body = await readBody(event);
      if (body.data) {
        await storage.setItem("current", body);
        return body;
      }
    }

    let rates = await storage.getItem("current");
    if (!rates || !rates.data) {
      const response = await fetch(
        "https://api.currencyapi.com/v3/latest?apikey=cur_live_hWPrWYz61czoqcngc4aqy1kAFAbLNL9r16cfBpzn&currencies=EUR%2CUSD%2CCAD%2CAUD%2CNZD%2CGBP"
      );
      rates = await response.json();
      if (rates.data) {
        await storage.setItem("current-rates", rates);
      }
    }

    return rates;
  },
  {
    swr: true,
    maxAge: 60 * 60 * 24,
  }
);
// console.log("🟢 SET-RATES.JS");
