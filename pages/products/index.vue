<script setup>
import { qryAllProducts } from "~/queries/printify";
const printifyCollectionNavigationStore =
  usePrintifyCollectionNavigationStore();
const collectionNav =
  printifyCollectionNavigationStore.printifyCollectionNavigation;

const data = useSiteSettingsStore();
const settings = data.settings;

const isLoading = ref(true)
// Modify the data fetching to handle loading state
const { data: allProducts } = await useSanityQuery(qryAllProducts).finally(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 500)
});
// console.log("Products: ", JSON.stringify(allProducts.value, null, 2));

const filteredProducts = ref([]);
filteredProducts.value = allProducts.value;
// console.log("Filtered Product Count: ", filteredProducts.value.length);

const productThemes = computed(() => {
  const uniqueThemes = new Map()

  allProducts.value?.forEach(product => {
    product.theme?.forEach?.(theme => {
      if (theme?._id && !uniqueThemes.has(theme._id)) {
        uniqueThemes.set(theme._id, theme)
      }
    })
  })

  return Array.from(uniqueThemes.values())
})

const productColours = computed(() => {
  const uniqueColours = new Map()

  allProducts.value?.forEach(product => {
    product.colours?.forEach?.(colour => {
      if (colour?._id && !uniqueColours.has(colour._id)) {
        uniqueColours.set(colour._id, colour)
      }
    })
  })

  return Array.from(uniqueColours.values())
})

// Log the productColours array to the console
// console.log("Product Colours: ", JSON.stringify(productColours, null, 2));


// console.log("All Products: ", JSON.stringify(allProducts.value));

// console.log(JSON.stringify(allProducts.value, null, 2));
const productCount = allProducts.value.length;
// console.log("Product Count: ", productCount);
const currentProduct = Math.floor(Math.random() * productCount);
// console.log("Current Product index: ", currentProduct);
const product = allProducts.value[currentProduct];

// Create the title as a computed property
const pageTitle = computed(() => `Products`);
useHead({
  title: pageTitle.value,
});

useSeoMeta({
  title: computed(() => pageTitle.value || ''),
  description: computed(() => product?.store?.title || ''),
  ogTitle: computed(() => pageTitle.value || ''),
  ogDescription: computed(() => product?.store?.title || ''),
  ogImage: computed(() => product?.featureImage?.asset?.url || product?.defaultImageUrl || ''),
  twitterTitle: computed(() => pageTitle.value || ''),
  twitterDescription: computed(() => product?.store?.title || ''),
  twitterImage: computed(() => product?.featureImage?.asset?.url || product?.defaultImageUrl || ''),
  twitterCard: "summary_large_image",
});

definePageMeta({
  layout: false,
});

// const productSettings = (({
//   title: settings?.title,
//   productTitle: product.store?.title,
//   description: settings?.description,
//   siteName: settings?.title,
//   image: product.featureImage?.url || product?.defaultImageUrl,
//   siteLogo: settings?.logoUrl,
// }))
// defineOgImageComponent('product', productSettings);
</script>

<template>
  <div>
    <NuxtLayout name="internal">
      <template #main>
        <product-collection-buttons :collectionNav="collectionNav" />
        <section id="product-list">
          <product-list v-if="filteredProducts.length > 0" :loading="isLoading" :products="filteredProducts" />
        </section>
      </template>
      <template #sidebar>
        <product-sidebar />
      </template>
    </NuxtLayout>
  </div>
</template>

<style scoped>
.p-skeleton {
  background-color: var(--surface-200);
}
</style>
