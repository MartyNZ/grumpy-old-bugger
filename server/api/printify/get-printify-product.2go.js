export default defineEventHandler(async (event) => {
  const id = getQuery(event).id;
  const { printifyStoreId, printifyBearerToken } = useRuntimeConfig();

  const response = await fetch(
    `https://api.printify.com/v1/shops/${printifyStoreId}/products/${id}.json`,
    {
      headers: {
        "Content-Type": "application/json",
        Charset: "UTF-8",
        Authorization: `Bearer ${printifyBearerToken}`,
      },
    },
  );
  if (!response.ok) {
    console.error(`API request failed with status ${response.status}`);
    return null;
  }

  const data = await response.json();
  return data;
});
