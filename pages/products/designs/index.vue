<script setup>
import { qryProductThemes } from '~/queries/printify';
const { data: themes } = await useSanityQuery(qryProductThemes)
// console.log("Themes: ", JSON.stringify(themes))
const data = useSiteSettingsStore();
const settings = data.settings;
const printifyColNav = usePrintifyCollectionNavigationStore();
const collections = printifyColNav.printifyCollectionNavigation;

const collectionCount = collections.printifyCollectionNavGroup.length;
// // console.log("collectionCount: ", collectionCount);
const currentCollection = Math.floor(Math.random() * collectionCount);
// // console.log("Current Product index: ", currentProduct);
const collection = collections.printifyCollectionNavGroup[currentCollection];
// console.log("Current Collection: ", JSON.stringify(collection, null, 2));

useSeoMeta({
  title: () => collection.parentCollection.title,
  ogTitle: () => collection.parentCollection.title,
  description: () => collection.parentCollection.description,
  ogDescription: () => collection.parentCollection.description,
  ogImage: () => collection.parentCollection.image.url,
  twitterTitle: () => collection.parentCollection.title,
  twitterDescription: () => collection.parentCollection.description,
  twitterImage: () => collection.parentCollection.image.url,
  twitterCard: "summary_large_image",
});

defineOgImageComponent(
  'collection',
  {
    title: collection.parentCollection.title,
    description: collection.parentCollection.description,
    image: collection.parentCollection.image.url,
    siteName: settings.title,
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
        <section id="products-by-theme" class="mb-8">
          <div class="semi-bold italic">
            <p>Lets face it. All our products are top quality, and we have a lot of them. But when you get right down to
              it, you're here because you want to make a statement. So, here is where all the statements live.</p>
            <p>&nbsp;</p>
            <p>Explore our designs and come back regularly, as we are adding to our library of designs every week.</p>
            <p>&nbsp;</p>
            <p>Click on a prefered design to see all the products available carrying that design.</p>
          </div>
          <Divider />
          <div v-for="theme in themes" :key="theme._id">
            <product-theme-design-list :theme="theme" />
          </div>
        </section>
      </template>
      <template #sidebar>
        <product-sidebar />
      </template>
    </NuxtLayout>
  </div>
</template>
