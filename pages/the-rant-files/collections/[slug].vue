<script setup>
import {
  qryArticlesByCategory,
  qryArticleCollectionNavigation,
} from "~/queries/articles";

const data = useSiteSettingsStore();
const settings = data.settings;

const route = useRoute();
const routeParams = route.params;
// console.log(routeParams.slug);

const { data: collectionNav } = await useSanityQuery(qryArticleCollectionNavigation);

const isLoading = ref(true)
const { data: collection } = await useSanityQuery(qryArticlesByCategory, {
  slug: routeParams.slug,
}).finally(() => {
  isLoading.value = false
});
// console.log("Collection: ", JSON.stringify(collection.value, null, 2));

const articles = collection.value.articles;

useSeoMeta({
  title: computed(() => collection.value?.title || ''),
  description: computed(() => collection.value?.excerpt || ''),
  ogTitle: computed(() => collection.value?.title || ''),
  ogDescription: computed(() => collection.value?.excerpt || ''),
  // ogImage: computed(() => collection.value?.image.url || ''),
  twitterTitle: computed(() => collection.value?.title || ''),
  twitterDescription: computed(() => collection.value?.excerpt || ''),
  // twitterImage: computed(() => collection.value?.image.url || ''),
  twitterCard: "summary_large_image",
});

const articleSettings = computed(() => ({
  title: collection.value?.title,
  description: collection.value?.excerpt,
  image: collection.value?.image.url,
  siteName: settings?.title,
  siteLogo: settings?.logoUrl,
}));
defineOgImageComponent('article', articleSettings.value);

definePageMeta({
  layout: false,
});
</script>
<template>
  <NuxtLayout name="internal">
    <template #main>
      <section id="collection">
        <div class="pb-5">
          <Skeleton v-if="isLoading" width="50%" height="3rem" />
          <h1 v-else>
            {{ collection.title }}
          </h1>

          <Skeleton v-if="isLoading" width="100%" height="6rem" class="mb-4" />
          <SanityContent v-else-if="collection.description" :blocks="collection.description" />
        </div>

        <div v-if="isLoading">
          <div v-for="n in 3" :key="n" class="mb-4">
            <Skeleton width="100%" height="12rem" />
          </div>
        </div>
        <article-list v-else :articles="articles" />
      </section>
    </template>
    <template #sidebar>
      <article-sidebar />
    </template>
  </NuxtLayout>
</template>

<style scoped>
.p-skeleton {
  background-color: var(--surface-ground);
}
</style>
