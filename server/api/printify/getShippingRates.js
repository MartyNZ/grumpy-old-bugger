export default defineEventHandler(async (event) => {
  // console.log("\n--- New Shipping Rate Request ---");
  // console.log("Request path:", event.path);
  // console.log("Timestamp:", new Date().toISOString());

  const rates = await $fetch("/api/currency/set-rates");
  const body = await readBody(event);
  const cartCurrency = body.content.currency.toUpperCase();
  const currencyRate = rates.data[cartCurrency].value;

  // console.log("Cart currency:", body.content.currency);
  // console.log("Using rate:", currencyRate);

  const shippingCountry = body.content.shippingAddress.country;
  const itemsInfo = body.content.items.map((item) => {
    const blueprintIdField = item.customFields.find(
      (field) => field.name === "Blueprint_id"
    );
    const printProviderIdField = item.customFields.find(
      (field) => field.name === "Print_Provider_id"
    );

    return {
      blueprint_id: blueprintIdField ? blueprintIdField.value : null,
      print_provider_id: printProviderIdField
        ? printProviderIdField.value
        : null,
      quantity: item.quantity,
    };
  });

  const itemsByProvider = itemsInfo.reduce((acc, item) => {
    const key = item.print_provider_id;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});

  let shippingByProvider = {};

  for (const pp_id in itemsByProvider) {
    const item = itemsByProvider[pp_id][0];
    const bp_id = item.blueprint_id;

    const response = await $fetch(
      `/api/printify/shipping?bp_id=${bp_id}&pp_id=${pp_id}`
    );
    shippingByProvider[pp_id] = response;
  }

  for (const pp_id in shippingByProvider) {
    let filteredProfiles = shippingByProvider[pp_id].profiles.filter(
      (profile) => {
        return profile.countries.includes(shippingCountry);
      }
    );

    if (filteredProfiles.length === 0) {
      filteredProfiles = shippingByProvider[pp_id].profiles.filter(
        (profile) => {
          return profile.countries.includes("REST_OF_THE_WORLD");
        }
      );
    }

    shippingByProvider[pp_id].profiles = filteredProfiles;
  }

  let totalShippingCost = 0;

  for (const pp_id in itemsByProvider) {
    const totalQuantity = itemsByProvider[pp_id].reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    const firstItemCost = shippingByProvider[pp_id].profiles[0].first_item.cost;
    const additionalItemsCost =
      shippingByProvider[pp_id].profiles[0].additional_items.cost;

    const totalProviderCost =
      firstItemCost + additionalItemsCost * (totalQuantity - 1);
    totalShippingCost += totalProviderCost;
  }

  const convertedShippingCost = (totalShippingCost / 100) * currencyRate;
  // console.log("Base shipping cost:", totalShippingCost / 100);
  // console.log("Converted shipping cost:", convertedShippingCost);

  const response = {
    rates: [
      {
        cost: convertedShippingCost,
        description: `Total shipping (${cartCurrency})`,
        userDefinedId: "shipping_total",
      },
    ],
  };
  // console.log("Sending response to Snipcart:", response);
  return response;
});
