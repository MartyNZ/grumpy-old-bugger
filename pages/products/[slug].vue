<script setup>
import { qryProductBySlug } from "~/queries/printify";
const data = useSiteSettingsStore();
const settings = data.settings;
const { slug } = useRoute().params;

const isLoading = ref(true);
const { data: product } = await useSanityQuery(qryProductBySlug, {
  slug: slug,
}).finally(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 2500)
})

console.log(JSON.stringify(product.value.store.options, null, 2));
const defaultVariant = product?.value?.store?.variants?.find((variant) => {
  return variant.isDefault;
});
// console.log("Default Variant: ", JSON.stringify(defaultVariant));

// const defaultPriceUnformatted = defaultVariant.price;
// const defaultPrice = defaultPriceUnformatted / 100;
const defaultPrice = product.value.store.pricedFrom.price / 100;
// console.log("Default Price: ", defaultPrice);


useSeoMeta({
  title: computed(() => product.value?.title || ''),
  description: computed(() => product.value?.description || ''),
  ogTitle: computed(() => product.value?.title || ''),
  ogDescription: computed(() => settings?.description || ''),
  // ogImage: computed(() => product.value?.featureImage?.url || product.value?.defaultImageUrl || ''),
  twitterTitle: computed(() => product.value?.title || ''),
  twitterDescription: computed(() => settings?.description || ''),
  // twitterImage: computed(() => product.value?.featureImage?.url || product.value?.defaultImageUrl || ''),
  twitterCard: "summary_large_image",
});

const productSettings = (({
  title: product.value?.store.title,
  description: settings?.description,
  siteName: settings?.title,
  image: product.value?.featureImage?.url || product.value?.defaultImageUrl,
  siteLogo: settings?.logoUrl,
}))

defineOgImageComponent(
  'product', productSettings);

if (product.value && defaultPrice) {
  useSchemaOrg([
    defineProduct({
      name: product.value.title || '',
      brand: settings?.title || '',
      description: product.value.description || '',
      image: product.value?.featureImage?.url || product.value?.defaultImageUrl || '',
      offers: [{ price: defaultPrice.toFixed(2) }],
    }),
  ]);
}

definePageMeta({
  layout: false,
});
</script>

<template>
  <div>
    <NuxtLayout name="internal">
      <template #main>
        <section id="product">
          <product-details :product="product" :defaultVariant="defaultVariant" :loading="isLoading" />
        </section>
      </template>
      <template #sidebar>
        <product-sidebar />
      </template>
    </NuxtLayout>
  </div>
</template>
