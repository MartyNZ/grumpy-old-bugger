import { qryProductById } from "~/queries/printify";
import generateSlug from "~/utilities/generateSlug";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const productId = body.resource.id;

  const { printifyStoreId, printifyBearerToken, publicUrl } =
    useRuntimeConfig();
  const sanity = useSanity();
  const printifyData = await fetch(
    `https://api.printify.com/v1/shops/${printifyStoreId}/products/${productId}.json`,
    {
      headers: {
        "Content-Type": "application/json",
        Charset: "UTF-8",
        Authorization: `Bearer ${printifyBearerToken}`,
      },
    },
  );
  const printifyProduct = await printifyData.json();
  // console.log("Printify Product JSON: ", printifyProduct);

  const sanityProduct = await sanity.client.fetch(qryProductById, {
    id: productId,
  });

  let defaultVariant = printifyProduct.variants.filter(
    (variant) => variant.is_default,
  );
  // console.log("Default Variant Id: ", defaultVariant[0].id);
  let defaultImage = printifyProduct.images.find(
    (image) =>
      image.variant_ids.includes(defaultVariant[0].id) && image.is_default,
  );

  // console.log("Default Image: ", defaultImage);

  let updatePayload = {};

  if (sanityProduct !== null) {
    updatePayload = {
      slug: {
        current: sanityProduct.slug?.current || sanityProduct.slug,
      },
      ...(sanityProduct?.featureImage && {
        featureImage: sanityProduct.featureImage,
      }),
      ...(sanityProduct?.colours && { colours: sanityProduct.colours }),
      ...(sanityProduct?.themes && { themes: sanityProduct.themes }),
      ...(sanityProduct?.details && { details: sanityProduct.details }),
      ...(sanityProduct?.featured && { featured: sanityProduct.featured }),
    };
  } else {
    updatePayload = {
      slug: {
        current: generateSlug(printifyProduct.title),
      },
    };
  }
  // console.log("updatePayload: ", JSON.stringify(updatePayload?.featureImage, null, 2))

  await sanity.client.createOrReplace({
    _id: `printifyProduct-${printifyProduct.id}`,
    _type: "printify.product",
    _createdAt: !sanityProduct
      ? new Date().toISOString()
      : sanityProduct.createdAt,
    featureImage: updatePayload.featureImage
      ? {
          asset: {
            _ref: updatePayload.featureImage.asset?._ref
          }
        }
      : { assetId: "Null" },
    defaultImageUrl: defaultImage.src,
    slug: updatePayload.slug,
    details: updatePayload?.details,
    themes: updatePayload?.themes,
    colours: updatePayload?.colours,
    featured: updatePayload?.featured,
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
              variantIds: image.variant_ids.join(", "),
              isSelectedForPublishing: image.is_selected_for_publishing,
              position: image.position,
              isDefault: image.is_default,
              order: image.order,
            })),
        })),
      tags: printifyProduct.tags.join(", "),
      description: printifyProduct.description,
    },
  });


  // console.log("Updated: ", updatePayload.slug);
  await fetch(
    `https://api.printify.com/v1/shops/${printifyStoreId}/products/${productId}/publishing_succeeded.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Charset: "UTF-8",
        Authorization: `Bearer ${printifyBearerToken}`,
      },
      body: {
        external: {
          id: productId,
          handle: `${publicUrl}/products/${updatePayload.slug.current}`,
        },
      },
    },
  );

  return {
    "Sanity Product": updatePayload.slug.current,
    message: `Product: '${printifyProduct.title}' has been successfully updated.`,
    status: 200,
    topic: "product:published:ended",
  };
});
