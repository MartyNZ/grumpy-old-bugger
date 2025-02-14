import _ from "lodash";
import generateSlug from "~/utilities/generateSlug";

export default defineEventHandler(async (event) => {
  const sanity = useSanity();
  let toBeUpdated = [];
  let toBeDeleted = [];

  const printify = await $fetch(
    `${process.env.NUXT_PUBLIC_SITE_URL}/api/printify/get-printify-products`,
  );
  console.log("All products from Printify: ", printify.length);

  // Fetch all products from Sanity
  const sanityProducts = await sanity.client.fetch(
    '*[_type == "printify.product"]',
  );
  console.log("Products from Sanity: ", sanityProducts.length);

  // Create a lookup object for Printify products
  const printifyProductsLookup = printify.reduce((lookup, product) => {
    lookup[product.id] = product;
    return lookup;
  }, {});

  // Create a lookup object for Sanity products
  const sanityProductsLookup = sanityProducts.reduce((lookup, product) => {
    if (product.store) {
      lookup[product.store.productId] = product;
    }
    return lookup;
  }, {});

  // Determine products to update and delete
  printify.forEach((printifyProduct) => {
    const matchingSanityProduct = sanityProductsLookup[printifyProduct.id];
    if (matchingSanityProduct) {
      // If the Sanity product exists, check if it needs to be updated
      if (
        matchingSanityProduct.store.updatedAt === null ||
        new Date(matchingSanityProduct.store.updatedAt) <
          new Date(printifyProduct.updated_at)
      ) {
        toBeUpdated.push(printifyProduct);
      }
    } else {
      // If the Sanity product does not exist, add the Printify product to toBeUpdated
      toBeUpdated.push(printifyProduct);
    }
  });

  sanityProducts.forEach((sanityProduct) => {
    if (
      sanityProduct.store &&
      !printifyProductsLookup[sanityProduct.store.productId]
    ) {
      toBeDeleted.push(sanityProduct);
    }
  });

  const setToDelete = sanity.client.transaction();
  toBeDeleted
    .filter(
      (product) =>
        !product.store.isDeleted &&
        !printifyProductsLookup[product.store.productId],
    )
    .forEach((product) =>
      setToDelete.patch(
        sanity.client.patch(product._id).set({ "store.isDeleted": true }),
      ),
    );
  await setToDelete.commit();

  console.log(toBeDeleted.length, " products to be deleted");
  console.log(toBeUpdated.length, " total products to be updated");

  const batchSize = 10;
  const batches = _.chunk(toBeUpdated, batchSize);
  const batch = toBeUpdated.slice(0, batchSize);
  console.log(batch.length, " products to update in this batch");
  // console.log(batch);
  for (const batch of batches) {
    await Promise.all(
      batch.map(async (product) => {
        const productId = product.id;
        let existingDoc;
        try {
          existingDoc = await sanity.client.fetch(
            `*[_id == "printifyProduct-${productId}"]`,
          );
        } catch (error) {
          console.error("Error fetching document: ", error);
          return;
        }
        // console.log("existing document: ", existingDoc);
        let printifyProduct;

        try {
          printifyProduct = await $fetch(
            `${process.env.NUXT_PUBLIC_SITE_URL}/api/printify/get-printify-product?id=${product.id}`,
          );
        } catch (error) {
          console.error("Error making fetch request to Printify: ", error);
          return;
        }
        console.log(
          "printifyProduct: ",
          JSON.stringify(printifyProduct, null, 2),
        );

        let sanityProduct;
        try {
          sanityProduct = await sanity.client.fetch(
            `*[ _type == 'printify.product' && store.productId == '${product.id}' ][0]`,
          );
        } catch (error) {
          console.error("Error making fetch request to Sanity: ", error);
          return;
        }

        console.log("Fetched sanityProduct: ", sanityProduct);

        // Prepare the update payload

        // function generateSlug(title) {
        //   return title
        //     .toLowerCase()
        //     .replace(/[^a-z0-9]+/g, "-")
        //     .replace(/(^-|-$)/g, "");
        // }

        let defaultVariant = printifyProduct.variants.filter(
          (variant) => variant.is_default,
        );
        // console.log("Default Variant Id: ", defaultVariant[0].id);

        let defaultImage = printifyProduct.images.find(
          (image) =>
            image.variant_ids.includes(defaultVariant[0].id) &&
            image.is_default,
        );
        // console.log("Default Image: ", defaultImage);

        let updatePayload = {};

        if (sanityProduct != null || sanityProduct != undefined) {
          sanityProduct?.store?.variants?.forEach((variant) => {
            const variantCustomImages = variant.variantCustomImages || [];
            updatePayload.variantCustomImages =
              updatePayload.variantCustomImages || [];
            updatePayload.variantCustomImages.push(...variantCustomImages);
          });

          console.log(
            "Variant Custom Images: ",
            JSON.stringify(variantCustomImages),
          );
          updatePayload = {
            slug: {
              current: sanityProduct.slug?.current || sanityProduct.slug,
            },
            featureImage: sanityProduct.featureImage,
            body: sanityProduct.body,
            moreInfo: sanityProduct.moreInfo,
            theme: sanityProduct.theme,
            colour: sanityProduct.colour,
            featured: sanityProduct.featured,
          };
        } else {
          updatePayload = {
            slug: {
              current: generateSlug(printifyProduct.title),
            },
          };
        }

        // console.log("Update Payload: ", updatePayload);

        const imagesToUpload = printifyProduct.images;

        imagesToUpload.forEach(async (image) => {
          const url = new URL(image.src);
          const imageUrl = url.origin + url.pathname;

          // Check that the image.src is a valid image URL
          if (
            !imageUrl.startsWith("http") ||
            (!imageUrl.endsWith(".jpg") &&
              !imageUrl.endsWith(".jpeg") &&
              !imageUrl.endsWith(".png"))
          ) {
            console.error(`Invalid image URL: ${imageUrl}`);
            return;
          }

          // Upload the image to Sanity as an asset
          await sanity.client.assets
            .upload(imageUrl, {
              filename: imageUrl,
              contentType: getContentTypeFromExtension(imageUrl),
            })
            .then(async (asset) => {
              // Reference the uploaded asset in the createOrReplace() method
              const assetId = asset._id;
              await sanity.client.createOrReplace({
                _id: `printifyProduct-${printifyProduct.id}`,
                _type: "printify.product",
                _createdAt: !sanityProduct
                  ? new Date().toISOString()
                  : sanityProduct.createdAt,
                featureImage: updatePayload.featureImage,
                defaultImageUrl: defaultImage.src,
                body: updatePayload.body,
                slug: updatePayload.slug,
                store: {
                  productId: printifyProduct.id.toString(),
                  shopId: printifyProduct.shop_id.toString(),
                  printProviderId: printifyProduct.print_provider_id.toString(),
                  blueprintId: printifyProduct.blueprint_id.toString(),
                  title: printifyProduct.title, // corresponds to titleProxy
                  isVisible: printifyProduct.visible,
                  isLocked: printifyProduct.is_locked,
                  isDeleted: false,
                  updatedAt: printifyProduct.updated_at,
                  createdAt: printifyProduct.created_at,
                  options: printifyProduct.options.map((option, index) => ({
                    _key: `option-${index + 1}`,
                    name: option.name,
                    type: option.type,
                    values: option.values.map((value, index) => ({
                      _key: `optionValue-${index + 1}`,
                      id: value.id.toString(),
                      title: value.title,
                      colors: value.colors ? value.colors.join(", ") : null,
                    })),
                  })),
                  variants: printifyProduct.variants
                    .filter((variant) => variant.is_enabled == true)
                    .map((variant) => ({
                      _key: `variant-${variant.id}`,
                      id: variant.id.toString(),
                      title: variant.title,
                      isEnabled: variant.is_enabled,
                      isDefault: variant.is_default,
                      isAvailable: variant.is_available,
                      cost: variant.cost.toString(),
                      price: variant.price.toString(),
                      sku: variant.sku,
                      grams: variant.grams.toString(),
                      quantity: variant.quantity,
                      options: variant.options.join(", "),
                      variantImages: printifyProduct.images
                        .filter(
                          (image) =>
                            image.variant_ids.includes(variant.id) &&
                            image.is_selected_for_publishing,
                        )
                        .map((image, index) => ({
                          _key: `image-${index}`,
                          src: image.src,
                          image: image,
                          variantIds: image.variant_ids.join(", "),
                          isSelectedForPublishing:
                            image.is_selected_for_publishing,
                          position: image.position,
                          isDefault: image.is_default,
                          order: image.order,
                          asset: {
                            // Reference the uploaded asset
                            _ref: assetId,
                            _type: "asset",
                          },
                        })),
                      variantCustomImages: updatePayload.variantCustomImages,
                    })),
                  tags: printifyProduct.tags.join(", "),
                  description: printifyProduct.description,
                },
              });
            })
            .catch((err) => {
              console.error(`Error uploading image: ${err.message}`);
            });
        });

        function getContentTypeFromExtension(url) {
          const extension = url.split(".").pop().toLowerCase();
          switch (extension) {
            case "jpg":
            case "jpeg":
              return "image/jpeg";
            case "png":
              return "image/png";
            default:
              throw new Error(`Unsupported image type: ${extension}`);
          }
        }

        // const variantImages = printifyProduct.images
        //   .filter(
        //     (image) =>
        //       image.variant_ids.includes(variant.id) &&
        //       image.is_selected_for_publishing,
        //   )
        //   .map((image, index) => ({
        //     _key: `image-${index}`,
        //     src: image.src,
        //     image: image,
        //     variantIds: image.variant_ids.join(", "),
        //     isSelectedForPublishing: image.is_selected_for_publishing,
        //     position: image.position,
        //     isDefault: image.is_default,
        //     order: image.order,
        //     asset: {
        //       // Reference the uploaded asset
        //       _ref: assetId,
        //       _type: "asset",
        //     },
        //   }));
      }),
    );
  }

  return {
    statusCode: 200,
    body: "Don't count on it working",
    topic: "product:published:ended",
  };
});
