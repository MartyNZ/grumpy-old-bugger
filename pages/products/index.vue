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
  isLoading.value = false
});
// console.log("Products: ", JSON.stringify(allProducts.value, null, 2));

const filteredProducts = ref([]);
filteredProducts.value = allProducts.value;
// console.log("Filtered Product Count: ", filteredProducts.value.length);

const productThemes = [
  ...new Set(
    allProducts.value
      .flatMap((product) =>
        product.theme ? product.theme : [],
      )
      .map((theme) => theme._id),
  ),
].map((id) =>
  allProducts.value
    .flatMap((product) =>
      product.theme ? product.theme : [],
    )
    .find((theme) => theme._id === id),
);
// console.log("Product Themes: ", JSON.stringify(productThemes, null, 2));

// Create an array of unique colour objects
const productColours = [
  ...new Set(
    allProducts.value
      .flatMap((product) =>
        product.colours &&
          product.colours !== null &&
          product.colours.length > 0
          ? product.colours
          : [],
      )
      .map((colour) => colour._id),
  ),
].map((id) =>
  allProducts.value
    .flatMap((product) =>
      product.colours && product.colours.length > 0 ? product.colours : [],
    )
    .find((colour) => colour._id === id),
);

// Log the productColours array to the console
// console.log("Product Colours: ", JSON.stringify(productColours, null, 2));

const productFilters = defineAsyncComponent(
  () => import("~/components/product/filters.vue"),
);

const themeFilters = ref([]);
const colourFilters = ref([]);

function clearFilters() {
  themeFilters.value = [];
  colourFilters.value = [];
}
watch(
  [themeFilters, colourFilters],
  () => {
    // console.log("Theme Filters: ", JSON.stringify(themeFilters.value, null, 2));
    const filteredByColour = allProducts.value.filter((product) =>
      colourFilters.value.length === 0
        ? true
        : product.colours &&
        colourFilters.value.some((colour) =>
          product.colours.some(
            (productColour) => productColour.slug === colour,
          ),
        )
    );

    filteredProducts.value = filteredByColour.filter((product) =>
      themeFilters.value.length === 0
        ? true
        : product.theme &&
        themeFilters.value.some((theme) =>
          product.theme.slug === theme),

      // console.log("Theme ", JSON.stringify(product.theme, null, 2))
    );
    return false;
  },
  // console.log("FiltedProduct Count: ", filteredProducts.value.length),
  { deep: true, immediate: true },
);

const showFilters = useDialog();
const openDialog = () => {
  const dialogRef = showFilters.open(productFilters, {
    data: {
      themes: productThemes,
      colours: productColours,
    },
    props: {
      header: "Filter products",
      style: {
        width: "85vw",
      },
      breakpoints: {
        "960px": "50vw",
        "640px": "75vw",
      },
      modal: true,
    },
    onClose: (filters) => {
      themeFilters.value = filters.data.themes;
      colourFilters.value = filters.data.colours;
      // console.log("Theme Filters: ", JSON.stringify(themeFilters.value));
    },
  });
  // console.log("From openDialog: ", dialogRef);
};

// console.log("All Products: ", JSON.stringify(allProducts.value));

// console.log(JSON.stringify(allProducts.value, null, 2));
const productCount = allProducts.value.length;
// console.log("Product Count: ", productCount);
const currentProduct = Math.floor(Math.random() * productCount);
// console.log("Current Product index: ", currentProduct);
const product = allProducts.value[currentProduct];

useSeoMeta({
  title: computed(() => settings?.name || ''),
  ogTitle: computed(() => settings?.name || ''),
  description: computed(() => settings?.description || ''),
  ogDescription: computed(() => settings?.description || ''),
  twitterTitle: computed(() => settings?.name || ''),
  twitterDescription: computed(() => settings?.description || ''),
  twitterCard: "summary_large_image",
});

const productSettings = (({
  title: settings?.title,
  productTitle: product.store?.title,
  description: settings?.description,
  siteName: settings?.title,
  image: product.featureImage?.url || product?.defaultImageUrl,
  siteLogo: settings?.logoUrl,
}))
defineOgImageComponent('product', productSettings);

definePageMeta({
  layout: false,
});
</script>

<template>
  <div>
    <NuxtLayout name="internal">
      <template #main>
        <product-collection-buttons :collectionNav="collectionNav" />
        <section id="product-list">
          <product-list :loading="isLoading" v-if="filteredProducts.length > 0" :products="filteredProducts" />
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
