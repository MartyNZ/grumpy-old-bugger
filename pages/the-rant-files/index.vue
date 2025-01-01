<script setup>
// const settings = useSiteSettingsStore().settings
import { qryArticlesSection, qryArticles, qryArticleLatest } from '~/queries/articles'

const data = useSiteSettingsStore();
const settings = data.settings;

const { data: articlesSection } = await useSanityQuery(qryArticlesSection)

// console.log("Articles Section: ", JSON.stringify(articlesSection.value, null, 2))

const { data: articles } = await useSanityQuery(qryArticles)
// console.log("Articles: ", JSON.stringify(articles.value, null, 2))
const { data: latestArticle } = await useSanityQuery(qryArticleLatest)
// console.log("Latest Article: ", JSON.stringify(latestArticle.value, null, 2))

useSeoMeta({
  title: () => articlesSection.value.title,
  description: () => articlesSection.value.excerpt,
  ogTitle: () => articlesSection.value.title,
  ogDescription: () => articlesSection.value.excerpt,
  // ogImage: () => articlesSection.value.image.url,
  twitterTitle: () => articlesSection.value.title,
  twitterDescription: () => articlesSection.value.excerpt,
  // twitterImage: () => articlesSection.value.image.url,
  twitterCard: "summary_large_image",
});

defineOgImageComponent(
  'article',
  {
    title: latestArticle.value.title,
    description: latestArticle.value.excerpt,
    siteName: settings.title,
    image: latestArticle.value.image.url,
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
      <div id="article-main" class="container mx-auto p-4 md:p-6">
        <div id="page-layout">
          <section id="articles-list" class="articles">
            <h2>{{ articlesSection.title }}</h2>
            <p class="mb-8">{{ articlesSection.description }}</p>
            <!-- <pre>{{ articles }}</pre> -->
            <article-list :articles="articles" />
          </section>
        </div>
      </div>
    </template>
    <template #sidebar>
      <article-sidebar />
    </template>
  </NuxtLayout>
</template>
