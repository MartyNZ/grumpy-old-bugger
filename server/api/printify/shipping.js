export default defineEventHandler(async (event) => {
  const { bp_id, pp_id } = getQuery(event);
  const config = useRuntimeConfig();

  // console.log("From shipping.js :: Print Provider ID: ", pp_id);
  // console.log("From shipping.js :: Blueprint ID: ", bp_id);
  // console.log(
  //   "From shipping.js :: Printify Bearer Token in shipping.js: ",
  //   config.printifyBearerToken,
  // );
  const response = await fetch(
    `https://api.printify.com/v1/catalog/blueprints/${bp_id}/print_providers/${pp_id}/shipping.json`,
    {
      headers: {
        "Content-Type": "application/json",
        Charset: "UTF-8",
        Authorization: `Bearer ${config.printifyBearerToken}`,
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
