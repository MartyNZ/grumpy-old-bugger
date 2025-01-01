<script setup>
import {
  qryAllArticlesByCategory,
  qryArticleCollectionNavigation,
} from "~/queries/articles";

const data = useSiteSettingsStore();
const settings = data.settings;
const { data: allArticlesbyCategory } = await useSanityQuery(qryAllArticlesByCategory);
const { data: collectionNav } = await useSanityQuery(qryArticleCollectionNavigation);
// console.log("collectionNav: ", JSON.stringify(collectionNav.value, null, 2));
const collectionCount = collectionNav.value.articleCollectionNavGroup.length;
const currentCollection = collectionNav.value.articleCollectionNavGroup[Math.floor(Math.random() * collectionCount)];
// console.log("Current Collection: ", JSON.stringify(currentCollection, null, 2));

useSeoMeta({
  title: () => currentCollection.title,
  description: () => currentCollection.parentCollection.excerpt,
  ogTitle: () => currentCollection.title,
  ogDescription: () => currentCollection.parentCollection.excerpt,
  // ogImage: () => currentCollection.parentCollection.image.url,
  twitterTitle: () => currentCollection.title,
  twitterDescription: () => currentCollection.parentCollection.excerpt,
  // twitterImage: () => currentCollection.parentCollection.image.url,
  twitterCard: "summary_large_image",
});

defineOgImageComponent(
  'article',
  {
    title: currentCollection.title,
    description: currentCollection.parentCollection.excerpt,
    siteName: settings.title,
    image: currentCollection.parentCollection.image.url,
    siteLogo: settings.logoUrl,
  }
);

definePageMeta({
  layout: false,
});
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
        <article-list :articles="category.articles" />
        <!-- <article-carousel :articles="category.articles" /> -->
      </div>
    </template>
    <template #sidebar>
      <article-sidebar />
    </template>
  </NuxtLayout>
</template>
