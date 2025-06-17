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
  ogImage: computed(() => article.value?.image.asset.url || ''),
  twitterTitle: computed(() => article.value?.title || ''),
  twitterDescription: computed(() => article.value?.excerpt || ''),
  twitterImage: computed(() => article.value?.image.asset.url || ''),
  twitterCard: "summary_large_image",
});

useSchemaOrg([
  defineArticle({
    // name and description can usually be inferred
    image: article.value.image.asset.url,
    datePublished: article.value._createdAt,
    dateModified: article.value.publishedDate,
  })
])

definePageMeta({
  layout: false,
});

// const articleSettings = computed(() => ({
//   title: article.value?.title || '',
//   description: article.value?.excerpt || '',
//   image: article.value?.image.url || '',
//   siteName: settings?.title || '',
//   siteLogo: settings?.logoUrl || '',
// }))
// defineOgImageComponent("article", articleSettings.value);
</script>

<template>
  <NuxtLayout name="internal">
    <template #main>
      <section id="article">
        <article-content :loading="isLoading" :article="article" />
      </section>
    </template>
    <template #sidebar>
      <article-sidebar />
    </template>
  </NuxtLayout>
</template>
