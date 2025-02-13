<script setup>
const data = useSiteSettingsStore();
const settings = data.settings;
const printifyColNav = usePrintifyCollectionNavigationStore();
const collections = printifyColNav.printifyCollectionNavigation;

const collectionCount = collections.printifyCollectionNavGroup.length;
// console.log("collectionCount: ", collectionCount);
const currentCollection = Math.floor(Math.random() * collectionCount);
// console.log("Current Product index: ", currentProduct);
const collection = collections.printifyCollectionNavGroup[currentCollection];
// console.log("Current Collection: ", JSON.stringify(collection, null, 2));

const isLoading = ref(true);
setTimeout(() => {
  isLoading.value = false;
}, 500)
useSeoMeta({
  title: computed(() => settings?.name || ''),
  ogTitle: computed(() => settings?.name || ''),
  // ogImage: computed(() => collection.parentCollection?.imageUrl || ''),
  description: computed(() => collection.parentCollection?.description || ''),
  ogDescription: computed(() => collection.parentCollection?.description || ''),
  twitterTitle: computed(() => collection.parentCollection?.name || ''),
  // twitterImage: computed(() => collection.parentCollection?.image?.url || ''),
  twitterDescription: computed(() => collection.parentCollection?.description || ''),
  twitterCard: "summary_large_image",
});

const collectionSettings = (({
  title: collection.parentCollection?.name,
  description: collection.parentCollection?.description,
  image: collection.parentCollection?.imageUrl,
  url: collection.parentCollection?.url,
}));
defineOgImageComponent('collection', collectionSettings.value);

definePageMeta({
  layout: false,
});
</script>
<template>
  <div>
    <NuxtLayout name="internal">
      <template #main>
        <section id="products-by-collection" class="mb-8">
          <div class="flex flex-col md:col-span-3 md:h-full"
            v-for="collection in collections.printifyCollectionNavGroup" :key="collection._id">
            <product-collection-card :collection="collection.parentCollection" :loading="isLoading" />
          </div>
        </section>
      </template>
      <template #sidebar>
        <product-sidebar />
      </template>
    </NuxtLayout>
  </div>
</template>
