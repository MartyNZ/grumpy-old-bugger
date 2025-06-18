<script setup>
const route = useRoute();
const fullPath = route.fullPath;
const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: true
  },
});
// console.log("Article: ", JSON.stringify(props.article, null, 2))
</script>

<template>
  <div class="dark:bg-surface-700 flex flex-col overflow-hidden rounded shadow-lg">
    <div class="zoom shadow-surface-700 relative overflow-hidden rounded bg-cover bg-[50%] bg-no-repeat shadow-sm">
      <!-- LQIP background container -->
      <div class="aspect-video w-full relative" :style="{
        backgroundImage: !loading && article?.image?.asset?.metadata?.lqip
          ? `url(${article.image.asset.metadata.lqip})`
          : 'linear-gradient(135deg, rgb(var(--surface-200)) 0%, rgb(var(--surface-300)) 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }">
        <!-- Fallback gradient overlay for loading state -->
        <div v-if="loading || !article?.image?.asset?.metadata?.lqip"
          class="absolute inset-0 bg-gradient-to-br from-surface-200 to-surface-300 dark:from-surface-600 dark:to-surface-700 animate-pulse">
        </div>

        <SanityImage v-if="!loading && article?.image?.asset?._id" :assetId="article.image.asset._id"
          class="aspect-video w-full object-cover align-middle transition duration-300 ease-linear relative z-10"
          :alt="article.title" loading="lazy" placeholder />
      </div>

      <NuxtLink v-if="!loading" :to="`/the-rant-files/${article.slug}`">
        <div>
          <div
            class="mask absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,99.2%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out">
          </div>
        </div>
      </NuxtLink>

      <NuxtLink v-if="!loading && (fullPath == '/the-rant-files' || fullPath == '/')"
        :to="`/the-rant-files/collections/${article.category.slug}`">
        <div
          class="bg-primary-600 hover:text-primary-600 absolute right-0 top-0 mr-3 mt-3 rounded-sm px-4 py-2 text-xs text-white transition duration-500 ease-in-out hover:bg-white z-20">
          {{ article.category.title }}
        </div>
      </NuxtLink>
    </div>

    <div class="mb-auto px-2 py-4">
      <template v-if="loading">
        <div class="mb-2 h-6 bg-surface-200 dark:bg-surface-600 rounded animate-pulse"></div>
        <div class="space-y-2">
          <div class="h-4 bg-surface-200 dark:bg-surface-600 rounded animate-pulse"></div>
          <div class="h-4 bg-surface-200 dark:bg-surface-600 rounded animate-pulse w-3/4"></div>
        </div>
      </template>
      <template v-else>
        <NuxtLink :to="`/the-rant-files/${article.slug}`"
          class="mb-2 inline-block text-base font-medium transition duration-500 ease-in-out hover:text-primary-600 after:bg-primary-600 dark:after:bg-primary-300 relative after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:duration-300 after:content-[''] hover:after:w-[100%] hover:dark:text-primary-50">
          {{ article.title }}
        </NuxtLink>
        <p class="text-sm">{{ article.excerpt }}</p>
      </template>
    </div>

    <div class="dark:bg-surface-700 bg-surface-50 border-t-10 border-surface-900 px-6 py-3 text-right text-sm">
      <template v-if="loading">
        <div class="h-4 bg-surface-200 dark:bg-surface-600 rounded animate-pulse w-32 ml-auto"></div>
      </template>
      <template v-else>
        <span>Published:
          <NuxtTime :datetime="article.publishedDate" />
        </span>
      </template>
    </div>
  </div>
</template>
