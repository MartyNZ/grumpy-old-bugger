<script setup>
const props = defineProps({
  collection: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <!-- <p>{{ collection }}</p> -->
  <div
    id="collection-card"
    class="@container border-surface-300 dark:border-surface-600 hover:ring-surface-500 my-4 rounded-md border-[1px] px-3 py-2 ring-offset-transparent transition duration-200 ease-in-out hover:ring-2 hover:ring-offset-2"
  >
    <!-- <p>{{ collection }}</p> -->
    <NuxtLink :to="`/products/collections/${collection.slug}`">
      <div class="@md:flex-row flex flex-col items-center gap-3">
        <img
          v-if="collection.image.url"
          :src="collection.image.url"
          class="border-surface-800 max-w-[200px] rounded-full border-[1px]"
        />
        <div class="flex flex-col items-center justify-stretch">
          <h3 class="mb-3">{{ collection.title }}</h3>
          <div class="text-balanced m-2">{{ collection.description }}</div>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>
