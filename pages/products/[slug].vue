<script setup>
import { qryProductBySlug } from "~/queries/printify";
const data = useSiteSettingsStore();
const settings = data.settings;
const { slug } = useRoute().params;
const { data: product } = await useSanityQuery(qryProductBySlug, {
  slug: slug,
});

// console.log(JSON.stringify(product.value, null, 2));
const defaultVariant = product?.value?.store?.variants?.find((variant) => {
  return variant.isDefault;
});
// console.log("Default Variant: ", JSON.stringify(defaultVariant));

// const defaultPriceUnformatted = defaultVariant.price;
// const defaultPrice = defaultPriceUnformatted / 100;
const defaultPrice = product.value.store.pricedFrom.price / 100;
// console.log("Default Price: ", defaultPrice);


useSeoMeta({
  title: () => product.value.title,
  description: () => product.value.description,
  ogTitle: () => product.value.title,
  ogDescription: () => settings.description,
  ogImage: () =>
    product.value.featureImage?.url || product.value.defaultImageUrl,
  twitterTitle: () => product.value.title,
  twitterDescription: () => settings.description,
  twitterImage: () =>
    product.value.featureImage?.url || product.value.defaultImageUrl,
  twitterCard: "summary_large_image",
});

defineOgImageComponent(
  'product',
  {
    title: product.value.store.title,
    description: settings.description,
    siteName: settings.title,
    image: product.value.featureImage?.url || product.value.defaultImageUrl,
    siteLogo: settings.logoUrl,
  },
);

useSchemaOrg([
  defineProduct({
    name: product.value.title,
    brand: settings.title,
    description: product.value.description,
    image: product.value.featureImage?.url || product.value.defaultImageUrl,
    offers: [{ price: defaultPrice.toFixed(2) }],
  }),
]);

definePageMeta({
  layout: false,
});
</script>

<template>
  <div>
    <NuxtLayout name="internal">
      <template #main>
        <section id="product">
          <product-details :product="product" :defaultVariant="defaultVariant" />
        </section>
      </template>
      <template #sidebar>
        <product-sidebar />
      </template>
    </NuxtLayout>
  </div>
</template>
