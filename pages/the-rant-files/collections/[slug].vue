<script setup>
import {
  qryArticlesByCategory,
  qryArticleCollectionNavigation,
} from "~/queries/articles";

definePageMeta({
  layout: false,
});

const route = useRoute();
const routeParams = route.params;
// console.log(routeParams.slug);

const { data: collectionNav } = await useSanityQuery(qryArticleCollectionNavigation);

const { data: collection } = await useSanityQuery(qryArticlesByCategory, {
  slug: routeParams.slug,
});
// console.log(JSON.stringify(collection.value));

const articles = collection.value.articles;
</script>
<template>
  <NuxtLayout name="internal">
    <template #main>
      <section id="collection">
        <div class="pb-5">
          <h1>
            {{ collection.name }}
          </h1>
          <SanityContent v-if="collection.description" :blocks="collection.description" />
        </div>
        <!-- <pre>{{ articles }}</pre> -->
        <article-list :articles="articles" />
      </section>
    </template>
    <template #sidebar>
      <div
        class="sticky top-[95px] mx-3 grid grid-cols-1 @md:grid-cols-2 @md:gap-8">
        <div><article-category-list :collectionNav="collectionNav" /></div>
        <div><product-showcase/></div>
        <div><article-latest /></div>
      </div>
    </template>
  </NuxtLayout>
</template>
