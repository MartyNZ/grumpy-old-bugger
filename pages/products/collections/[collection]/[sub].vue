<script setup>
import {
  qryPrintifyCollectionBySlug,
  qryProductsByTags,
} from "~/queries/printify";
const data = useSiteSettingsStore();
const settings = data.settings;
const tagsLookupStore = usePrintifyTagsLookupStore();
const tagsLookup = tagsLookupStore.tagsLookup;
const collection = useRoute().params.collection;
const sub = useRoute().params.sub;
const printifyCollectionNavigationStore =
  usePrintifyCollectionNavigationStore();
const collectionNav =
  printifyCollectionNavigationStore.printifyCollectionNavigation.printifyCollectionNavGroup.find(
    (col) => col.slug == collection,
  );

const { data: currentCollection } = await useSanityQuery(
  qryPrintifyCollectionBySlug,
  {
    slug: sub,
  },
);

// console.log(
//   "Current Collection: ",
//   JSON.stringify(currentCollection.value, null, 2),
// );
const { data: allProducts } = await useSanityQuery(qryProductsByTags, {
  collection: tagsLookup[collection],
  sub: tagsLookup[sub],
});

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
// console.log(JSON.stringify(allProducts.value[0], null, 2));
watch(
  [themeFilters, colourFilters],
  () => {
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

useSeoMeta({
  title: () => currentCollection.value.title,
  description: () => currentCollection.value.description,
  ogTitle: () => currentCollection.value.title,
  ogDescription: () => currentCollection.value.description,
  ogImage: () => currentCollection.value.imageUrl,
  twitterTitle: () => currentCollection.value.title,
  twitterDescription: () => currentCollection.value.description,
  twitterImage: () => currentCollection.value.imageUrl,
  twitterCard: "summary_large_image",
});

defineOgImageComponent('collection', {
  title: currentCollection.value.title,
  description: currentCollection.value.description,
  siteName: settings.title,
  image: currentCollection.value.imageUrl,
  siteLogo: settings.logoUrl,
});

definePageMeta({
  layout: false,
});
</script>
<template>
  <div>
    <NuxtLayout name="internal">
      <template #main>
        <section id="product-collection-navpanel" class="snaps-inline p-2">
          <template v-if="collectionNav.childCollections.length > 0">
            <NuxtLink v-for="child in collectionNav.childCollections" :key="child._id"
              :to="`/products/collections/${collectionNav.parentCollection.slug}/${child.slug}`"
              class="hover:bg-surface-300 dark:hover:bg-surface-700 focus:bg-surface-300 dark:border-surface-500 border-surface-700 active:ring-surface-700 dark:active:ring-surface-200 whitespace-nowrap text-nowrap rounded-full border-[1px] px-3 py-1 text-center active:ring-2 active:ring-offset-2">
              {{ child.title }}
            </NuxtLink>
          </template>
        </section>
        <section id="product-list">
          <div class="align-center flex flex-col justify-between pb-5">
            <div>
              <h1>
                Our {{ tagsLookup[collection] }}
                {{ tagsLookup[sub] }} Collection
              </h1>
              <p>{{ collectionNav.parentCollection.description }}</p>
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
          <product-list :products="filteredProducts" />
        </section>
      </template>
      <template #sidebar>
        <product-sidebar />
      </template>
    </NuxtLayout>
  </div>
</template>

<style scoped>
#product-collection-navpanel {
  display: grid;
  gap: 1.5em;
  grid-auto-flow: column;
  overscroll-behaviour-inline: contain;
  overflow-x: auto;
  padding-bottom: 0.75em;
  margin-bottom: 0.75em;
}

.snaps-inline {
  scroll-snap-type: inline mandatory;
  scroll-padding-inline: 0.5em;
}

.snaps-inline>* {
  scroll-snap-align: start;
}
</style>
