import { qryProductById } from "~/queries/printify";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const sanity = useSanity();
  const id = getQuery(event).id;
  const variantId = getQuery(event).vId;
  const queryId = id.split("-")[1];


  // console.log("Variant ID: ", variantId);
  // console.log("Query ID: ", queryId);

  // Fetch product from Sanity
  const sanityProduct = await sanity.client.fetch(qryProductById, {
    id: queryId,
  });
  // console.log(JSON.stringify(sanityProduct.store.variants));
  const selectedVariant = sanityProduct?.store?.variants?.find((variant) => {
    if (variant.id === variantId) return variant;
  });
  if (!sanityProduct || !sanityProduct.store || !sanityProduct.store.variants) {
    console.error(
      "sanityProduct, sanityProduct.store, or sanityProduct.store.variants is undefined or null.",
    );
  }

  if (!selectedVariant) {
    console.warn("No variant found with the provided variantId.");
  }
  // console.log("Product Slug: ", sanityProduct.slug);

  // const variantStrings = sanityProduct?.store.variants.map((variant, index) => {
  //   if (index === 0) {
  //     return selectedVariant.title;
  //   } else if (variant.id !== defaultVariant.id) {
  //     const priceDifference = (variant.price - defaultVariant.price) / 100;
  //     return `${variant.title}[+${priceDifference}]`;
  //   }
  // });

  const customFields = [
    // {
    //   name: "Variants",
    //   options: variantStrings.join("|"),
    // },
  ];

  return {
    id: sanityProduct._id,
    price: selectedVariant.price / 100,
    customFields: customFields,
    url: `${config.public.publicUrl}/products/${sanityProduct.slug}`,
  };
});
