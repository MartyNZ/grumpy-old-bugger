import { qryProductById } from "~/queries/printify";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const productId = body.resource.id;

  const sanity = useSanity();

  // Fetch the existing Sanity product if available
  const sanityProduct = await sanity.client.fetch(qryProductById, {
    id: productId,
  });

  if (!sanityProduct) {
    return {
      message: `Product with ID ${productId} not found in Sanity.`,
      status: 404,
      topic: "product:delete:failed",
    };
  }

  // Update only the isDeleted field to true
  await sanity.client
    .patch(`printifyProduct-${productId}`)
    .set({
      "store.isDeleted": true,
    })
    .commit();

  return {
    "Sanity Product": sanityProduct.slug?.current,
    message: `Product: '${sanityProduct.store.title}' has been marked as deleted.`,
    status: 200,
    topic: "product:delete:succeeded",
  };
});
