<script setup>
const props = defineProps({
  theme: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <div
    id="theme-card"
    class="@container border-surface-300 dark:border-surface-600 hover:ring-surface-500 my-4 rounded-md border-[1px] px-3 py-2 ring-offset-transparent transition duration-200 ease-in-out hover:ring-2 hover:ring-offset-2"
  >
    <NuxtLink :to="`/products/themes/${theme.slug}`">
      <div class="@md:flex-row flex flex-col items-center gap-3">
        <img
          :src="theme.imageUrl"
          class="border-surface-800 max-w-[200px] rounded-full border-[1px]"
        />
        <div class="flex flex-col items-center justify-stretch">
          <h3 class="mb-3">{{ theme.title }}</h3>
          <div class="text-balanced m-2">{{ theme.description }}</div>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>
