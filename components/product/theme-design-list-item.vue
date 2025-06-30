<script setup>
const props = defineProps({
  design: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
  }
});

const imageLoaded = ref(false);

// Force load after a delay as fallback
onMounted(() => {
  setTimeout(() => {
    imageLoaded.value = true;
  }, 1000); // Adjust timing as needed
});

const onImageLoad = () => {
  imageLoaded.value = true;
};
</script>
<template>
  <div class="zoom dark:shadow-surface-600 relative overflow-hidden bg-cover bg-[50%] bg-no-repeat shadow-md">
    <div class="relative aspect-square w-full bg-cover bg-center"
      :style="{ backgroundImage: `url(${design.image.asset.metadata?.lqip})` }">
      <SanityImage :asset-id="design.image.asset._id" auto="format"
        class="aspect-square w-full object-cover align-middle transition-all duration-300 ease-linear"
        :class="{ 'opacity-0': !imageLoaded }" :alt="design.title" loading="lazy" @load="onImageLoad" />
    </div>
    <NuxtLink :to="`/products/designs/${design.slug}`">
      <div class="z-1 absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden">
        <div class="flex h-full items-end justify-start">
          <h5 class="title-shadow truncate text-ellipsis px-2 text-xl text-surface-100">
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
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.6));
}
</style>
