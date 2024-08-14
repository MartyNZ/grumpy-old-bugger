<script setup>
import { qryArticlesLatest3 } from "~/queries/articles";
import { qryFeaturedProducts, qryLatestProducts } from "~/queries/printify";
import { qryAllLivePromotions } from "~/queries/promotions";

const printifyCollectionNavigationStore =
  usePrintifyCollectionNavigationStore();
const collectionNav =
  printifyCollectionNavigationStore.printifyCollectionNavigation;

const { data: latestArticles } = await useSanityQuery(qryArticlesLatest3);
const { data: latestProducts } = await useSanityQuery(qryLatestProducts);
const { data: products } = await useSanityQuery(qryFeaturedProducts);
const { data: promotions } = await useSanityQuery(qryAllLivePromotions);
const data = useSiteSettingsStore();
const settings = data.settings;
// console.log("From Index: ", JSON.stringify(settings));

useSeoMeta({
  title: () => settings.title,
  ogTitle: () => settings.title,
  description: () => settings.description,
  ogDescription: () => settings.description,
  ogImage: () => settings.image,
  twitterTitle: () => settings.title,
  twitterDescription: () => settings.description,
  twitterImage: () => settings.image,
  twitterCard: "summary_large_image",
});

defineOgImageComponent(
  'default',
  {
    title: settings.title,
    description: settings.description,
    image: settings.image,
    siteName: settings.title,
    siteLogo: settings.logoUrl,
  });

definePageMeta({
  layout: "homepage",
});

</script>

<template>
  <div>
    <promotion-carousel :promotions="promotions" />
    <!-- <layout-hero-01 /> -->
    <main class="@container mx-auto mb-16 max-w-[1280px] px-4">
      <product-collection-buttons :collectionNav="collectionNav" />
      <product-list :products="products" sectionTitle="Featured Products" />
      <article-list :articles="latestArticles" />
      <!-- <product-collection-list /> -->
      <product-list :products="latestProducts" sectionTitle="Latest Products" />
    </main>
  </div>
</template>
