<script setup>
// const settings = useSiteSettingsStore().settings
import { qryArticlesSection, qryArticles, qryArticleLatest } from '~/queries/articles'

const data = useSiteSettingsStore();
const settings = data.settings;

const isLoadingArticlesSection = ref(true)
const { data: articlesSection } = await useSanityQuery(qryArticlesSection).finally(() => {
  isLoadingArticlesSection.value = false
});

// console.log("Articles Section: ", JSON.stringify(articlesSection.value, null, 2))
const isLoadingArticles = ref(true)
const { data: articles } = await useSanityQuery(qryArticles).finally(() => {
  isLoadingArticles.value = false
});
// console.log("Articles: ", JSON.stringify(articles.value, null, 2))

useSeoMeta({
  title: computed(() => articlesSection.value?.title || ''),
  description: computed(() => articlesSection.value?.description || ''),
  ogTitle: computed(() => articlesSection.value?.title || ''),
  ogDescription: computed(() => articlesSection.value?.description || ''),
  ogImage: computed(() => articlesSection.value?.image.asset.url || ''),
  twitterTitle: computed(() => articlesSection.value?.title || ''),
  twitterDescription: computed(() => articlesSection.value?.description || ''),
  twitterImage: computed(() => articlesSection.value?.image.asset.url || ''),
  twitterCard: "summary_large_image",
});

definePageMeta({
  layout: false,
});

// const siteSettings = computed(() => ({
//   title: data.settings?.title || '',
//   description: data.settings?.description || '',
//   image: data.settings?.image || '',
//   siteName: data.settings?.title || '',
//   icon: data.settings?.logoUrl || ''
// }))
// defineOgImageComponent('default', siteSettings.value)

</script>
<template>
  <NuxtLayout name="internal">
    <template #main>
      <div id="article-main" class="container mx-auto p-4 md:p-6">
        <div id="page-layout">
          <section id="articles-list" class="articles">
            <template v-if="isLoadingArticlesSection">
              <div class="flex flex-col gap-4 pb-16">
                <Skeleton width="25%" height="30px" />
                <Skeleton width="100%" height="250px" />
              </div>
            </template>
            <template v-else>
              <h2>{{ articlesSection.title }}</h2>
              <p class="mb-8">{{ articlesSection.description }}</p>
            </template>
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
