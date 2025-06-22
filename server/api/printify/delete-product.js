import { qryProductById } from "~/queries/printify";

export default defineEventHandler(async (event) => {
  console.log("🚀 DELETE PRODUCT HANDLER STARTED");
  console.log("Timestamp:", new Date().toISOString());
  console.log("Request method:", event.node.req.method);
  console.log("Request URL:", event.node.req.url);

  try {
    console.log("📥 Reading request body...");
    const body = await readBody(event);
    console.log("Request body received:", JSON.stringify(body, null, 2));

    const productId = body.resource.id;
    console.log("🆔 Extracted product ID:", productId);

    console.log("🔌 Initializing Sanity client...");
    const sanity = useSanity();
    console.log("✅ Sanity client initialized");

    // Fetch the existing Sanity product
    console.log("🔍 Fetching existing Sanity product with ID:", productId);
    const sanityProduct = await sanity.client.fetch(qryProductById, {
      id: productId,
    });
    console.log(
      "📦 Sanity product fetch result:",
      sanityProduct ? "Found" : "Not found"
    );

    if (sanityProduct) {
      console.log("Product details:", {
        title: sanityProduct.store?.title,
        slug: sanityProduct.slug?.current,
        isDeleted: sanityProduct.store?.isDeleted,
      });
    }

    if (!sanityProduct) {
      console.log("❌ Product not found in Sanity, returning 404");
      return {
        message: `Product with ID ${productId} not found in Sanity.`,
        status: 404,
        topic: "product:delete:failed",
      };
    }

    // Update only the isDeleted field to true
    console.log("🔄 Updating product isDeleted field to true...");
    console.log("Document ID to patch:", `printifyProduct-${productId}`);

    const patchResult = await sanity.client
      .patch(`printifyProduct-${productId}`)
      .set({
        "store.isDeleted": true,
      })
      .commit();

    console.log("✅ Patch operation completed successfully");
    console.log("Patch result:", patchResult);

    const successResponse = {
      "Sanity Product": sanityProduct.slug?.current,
      message: `Product: '${sanityProduct.store.title}' has been marked as deleted.`,
      status: 200,
      topic: "product:delete:succeeded",
    };

    console.log("🎉 DELETE PRODUCT HANDLER COMPLETED SUCCESSFULLY");
    console.log("Response:", JSON.stringify(successResponse, null, 2));

    return successResponse;
  } catch (error) {
    console.error("💥 ERROR in delete-product handler:");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Full error object:", error);

    return {
      message: `Error deleting product: ${error.message}`,
      status: 500,
      topic: "product:delete:failed",
      error: error.message,
    };
  }
});
