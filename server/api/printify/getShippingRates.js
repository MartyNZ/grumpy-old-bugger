export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  // console.log("NUXT_SITE_PUBLISHED_URL: ", config.public.publicUrl);
  // console.log("PRINTIFY_BEARER_TOKEN: ", config.printifyBearerToken);

  const body = await readBody(event);
  const shippingCountry = body.content.shippingAddress.country;

  const itemsInfo = body.content.items.map((item) => {
    const blueprintIdField = item.customFields.find(
      (field) => field.name === "Blueprint_id",
    );
    const printProviderIdField = item.customFields.find(
      (field) => field.name === "Print_Provider_id",
    );

    return {
      blueprint_id: blueprintIdField ? blueprintIdField.value : null,
      print_provider_id: printProviderIdField
        ? printProviderIdField.value
        : null,
      quantity: item.quantity,
    };
  });

  // console.log("itemsInfo", itemsInfo);

  const itemsByProvider = itemsInfo.reduce((acc, item) => {
    const key = item.print_provider_id;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});

  // console.log("Items Provider: ", JSON.stringify(itemsByProvider));

  let shippingByProvider = {};

  for (const pp_id in itemsByProvider) {
    const item = itemsByProvider[pp_id][0];
    const bp_id = item.blueprint_id;

    try {
      const response = await fetch(
        `${config.public.publicUrl}/api/printify/shipping?bp_id=${bp_id}&pp_id=${pp_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Charset: "UTF-8",
            Authorization: `Bearer ${config.printifyBearerToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      shippingByProvider[pp_id] = data;

      // console.log(`${pp_id}: ${JSON.stringify(data)}`);
    } catch (error) {
      console.error("Failed to fetch from /api/printify/shipping:", error);
    }
  }

  for (const pp_id in shippingByProvider) {
    let filteredProfiles = shippingByProvider[pp_id].profiles.filter(
      (profile) => {
        return profile.countries.includes(shippingCountry);
      },
    );

    if (filteredProfiles.length === 0) {
      filteredProfiles = shippingByProvider[pp_id].profiles.filter(
        (profile) => {
          return profile.countries.includes("REST_OF_THE_WORLD");
        },
      );
    }

    shippingByProvider[pp_id].profiles = filteredProfiles;
  }

  // console.log("Shipping Provider: ", shippingByProvider);
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

    // console.log(`Total cost for provider ${pp_id}: ${totalProviderCost}`);
    // console.log(`Total shipping cost: ${totalShippingCost}`);
  }

  return {
    rates: [
      {
        cost: totalShippingCost / 100,
        description: "Total shipping",
        userDefinedId: "shipping_total",
      },
    ],
  };
});
