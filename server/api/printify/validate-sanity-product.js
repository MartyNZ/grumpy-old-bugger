import { qryProductById } from "../../../queries/printify";
import { getRates } from "../../utils/storage.js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const sanity = useSanity();

  const cookies = parseCookies(event);
  console.log("Request headers:", event.headers);

  const userInfo = cookies["user-info"];
  const userCurrency = JSON.parse(userInfo).currency.code.toLowerCase();
  console.log("User currency: ", userCurrency);

  // Get rates from server storage
  const { rates } = await getRates();
  console.log("Rates: ", rates);

  const id = getQuery(event).id;
  const variantId = getQuery(event).vId;
  const queryId = id.split("-")[1];

  const sanityProduct = await sanity.client.fetch(qryProductById, {
    id: queryId,
  });

  const selectedVariant = sanityProduct?.store?.variants?.find(
    (variant) => variant.id === variantId
  );

  // Calculate prices using stored rates
  const basePrice = (selectedVariant.price / 100).toFixed(2);
  const formattedPrices = {};

  Object.keys(rates.data).forEach((code) => {
    formattedPrices[code.toLowerCase()] = (
      basePrice * rates.data[code].value
    ).toFixed(2);
  });

  // Get unique option IDs from variants
  const optionIdsArrays = sanityProduct.store.variants.map((variant) =>
    variant.options.split(", ")
  );
  const flatOptionIdsArray = optionIdsArrays.flat();
  const uniqueOptionIds = [...new Set(flatOptionIdsArray)];

  // Filter active options
  const activeOptions = sanityProduct.store.options.map((option) => {
    return {
      ...option,
      values: option.values.filter((value) =>
        uniqueOptionIds.includes(value.id)
      ),
    };
  });

  // Create custom fields for each option type
  const customFields = activeOptions.map((option) => {
    return {
      name: option.type,
      options: option.values
        .map((value) => {
          const variant = sanityProduct.store.variants.find((v) =>
            v.options.includes(value.id)
          );
          if (variant) {
            const priceDiff =
              (variant.price - sanityProduct.store.pricedFrom.price) / 100;
            return `${value.title}${priceDiff !== 0 ? `[+${priceDiff}]` : ""}`;
          }
          return value.title;
        })
        .join("|"),
    };
  });
  return {
    id: sanityProduct._id,
    price: formattedPrices,
    customFields: customFields,
    url: `${config.public.publicUrl}/products/${sanityProduct.slug}`,
  };
});
