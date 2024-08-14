<script setup>
const data = useSiteSettingsStore();
const settings = data.settings;
import {
  qryArticleCollectionNavigation,
  qryArticlesLatest,
} from "~/queries/articles";

const { data: collectionNav } = await useSanityQuery(
  qryArticleCollectionNavigation,
);

const { data: articles } = await useSanityQuery(qryArticlesLatest);
// console.log("Current Article: ", JSON.stringify(articles.value[0], null, 2));
const currentArticle = articles.value[0];

useSeoMeta({
  title: () => currentArticle.title,
  description: () => currentArticle.excerpt,
  ogTitle: () => currentArticle.title,
  ogDescription: () => currentArticle.excerpt,
  ogImage: () => currentArticle.image.url,
  twitterTitle: () => currentArticle.title,
  twitterDescription: () => currentArticle.excerpt,
  twitterImage: () => currentArticle.image.url,
  twitterCard: "summary_large_image",
});

defineOgImageComponent(
  "article",
  {
    title: currentArticle.title,
    description: currentArticle.excerpt,
    image: currentArticle.image.url,
    siteName: settings.title,
    siteLogo: settings.logoUrl,
  },
);

definePageMeta({
  layout: false,
});
</script>
<template>
  <NuxtLayout name="internal">
    <template #main>
      <div class="pb-5">
        <p>Welcome to "The Rant Files," the ultimate refuge for the grumpiest old buggers around! Dive into a treasure
          trove of unapologetic tirades, brutally honest reviews, and cynical musings on everything from the latest
          gadgets to the state of the world. Here, we don’t sugarcoat—if it’s worth griping about, you’ll find it here.
          Perfect for those who've earned the right to say it like it is. Buckle up, because this is where no-nonsense
          meets no filter.</p>
      </div>
      <article-list :articles="articles" />
    </template>
    <template #sidebar>
      <div class="sticky top-[95px] mx-3 grid grid-cols-1 @md:grid-cols-2 @md:gap-3">
        <!-- <div class="hidden lg:block"><product-promotions /></div> -->
        <div><article-category-list :collectionNav="collectionNav" /></div>
        <div><product-showcase /></div>
        <div><article-latest /></div>
      </div>
    </template>
  </NuxtLayout>
</template>
