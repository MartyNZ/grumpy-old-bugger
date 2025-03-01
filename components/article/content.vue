<script setup>
import Skeleton from "primevue/skeleton";

const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: true
  }
});
</script>
<template>
  <section id="article" class="mb-10">
    <template v-if="loading">
      <div class="card">
        <div class="border-round border-1 surface-border surface-card p-4">
          <div class="mb-3 flex">
            <Skeleton borderRadius="1rem" width="100%" height="2rem" class="mr-2"></Skeleton>
          </div>
          <Skeleton width="100%" height="250px"></Skeleton>
          <div class="justify-content-between mt-3 flex gap-2">
            <Skeleton width="12rem" height="2rem"></Skeleton>
            <Skeleton width="12rem" height="2rem"></Skeleton>
          </div>
        </div>
        <div>
          <Skeleton width="100%" height="600px"></Skeleton>
        </div>
      </div>
    </template>
    <template v-else>
      <div id="article-content">
        <h1 class="mb-6 text-balance text-2xl font-bold">
          {{ article.title }}
        </h1>
        <SanityImage :assetId="article.image.assetId"
          class="mb-6 aspect-video w-full rounded-lg object-cover shadow-lg dark:shadow-black/20"
          :alt="article.title" />

        <div class="mb-6 flex items-center">
          <div>
            <template v-if="article.authors">
              <span> Published: {{ article.publishedDate }} by </span>
              <span v-for="(author, index) in article.authors" :key="author._id">
                <NuxtLink :to="`/authors/${author.slug}`" class="font-medium">
                  <template v-if="author.nomDePlume">{{ author.nomDePlume }}</template>
                  <template v-else>{{ author.name }}</template>
                </NuxtLink>
                <template v-if="index < article.authors.length - 1">
                  ,&nbsp;
                </template>
              </span>
            </template>
          </div>
        </div>
        <div class="sanity-content">
          <SanityContent :blocks="article.body" />
        </div>
      </div>
    </template>
  </section>
</template>
