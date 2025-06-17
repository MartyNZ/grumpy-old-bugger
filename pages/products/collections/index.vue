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

// Create the title as a computed property
const pageTitle = computed(() => `Our Product collections`);
useHead({
  title: pageTitle.value,
});
useSeoMeta({
  title: computed(() => pageTitle.value || ''),
  ogTitle: computed(() => pageTitle.value || ''),
  twitterTitle: computed(() => pageTitle.value || ''),
  description: computed(() => settings?.description || ''),
  ogDescription: computed(() => settings?.description || ''),
  twitterDescription: computed(() => settings?.description || ''),
  ogImage: computed(() => collection.parentCollection?.image?.asset.url || ''),
  twitterImage: computed(() => collection.parentCollection?.image?.asset.url || ''),
  twitterCard: "summary_large_image",
});

definePageMeta({
  layout: false,
});

// const collectionSettings = (({
//   title: collection.parentCollection?.name,
//   description: collection.parentCollection?.description,
//   image: collection.parentCollection?.imageUrl,
//   url: collection.parentCollection?.url,
// }));
// defineOgImageComponent('collection', collectionSettings.value);

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
