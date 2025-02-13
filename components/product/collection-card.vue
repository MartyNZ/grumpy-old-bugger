<script setup>
const props = defineProps({
  collection: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: true,
  }
});
</script>
<template>
  <template v-if="loading">
    <div class="@container border-surface-300 dark:border-surface-600 my-4 rounded-md border-[1px] px-3 py-2">
      <div class="@md:flex-row flex flex-col items-center gap-3">
        <Skeleton shape="circle" height="200px" width="200px" />
        <div class="flex w-full flex-col items-center">
          <Skeleton height="2rem" width="100%" class="mb-3" />
          <Skeleton height="8rem" width="100%" />
        </div>
      </div>
    </div>
  </template>
  <div v-else id="collection-card"
    class="@container border-surface-300 dark:border-surface-600 hover:ring-surface-500 my-4 rounded-md border-[1px] px-3 py-2 ring-offset-transparent transition duration-200 ease-in-out hover:ring-2 hover:ring-offset-2">
    <NuxtLink :to="`/products/collections/${collection.slug}`">
      <div class="@md:flex-row flex flex-col items-center gap-3">
        <img v-if="collection.image.url" :src="collection.image.url"
          class="border-surface-800 max-w-[200px] rounded-full border-[1px]" />
        <div class="flex flex-col items-center justify-stretch">
          <h3 class="mb-3">{{ collection.title }}</h3>
          <div class="text-balanced m-2">{{ collection.description }}</div>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>
