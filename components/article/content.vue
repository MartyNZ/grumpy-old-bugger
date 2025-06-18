<script setup>
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
    <div id="article-content">
      <h1 class="mb-6 text-balance text-2xl font-bold">
        {{ article.title }}
      </h1>
      <div class="mb-6 aspect-video w-full rounded-lg shadow-lg dark:shadow-black/20 relative overflow-hidden" :style="{
        backgroundImage: article?.image?.asset?.metadata?.lqip
          ? `url(${article.image.asset.metadata.lqip})`
          : 'linear-gradient(135deg, rgb(var(--surface-200)) 0%, rgb(var(--surface-300)) 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }">
        <SanityImage :asset-id="article.image.asset._id"
          class="aspect-video w-full rounded-lg object-cover relative z-10" :alt="article.title" />
      </div>

      <div class="mb-6 flex items-center">
        <div>
          <template v-if="article.authors">
            <span> Published:
              <NuxtTime :datetime="article.publishedDate" /> by
            </span>
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
  </section>
</template>
