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
  <template v-if="loading">
    <Card class="w-full">
      <template #header>
        <Skeleton height="200px" />
      </template>
      <template #content>
        <div class="flex flex-col gap-2">
          <Skeleton width="100%" height="2rem" />
          <Skeleton width="100%" height="4rem" />
          <div class="flex justify-end">
            <Skeleton width="40%" height="1.5rem" />
          </div>
        </div>
      </template>
    </Card>
  </template>
  <template v-else>
    <div class="dark:bg-surface-700 flex flex-col overflow-hidden rounded shadow-lg">
      <div class="zoom shadow-surface-700 relative overflow-hidden rounded bg-cover bg-[50%] bg-no-repeat shadow-sm">
        <SanityImage :assetId="article.image.assetId"
          class="aspect-video w-full object-cover align-middle transition duration-300 ease-linear" :alt="article.title"
          loading="lazy" placeholder />
        <NuxtLink :to="`/the-rant-files/${article.slug}`">
          <div>
            <div
              class="mask absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,99.2%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out">
            </div>
          </div>
        </NuxtLink>
        <NuxtLink v-if="fullPath == '/the-rant-files' || fullPath == '/'"
          :to="`/the-rant-files/collections/${article.category.slug}`">
          <div
            class="bg-primary-600 hover:text-primary-600 absolute right-0 top-0 mr-3 mt-3 rounded-sm px-4 py-2 text-xs text-white transition duration-500 ease-in-out hover:bg-white">
            {{ article.category.title }}
          </div>
        </NuxtLink>
      </div>
      <div class="mb-auto px-2 py-4">
        <NuxtLink :to="`/the-rant-files/${article.slug}`"
          class="mb-2 inline-block text-base font-medium transition duration-500 ease-in-out hover:text-primary-600 after:bg-primary-600 dark:after:bg-primary-300 relative after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:duration-300 after:content-[''] hover:after:w-[100%] hover:dark:text-primary-50">
          {{ article.title }}</NuxtLink>
        <p class="text-sm">{{ article.excerpt }}</p>
      </div>
      <div class="dark:bg-surface-700 bg-surface-50 border-t-10 border-surface-900 px-6 py-3 text-right text-sm">
        <Skeleton width="40%" height="20px" class="ml-auto" />
        <NuxtLink :to="`/the-rant-files/${article.slug}`">
          <span>Published: {{ article.publishedDate }}</span>
        </NuxtLink>
      </div>
    </div>
  </template>
</template>
