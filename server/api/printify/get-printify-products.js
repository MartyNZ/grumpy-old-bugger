export default defineEventHandler(async (event) => {
  const { printifyStoreId, printifyBearerToken } = useRuntimeConfig();

  const { data, error } = await $fetch(
    `https://api.printify.com/v1/shops/${printifyStoreId}/products.json`,
    {
      headers: {
        "Content-Type": "application/json",
        Charset: "UTF-8",
        Authorization: `Bearer ${printifyBearerToken}`,
      },
    },
  );
  if (error) {
    console.error(error);
    // Handle the error, e.g., show an error message
    return null;
  }

  // Filter variants in each product
  data.forEach((product) => {
    product.variants = product.variants.filter((variant) => variant.is_enabled);
  });

  // Filter products with no variants left
  const filteredData = data.filter((product) => product.variants.length > 0);

  return filteredData;
  console.log(filteredData);
});
