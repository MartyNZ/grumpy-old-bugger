<script setup>
import {
  qryArticlesByCategory,
} from "~/queries/articles";

const data = useSiteSettingsStore();
const settings = data.settings;

const route = useRoute();
const routeParams = route.params;
// console.log(routeParams.slug);


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
  ogImage: computed(() => collection.value?.image.asset.url || ''),
  twitterTitle: computed(() => collection.value?.title || ''),
  twitterDescription: computed(() => collection.value?.excerpt || ''),
  twitterImage: computed(() => collection.value?.image.asset.url || ''),
  twitterCard: "summary_large_image",
});

definePageMeta({
  layout: false,
});

// const articleSettings = computed(() => ({
//   title: collection.value?.title,
//   description: collection.value?.excerpt,
//   image: collection.value?.image.url,
//   siteName: settings?.title,
//   siteLogo: settings?.logoUrl,
// }));
// defineOgImageComponent('article', articleSettings.value);

</script>
<template>
  <NuxtLayout name="internal">
    <template #main>
      <section id="collection">
        <div class="pb-5">
          <template v-if="isLoading">
            <Skeleton width="40%" height="2rem" class="mb-2" />
          </template>
          <h1 v-else>
            {{ collection.title }}
          </h1>

          <template v-if="isLoading">
            <Skeleton width="100%" height="20rem" class="mb-2" />
          </template>
          <SanityContent v-else-if="collection.description" :blocks="collection.description" />
        </div>
        <article-list :articles="articles" :loading="isLoading" />
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
