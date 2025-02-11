<script setup>
// const settings = useSiteSettingsStore().settings
import { qryArticlesSection, qryArticles, qryArticleLatest } from '~/queries/articles'

const data = useSiteSettingsStore();
const settings = data.settings;

const isLoadingSection = ref(true)
const { data: articlesSection } = await useSanityQuery(qryArticlesSection).finally(() => {
  isLoadingSection.value = false
});

// console.log("Articles Section: ", JSON.stringify(articlesSection.value, null, 2))
const isLoadingArticles = ref(true)
const { data: articles } = await useSanityQuery(qryArticles).finally(() => {
  isLoadingArticles.value = false
});
// console.log("Articles: ", JSON.stringify(articles.value, null, 2))
const isLoadingLatest = ref(true)
const { data: latestArticle } = await useSanityQuery(qryArticleLatest).finally(() => {
  isLoadingLatest.value = false
});
// console.log("Latest Article: ", JSON.stringify(latestArticle.value, null, 2))

useSeoMeta({
  title: computed(() => articlesSection.value?.title || ''),
  description: computed(() => articlesSection.value?.excerpt || ''),
  ogTitle: computed(() => articlesSection.value?.title || ''),
  ogDescription: computed(() => articlesSection.value?.excerpt || ''),
  // ogImage: computed(() => articlesSection.value?.image.url || ''),
  twitterTitle: computed(() => articlesSection.value?.title || ''),
  twitterDescription: computed(() => articlesSection.value?.excerpt || ''),
  // twitterImage: computed(() => articlesSection.value?.image.url || ''),
  twitterCard: "summary_large_image",
});

const siteSettings = computed(() => ({
  title: data.settings?.title || '',
  description: data.settings?.description || '',
  image: data.settings?.image || '',
  siteName: data.settings?.title || '',
  icon: data.settings?.logoUrl || ''
}))

defineOgImageComponent('default', siteSettings.value)

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
            <article-list :articles="articles" :loading="isLoadingArticles" />
          </section>
        </div>
      </div>
    </template>
    <template #sidebar>
      <article-sidebar />
    </template>
  </NuxtLayout>
</template>
