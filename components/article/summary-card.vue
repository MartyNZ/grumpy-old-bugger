<script setup>
const route = useRoute();
const fullPath = route.fullPath;
const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div
    class="dark:bg-surface-700 flex flex-col overflow-hidden rounded shadow-lg"
  >
    <div
      class="zoom shadow-surface-700 relative overflow-hidden rounded bg-cover bg-[50%] bg-no-repeat shadow-sm"
    >
      <SanityImage
        :assetId="article.image.assetId"
        class="aspect-video w-full object-cover align-middle transition duration-300 ease-linear"
        :alt="article.title"
        loading="lazy"
        placeholder
      />
      <NuxtLink :to="`/the-rant-files/${article.slug}`">
        <div>
          <div
            class="mask absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,99.2%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out"
          ></div>
        </div>
      </NuxtLink>
      <NuxtLink
        v-if="fullPath == '/the-rant-files' || fullPath == '/'"
        :to="`/the-rant-files/collections/${article.category.slug}`"
      >
        <div
          class="bg-primary-600 hover:text-primary-600 absolute right-0 top-0 mr-3 mt-3 rounded-sm px-4 py-2 text-xs text-white transition duration-500 ease-in-out hover:bg-white"
        >
          {{ article.category.name }}
        </div>
      </NuxtLink>
    </div>
    <div class="mb-auto px-2 py-4">
      <NuxtLink
        :to="`/the-rant-files/${article.slug}`"
        class="mb-2 inline-block text-base font-medium transition duration-500 ease-in-out hover:text-primary-600 after:bg-primary-600 dark:after:bg-primary-300 relative after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:duration-300 after:content-[''] hover:after:w-[100%] hover:dark:text-primary-50"
        >{{ article.title }}</NuxtLink
      >
      <p class="text-sm">{{ article.excerpt }}</p>
    </div>
    <div
      class="dark:bg-surface-700 bg-surface-50 border-t-10 border-surface-900 px-6 py-3 text-right text-sm"
    >
      <NuxtLink :to="`/the-rant-files/${article.slug}`">
        <span>Published: {{ article.publishedDate }}</span>
      </NuxtLink>
    </div>
  </div>
</template>
