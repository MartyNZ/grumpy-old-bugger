<script setup>
const props = defineProps({
  design: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <div
    class="zoom dark:shadow-surface-600 relative overflow-hidden bg-cover bg-[50%] bg-no-repeat shadow-md"
  >
    <img
      :src="design.image.url"
      auto="format"
      class="w-full object-cover align-middle transition duration-300 ease-linear"
      :alt="design.title"
      loading="lazy"
    />
    <NuxtLink :to="`/products/designs/${design.slug}`">
      <div
        class="z-1 absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden"
      >
        <div class="flex h-full items-end justify-start">
          <h5
            class="title-shadow truncate text-ellipsis px-2 text-xl text-surface-100"
          >
            {{ design.title }}
          </h5>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>
<style scoped>
.zoom:hover img {
  transform: scale(1.1);
}
.title-shadow {
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 1))
    drop-shadow(0 1px 1px rgb(0 0 0 / 0.6));
}
</style>
