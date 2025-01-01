<script setup>
import {
  qryArticleBySlug,
  qryArticleCollectionNavigation,
} from "../../queries/articles";
const route = useRoute();
const routeParams = route.params;
const data = useSiteSettingsStore();
const settings = data.settings;

const { data: article } = await useSanityQuery(qryArticleBySlug, {
  slug: routeParams.slug,
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
  title: () => article.value.title,
  description: () => article.value.excerpt,
  ogTitle: () => article.value.title,
  ogDescription: () => article.value.excerpt,
  // ogImage: () => article.value.image.url,
  twitterTitle: () => article.value.title,
  twitterDescription: () => article.value.excerpt,
  // twitterImage: () => article.value.image.url,
  twitterCard: "summary_large_image",
});

defineOgImageComponent(
  "article",
  {
    title: article.value.title,
    description: article.value.excerpt,
    image: article.value.image.url,
    siteName: settings.title,
    siteLogo: settings.logoUrl,
  },
);
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
        <article-content :article="article" />
      </section>
    </template>
    <template #sidebar>
      <article-sidebar />
    </template>
  </NuxtLayout>
</template>
