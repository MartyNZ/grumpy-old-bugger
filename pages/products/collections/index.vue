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

useSeoMeta({
  title: () => settings.name,
  ogTitle: () => settings.name,
  ogImage: () => collection.parentCollection.imageUrl,
  description: () => collection.parentCollection.description,
  ogDescription: () => collection.parentCollection.description,
  twitterTitle: () => collection.parentCollection.name,
  twitterImage: () => collection.parentCollection.image.url,
  twitterDescription: () => collection.parentCollection.description,
  twitterCard: "summary_large_image",
});

defineOgImageComponent('collection', {
  title: collection.parentCollection.title,
  description: collection.parentCollection.description,
  siteName: settings.title,
  image: collection.parentCollection.image.url,
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
        <section id="products-by-collection" class="mb-8">
          <div class="flex flex-col md:col-span-3 md:h-full"
            v-for="collection in collections.printifyCollectionNavGroup" :key="collection._id">
            <product-collection-card :collection="collection.parentCollection" />
          </div>
        </section>
      </template>
      <template #sidebar>
        <product-sidebar />
      </template>
    </NuxtLayout>
  </div>
</template>
