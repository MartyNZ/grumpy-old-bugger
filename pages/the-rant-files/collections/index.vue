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
