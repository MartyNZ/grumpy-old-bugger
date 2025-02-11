<script setup>
import { qryFeaturedProducts, qryLatestProducts } from "~/queries/printify";
import { qryAllLivePromotions } from "~/queries/promotions";
import { qryArticleLatest } from "~/queries/articles";

const printifyCollectionNavigationStore =
  usePrintifyCollectionNavigationStore();
const collectionNav =
  printifyCollectionNavigationStore.printifyCollectionNavigation;

const { data: latestArticles } = await useSanityQuery(qryArticleLatest);
const { data: latestProducts } = await useSanityQuery(qryLatestProducts);
const { data: products } = await useSanityQuery(qryFeaturedProducts);
const { data: promotions } = await useSanityQuery(qryAllLivePromotions);
const data = useSiteSettingsStore();
const settings = data.settings;
// console.log("From Index: ", JSON.stringify(settings, null, 2));

useSeoMeta({
  icon: computed(() => settings.logoUrl),
  title: computed(() => settings.title),
  ogTitle: computed(() => settings.title),
  description: computed(() => settings.description),
  ogDescription: computed(() => settings.description),
  ogImage: computed(() => settings.image),
  twitterTitle: computed(() => settings.title),
  twitterDescription: computed(() => settings.description),
  twitterImage: computed(() => settings.image),
  twitterCard: "summary_large_image",
});

defineOgImageComponent(
  'default',
  {
    title: settings.title,
    description: settings.description,
    image: settings.image,
    siteName: settings.title,
    icon: settings.logoUrl,
  });

definePageMeta({
  layout: "false",
});

</script>

<template>
  <div>
    <NuxtLayout name="homepage">
      <promotion-carousel :promotions="promotions" />
      <main class="@container mx-auto mb-16 max-w-[1280px] px-4">
        <product-collection-buttons :collectionNav="collectionNav" required />
        <product-list :products="products" sectionTitle="Featured Products" required />
        <article-list :articles="latestArticles" required />
        <product-list :products="latestProducts" sectionTitle="Latest Products" required />
      </main>
    </NuxtLayout>
  </div>
</template>
