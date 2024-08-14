<script setup>
import {
  qryAllArticlesByCategory,
  qryArticleCollectionNavigation,
} from "~/queries/articles";
const { data: allArticlesbyCategory } = await useSanityQuery(qryAllArticlesByCategory);
const { data: collectionNav } = await useSanityQuery(qryArticleCollectionNavigation);
// console.log("collectionNav: ", JSON.stringify(collectionNav.value));

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
          <h2>{{ category.name }}</h2>
          <SanityContent v-if="category.description" :blocks="category.description" />
        </div>
        <article-list :articles="category.articles" />
        <!-- <article-carousel :articles="category.articles" /> -->
      </div>
    </template>
    <template #sidebar>
      <div class="sticky top-[95px] mx-3 grid grid-cols-1 @md:grid-cols-2 @md:gap-3">
        <div><article-category-list :collectionNav="collectionNav" /></div>
        <div><product-showcase /></div>
        <div><article-latest /></div>
      </div>
    </template>
  </NuxtLayout>
</template>
