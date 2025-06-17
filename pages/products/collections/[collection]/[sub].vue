<script setup>
import {
  qryPrintifyCollectionBySlug,
  qryProductsByTags,
} from "~/queries/printify";
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

const isLoading = ref(true);
const { data: currentCollection } = await useSanityQuery(
  qryPrintifyCollectionBySlug,
  {
    slug: sub,
  },
)
  .finally(() => {
    isLoading.value = false;
  });

// console.log("Current Collection: ", JSON.stringify(currentCollection.value, null, 2));
const { data: allProducts } = await useSanityQuery(qryProductsByTags, {
  collection: tagsLookup[collection],
  sub: tagsLookup[sub],
});

const filteredProducts = ref([]);
filteredProducts.value = allProducts.value;
// console.log("Filtered Product Count: ", filteredProducts.value.length);

// Create the title as a computed property
const pageTitle = computed(() => `Products from our ${currentCollection.value.title} collection`);
useHead({
  title: pageTitle.value,
});
useSeoMeta({
  title: () => pageTitle.value,
  description: () => currentCollection.value.description,
  ogTitle: () => pageTitle.value,
  ogDescription: () => currentCollection.value.description,
  ogImage: () => currentCollection.value.image?.asset.url,
  twitterTitle: () => pageTitle.value,
  twitterDescription: () => currentCollection.value.description,
  twitterImage: () => currentCollection.value.image?.asset.url,
  twitterCard: "summary_large_image",
});
// console.log("Current Collection: ", JSON.stringify(currentCollection.value, null, 2));
definePageMeta({
  layout: false,
});

// defineOgImageComponent(
//   'collection',
//   {
//     title: currentCollection.value.title,
//     description: currentCollection.value.excerpt,
//     siteName: settings.title,
//     image: currentCollection.value.imageUrl,
//     siteLogo: settings.logoUrl,
//   }
// );

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
                <!-- <Button outlined rounded size="small" @click="openDialog" class="w-[12ch] flex-none" label="Filters">
                  <icons-fa-duotone-filters />
                  <span>Filters</span>
                </Button>
                <Button v-if="themeFilters.length > 0 || colourFilters.length > 0" outlined rounded size="small"
                  @click="clearFilters" class="flex gap-1" label="Filters">
                  <icons-fa-duotone-circle-xmark />
                  <span>Clear Filters</span>
                </Button>
                <Divider layout="vertical" /> -->
                <!-- <NuxtLink to="/products/designs"
                  class="relative items-center justify-center inline-flex text-center align-bottom text-sm px-2 py-1 min-w-[2rem] shadow-sm rounded-full bg-transparent dark:text-primary-300 dark:hover:bg-primary-700 dark:hover:text-primary-100 dark:ring-primary-300 dark:hover:ring-primary-100 text-primary-500 ring-1 ring-primary-500 hover:bg-primary-200 hover:text-primary-950 focus:outline-none focus:outline-offset-0 focus:ring-2 focus:ring-offset-current focus:ring-primary-500 dark:focus:ring-primary-400 transition duration-200 ease-in-out cursor-pointer overflow-hidden select-none semi-bold">
                  Explore our designs
                </NuxtLink> -->
              </div>
            </div>
          </div>
          <product-list :products="filteredProducts" :loading="isLoading" />
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
