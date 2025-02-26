import { currenciesData } from "~/assets/data/currencies.json";

export default defineNuxtPlugin(async (nuxtApp) => {
  const userInfo = useCookie("user-info", {
    default: () => ({
      currency: {
        value: 1,
        ...currenciesData.USD,
      },
    }),
    watch: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  // Initialize cookie if it doesn't exist
  if (!userInfo.value) {
    userInfo.value = {
      currency: {
        value: 1,
        ...currenciesData.USD,
      },
    };
  }

  // Make userInfo available globally
  nuxtApp.provide("userInfo", userInfo);
});
