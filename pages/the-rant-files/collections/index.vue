<script setup>
import {
  qryAllArticlesByCategory,
  qryArticleCollectionNavigation,
} from "~/queries/articles";

const data = useSiteSettingsStore();
const settings = data.settings;

const isLoading = ref(true)
const { data: allArticlesbyCategory } = await useSanityQuery(qryAllArticlesByCategory).finally(() => {
  isLoading.value = false
});
const { data: collectionNav } = await useSanityQuery(qryArticleCollectionNavigation);
// console.log("collectionNav: ", JSON.stringify(collectionNav.value, null, 2));
const collectionCount = collectionNav.value.articleCollectionNavGroup.length;
const currentCollection = collectionNav.value.articleCollectionNavGroup[Math.floor(Math.random() * collectionCount)];
// console.log("Current Collection: ", JSON.stringify(currentCollection, null, 2));

useSeoMeta({
  title: computed(() => currentCollection?.title || ''),
  description: computed(() => currentCollection.parentCollection?.excerpt || ''),
  ogTitle: computed(() => currentCollection?.title || ''),
  ogDescription: computed(() => currentCollection.parentCollection?.excerpt || ''),
  ogImage: computed(() => currentCollection.parentCollection?.image.asset.url || ''),
  twitterTitle: computed(() => currentCollection?.title || ''),
  twitterDescription: computed(() => currentCollection.parentCollection?.excerpt || ''),
  twitterImage: computed(() => currentCollection.parentCollection?.image.asset.url || ''),
  twitterCard: "summary_large_image",
});

definePageMeta({
  layout: false,
});

// const articleSettings = computed(() => ({
//   title: currentCollection.title,
//   description: currentCollection.parentCollection.excerpt,
//   image: currentCollection.parentCollection.image.url,
//   siteName: settings.title,
//   siteLogo: settings.logoUrl,
// }))
// defineOgImageComponent('article', articleSettings.value);

</script>
<template>
  <NuxtLayout name="internal">
    <template #main>
      <h1 class="mb-2">All Collections</h1>

      <div v-for="category in allArticlesbyCategory" :key="category._id">
        <div id="header" class="my-2 pb-3">
          <h2>{{ category.title }}</h2>
          <SanityContent v-if="category.description" :blocks="category.description" />
        </div>
        <article-list :articles="category.articles" :loading="isLoading" />
      </div>
    </template>

    <template #sidebar>
      <article-sidebar />
    </template>
  </NuxtLayout>
</template>
