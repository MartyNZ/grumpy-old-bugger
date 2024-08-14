<script setup>
import { qryAllProducts } from "~/queries/printify";
const printifyCollectionNavigationStore =
  usePrintifyCollectionNavigationStore();
const collectionNav =
  printifyCollectionNavigationStore.printifyCollectionNavigation;

const data = useSiteSettingsStore();
const settings = data.settings;
const { data: allProducts } = await useSanityQuery(qryAllProducts);
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
      // console.log("Colours Filters: ", JSON.stringify(colourFilters.value));
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
  title: () => settings.name,
  ogTitle: () => settings.name,
  ogImage: () => product.featureImage?.url || product.defaultImageUrl,
  description: () => settings.description,
  ogDescription: () => settings.description,
  twitterTitle: () => settings.name,
  twitterImage: () => product.featureImage?.url || product.defaultImageUrl,
  twitterDescription: () => settings.description,
  twitterCard: "summary_large_image",
});

defineOgImageComponent(
  'products',
  {
    title: settings.title,
    productTitle: product.store.title,
    description: settings.description,
    siteName: settings.title,
    image: product.featureImage?.url || product.defaultImageUrl,
    siteLogo: settings.logoUrl,
  },
);

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
          <div class="align-center flex flex-col justify-between pb-5">
            <div>
              <h1>Our Full Product Collection</h1>
              <!-- <p>Welcome to our products page.</p> -->
            </div>
            <div id="filter-control" class="flex flex-wrap gap-4 justify-between w-full">
              <div class="max-w-48 w-full text-nowrap content-center text-sm italic">
                You are viewing<br />{{ filteredProducts.length }} of {{ allProducts.length }} products
              </div>
              <div class="flex gap-2">
                <Button outlined rounded size="small" @click="openDialog" class="w-[12ch] flex-none" label="Filters">
                  <icons-fa-duotone-filters />
                  <span>Filters</span>
                </Button>
                <Button v-if="themeFilters.length > 0 || colourFilters.length > 0" outlined rounded size="small"
                  @click="clearFilters" class="flex gap-1" label="Filters">
                  <icons-fa-duotone-circle-xmark />
                  <span>Clear Filters</span>
                </Button>
                <Divider layout="vertical" />
                <NuxtLink to="/products/designs"
                  class="relative items-center justify-center inline-flex text-center align-bottom text-sm px-2 py-1 min-w-[2rem] shadow-sm rounded-full bg-transparent dark:text-primary-300 dark:hover:bg-primary-700 dark:hover:text-primary-100 dark:ring-primary-300 dark:hover:ring-primary-100 text-primary-500 ring-1 ring-primary-500 hover:bg-primary-200 hover:text-primary-950 focus:outline-none focus:outline-offset-0 focus:ring-2 focus:ring-offset-current focus:ring-primary-500 dark:focus:ring-primary-400 transition duration-200 ease-in-out cursor-pointer overflow-hidden select-none semi-bold">
                  Explore our designs
                </NuxtLink>
              </div>
            </div>
          </div>
          <product-list v-if="filteredProducts.length > 0" :products="filteredProducts" />
        </section>
      </template>
      <template #sidebar>
        <product-sidebar />
      </template>
    </NuxtLayout>
  </div>
</template>
