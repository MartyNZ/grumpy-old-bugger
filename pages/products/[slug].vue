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

// Add null checks for product data
if (!product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Product not found'
  })
}

// Safe access to default variant
const defaultVariant = computed(() => {
  return product?.value?.store?.variants?.find((variant) => {
    return variant.isDefault;
  });
});

// Safe access to default price
const defaultPrice = computed(() => {
  return product?.value?.store?.pricedFrom?.price ?
    product.value.store.pricedFrom.price / 100 :
    null;
});

// Create the title as a computed property
const pageTitle = computed(() => `${product.value?.store.title}`);
useHead({
  title: pageTitle.value,
});
// Safe SEO meta setup
useSeoMeta({
  title: computed(() => pageTitle.value || ''),
  description: computed(() => product.value?.store?.title || ''),
  ogTitle: computed(() => pageTitle.value || ''),
  ogDescription: computed(() => product.value?.store?.title || ''),
  ogImage: computed(() => product.value?.featureImage?.url || product.value?.defaultImageUrl || ''),
  twitterTitle: computed(() => pageTitle.value || ''),
  twitterDescription: computed(() => product.value?.store?.title || ''),
  twitterImage: computed(() => product.value?.featureImage?.url || product.value?.defaultImageUrl || ''),
  twitterCard: "summary_large_image",
});


definePageMeta({
  layout: false,
});

// Safe schema.org setup
watchEffect(() => {
  if (product.value && defaultPrice.value) {
    useSchemaOrg([
      defineProduct({
        name: product.value.title || '',
        brand: settings?.title || '',
        description: product.value.description || '',
        image: product.value?.featureImage?.url || product.value?.defaultImageUrl || '',
        offers: [{ price: defaultPrice.value.toFixed(2) }],
      }),
    ]);
  }
});

// // Safe product settings
// const productSettings = computed(() => ({
//   title: product.value?.store?.title || '',
//   description: settings?.description || '',
//   siteName: settings?.title || '',
//   image: product.value?.featureImage?.url || product.value?.defaultImageUrl || '',
//   siteLogo: settings?.logoUrl || '',
// }));

// // Safe OG image component definition
// watchEffect(() => {
//   if (product.value) {
//     defineOgImageComponent('product', productSettings.value);
//   }
// });
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
