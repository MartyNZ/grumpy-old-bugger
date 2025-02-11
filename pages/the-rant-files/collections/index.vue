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
  // ogImage: computed(() => currentCollection.parentCollection?.image.url || ''),
  twitterTitle: computed(() => currentCollection?.title || ''),
  twitterDescription: computed(() => currentCollection.parentCollection?.excerpt || ''),
  // twitterImage: computed(() => currentCollection.parentCollection?.image.url || ''),
  twitterCard: "summary_large_image",
});

const articleSettings = computed(() => ({
  title: currentCollection.title,
  description: currentCollection.parentCollection.excerpt,
  image: currentCollection.parentCollection.image.url,
  siteName: settings.title,
  siteLogo: settings.logoUrl,
}))


defineOgImageComponent('article', articleSettings.value);

definePageMeta({
  layout: false,
});
</script>
<template>
  <NuxtLayout name="internal">
    <template #main>
      <h1 class="mb-2">All Collections</h1>

      <template v-if="isLoading">
        <div v-for="n in 3" :key="n" class="mb-6">
          <Skeleton height="2rem" class="mb-2" />
          <Skeleton height="4rem" class="mb-2" />
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="i in 3" :key="i" class="flex flex-col gap-2">
              <Skeleton height="12rem" />
              <Skeleton width="85%" height="1.5rem" />
              <Skeleton width="60%" height="1rem" />
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div v-for="category in allArticlesbyCategory" :key="category._id">
          <div id="header" class="my-2 pb-3">
            <h2>{{ category.title }}</h2>
            <SanityContent v-if="category.description" :blocks="category.description" />
          </div>
          <article-list :articles="category.articles" />
        </div>
      </template>
    </template>

    <template #sidebar>
      <article-sidebar />
    </template>
  </NuxtLayout>
</template>
