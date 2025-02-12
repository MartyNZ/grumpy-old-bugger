<script setup>
import { qryFeaturedProducts, qryLatestProducts } from "~/queries/printify";
import { qryAllLivePromotions } from "~/queries/promotions";
import { qryArticleLatest } from "~/queries/articles";

const printifyCollectionNavigationStore =
  usePrintifyCollectionNavigationStore();
const collectionNav =
  printifyCollectionNavigationStore.printifyCollectionNavigation;

const isLoadingLatestArticles = ref(true)
const { data: latestArticles } = await useSanityQuery(qryArticleLatest).finally(() => {
  isLoadingLatestArticles.value = false
});
const isLoadingLatestProducts = ref(true)
const { data: latestProducts } = await useSanityQuery(qryLatestProducts).finally(() => {
  isLoadingLatestProducts.value = false
});
const isLoadingFeaturedProducts = ref(true)
const { data: featuredProducts } = await useSanityQuery(qryFeaturedProducts).finally(() => {
  isLoadingFeaturedProducts.value = false
});
const isLoadingPromotions = ref(true)
const { data: promotions } = await useSanityQuery(qryAllLivePromotions).finally(() => {
  isLoadingPromotions.value = false
});
const data = useSiteSettingsStore();
const settings = data.settings;
// console.log("From Index: ", JSON.stringify(settings, null, 2));

useSeoMeta({
  icon: computed(() => settings?.logoUrl || ''),
  title: computed(() => settings?.title || ''),
  ogTitle: computed(() => settings?.title || ''),
  description: computed(() => settings?.description || ''),
  ogDescription: computed(() => settings?.description || ''),
  ogImage: computed(() => settings?.image || ''),
  twitterTitle: computed(() => settings?.title || ''),
  twitterDescription: computed(() => settings?.description || ''),
  twitterImage: computed(() => settings?.image || ''),
  twitterCard: "summary_large_image",
});
const pageSettings = computed(() => ({
  title: settings?.title,
  description: settings?.description,
  image: settings?.image,
  siteName: settings?.title,
  icon: settings?.logoUrl,
  twitterCard: "summary_large_image",
}))
defineOgImageComponent('default', pageSettings.value);

definePageMeta({
  layout: "false",
});

</script>

<template>
  <div>
    <NuxtLayout name="homepage">
      <promotion-carousel :promotions="promotions" :loading="isLoadingPromotions" />
      <main class="@container mx-auto mb-16 max-w-[1280px] px-4">
        <product-collection-buttons :collectionNav="collectionNav" />
        <product-list :products="featuredProducts" sectionTitle="Featured Products"
          :loading="isLoadingFeaturedProducts" />
        <article-list :articles="latestArticles" :loading="isLoadingLatestArticles" />
        <product-list :products="latestProducts" sectionTitle="Latest Products" :loading="isLoadingLatestProducts" />
      </main>
    </NuxtLayout>
  </div>
</template>
