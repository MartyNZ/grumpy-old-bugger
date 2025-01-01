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

const { data: collection } = await useSanityQuery(qryArticlesByCategory, {
  slug: routeParams.slug,
});
// console.log("Collection: ", JSON.stringify(collection.value, null, 2));

const articles = collection.value.articles;

useSeoMeta({
  title: () => collection.value.title,
  description: () => collection.value.excerpt,
  ogTitle: () => collection.value.title,
  ogDescription: () => collection.value.excerpt,
  // ogImage: () => collection.value.image.url,
  twitterTitle: () => collection.value.title,
  twitterDescription: () => collection.value.excerpt,
  // twitterImage: () => collection.value.image.url,
  twitterCard: "summary_large_image",
});

defineOgImageComponent(
  'article',
  {
    title: collection.value.title,
    description: collection.value.excerpt,
    siteName: settings.title,
    image: collection.value.image.url,
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
      <section id="collection">
        <div class="pb-5">
          <h1>
            {{ collection.title }}
          </h1>
          <SanityContent v-if="collection.description" :blocks="collection.description" />
        </div>
        <!-- <pre>{{ articles }}</pre> -->
        <article-list :articles="articles" />
      </section>
    </template>
    <template #sidebar>
      <article-sidebar />
    </template>
  </NuxtLayout>
</template>
