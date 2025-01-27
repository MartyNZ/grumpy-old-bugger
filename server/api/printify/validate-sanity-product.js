import { qryProductById } from "~/queries/printify";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const sanity = useSanity();
  const id = getQuery(event).id;
  const variantId = getQuery(event).vId;
  const queryId = id.split("-")[1];
  const currentRates = JSON.parse(getCookie(event, "current-rates"));

  const sanityProduct = await sanity.client.fetch(qryProductById, {
    id: queryId,
  });
  // console.log("Sanity Product: ", sanityProduct);

  const selectedVariant = sanityProduct?.store?.variants?.find((variant) => {
    if (variant.id === variantId) return variant;
  });
  const optionIdsArrays = sanityProduct.store.variants.map((variant) =>
    variant.options.split(", ")
  );
  const flatOptionIdsArray = optionIdsArrays.flat();
  const uniqueOptionIds = [...new Set(flatOptionIdsArray)];

  const activeOptions = sanityProduct.store.options.map((option) => {
    return {
      ...option,
      values: option.values.filter((value) =>
        uniqueOptionIds.includes(value.id)
      ),
    };
  });
  // Base price calculations
  const basePrice = (selectedVariant.price / 100).toFixed(2);
  const formattedPrices = {};
  Object.keys(currentRates.data).forEach((code) => {
    formattedPrices[code.toLowerCase()] = (
      basePrice * currentRates.data[code].value
    ).toFixed(2);
  });

  // Format custom fields using active options
  const customFields = activeOptions.map((option) => ({
    name: option.type,
    options: option.values
      .map((value) => {
        const variant = sanityProduct.store.variants.find((v) =>
          v.options.includes(value.id)
        );
        const priceDiff = variant
          ? ((variant.price - selectedVariant.price) / 100).toFixed(2)
          : "0.00";
        return priceDiff !== "0.00"
          ? `${value.title}[+${priceDiff}]`
          : value.title;
      })
      .join("|"),
  }));

  return {
    id: sanityProduct._id,
    price: formattedPrices,
    customFields: customFields,
    url: `${config.public.publicUrl}/products/${sanityProduct.slug}`,
  };
});
