<script setup>
import {
  qryArticleBySlug,
  qryArticleCollectionNavigation,
} from "../../queries/articles";
const route = useRoute();
const routeParams = route.params;
const data = useSiteSettingsStore();
const settings = data.settings;


const isLoading = ref(true)
const { data: article } = await useSanityQuery(qryArticleBySlug, {
  slug: routeParams.slug,
}).finally(() => {
  isLoading.value = false
});
const relatedProducts = article.value.relatedProducts;
// console.log("relatedProducts: ", JSON.stringify(relatedProducts[0]));

const { data: collectionNav } = await useSanityQuery(
  qryArticleCollectionNavigation,
);
// console.log("collectionNav: ", JSON.stringify(articleCollections));

// const articleTags = article.value.tags;
// console.log("Article Tags: ", JSON.stringify(articleTags));
// console.log("Arrticle: ", JSON.stringify(article.value, null, 2));

useSeoMeta({
  title: computed(() => article.value?.title || ''),
  description: computed(() => article.value?.excerpt || ''),
  ogTitle: computed(() => article.value?.title || ''),
  ogDescription: computed(() => article.value?.excerpt || ''),
  // ogImage: computed(() => article.value?.image.url || ''),
  twitterTitle: computed(() => article.value?.title || ''),
  twitterDescription: computed(() => article.value?.excerpt || ''),
  // twitterImage: computed(() => article.value?.image.url || ''),
  twitterCard: "summary_large_image",
});

const articleSettings = computed(() => ({
  title: article.value?.title || '',
  description: article.value?.excerpt || '',
  image: article.value?.image.url || '',
  siteName: settings?.title || '',
  siteLogo: settings?.logoUrl || '',
}))
defineOgImageComponent("article", articleSettings.value);
useSchemaOrg([
  defineArticle({
    // name and description can usually be inferred
    image: article.value.image.url,
    datePublished: article.value._createdAt,
    dateModified: article.value.publishedDate,
  })
])

definePageMeta({
  layout: false,
});
</script>

<template>
  <NuxtLayout name="internal">
    <template #main>
      <section id="article">
        <template v-if="isLoading">
          <div class="flex flex-column gap-4">
            <!-- Title skeleton -->
            <Skeleton height="3rem" class="mb-4" />

            <!-- Meta info skeleton -->
            <div class="flex gap-3 mb-4">
              <Skeleton width="8rem" height="1.5rem" />
              <Skeleton width="8rem" height="1.5rem" />
            </div>

            <!-- Content skeleton -->
            <Skeleton height="200px" class="mb-4" />
            <Skeleton height="100px" class="mb-2" />
            <Skeleton height="100px" class="mb-2" />
            <Skeleton width="75%" height="100px" />
          </div>
        </template>
        <article-content v-else :article="article" />
      </section>
    </template>
    <template #sidebar>
      <template v-if="isLoading">
        <div class="flex flex-column gap-3">
          <Skeleton height="150px" />
          <Skeleton height="2rem" />
          <Skeleton height="2rem" />
          <Skeleton height="2rem" />
        </div>
      </template>
      <article-sidebar v-else />
    </template>
  </NuxtLayout>
</template>
