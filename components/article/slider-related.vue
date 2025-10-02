<script setup>
const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
  sectionTitle: {
    type: String,
  },
  description: {
    type: String,
  },
  loading: {
    type: Boolean,
  },
  autoplay: {
    type: Number,
    default: 5000,
  },
  transition: {
    type: Number,
    default: 2000,
  },
  navigation: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: Boolean,
    default: false,
  },
  slideEffect: {
    type: String,
    default: 'fade',
  },
  wrapAround: {
    type: Boolean,
    default: true
  }
});
const config = computed(() => {
  return {
    wrapAround: props.wrapAround,
    transition: props.transition,
    autoplay: props.autoplay,
    slideEffect: props.slideEffect,
    breakpointMode: 'carousel',
    pauseAutoplayOnHover: true,
    gap: 5,
    itemsToShow: 1,
    itemsToScroll: 1,
  };
});
</script>
<template>
  <!-- Loading State -->
  <template v-if="loading">
    <div class="w-full h-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md"></div>
  </template>

  <!-- Product Card -->
  <template v-else>
    <div class="bg-surface-0 dark:bg-surface-950 flex h-full w-full flex-col overflow-hidden rounded-md shadow-lg mx-2">
      <v3cnCarousel v-bind="config">
        <v3cnSlide v-for="product in products" :key="product._id">
          <div class="w-full">
            <NuxtLink :to="`/products/${product.slug}`" class="h-full flex items-center">
              <div class="border-1 surface-border border-round m-2 flex flex-col items-center p-3">
                <div class="relative mx-auto">
                  <div class="font-xs mb-3 grow-0 text-balance text-center">
                    {{ product.store.title }}
                  </div>
                  <template v-if="product.featureImage">
                    <SanityImage :asset-id="product.featureImage.assetId" :alt="product.store.title"
                      class="aspect-square max-w-[200px] rounded object-cover shadow" />
                  </template>
                  <template v-else>
                    <img :src="product.defaultImageUrl" :alt="product.store.title"
                      class="aspect-square max-w-[200px] rounded object-cover shadow" />
                  </template>
                </div>
                <div
                  class="font-xs mb-3 grow-0 text-balance text-center italic font-semibold text-primary-700 dark:text-primary-300">
                  From: ${{ (product.store.pricedFrom.price / 100).toFixed(2) }}
                </div>
              </div>
            </NuxtLink>
          </div>
        </v3cnSlide>
        <template #addons="{ slidesCount }">
          <v3cnNavigation v-if="navigation" />
          <v3cnPagination v-if="pagination" />
        </template>
      </v3cnCarousel>
    </div>
  </template>
</template>

<style scoped>
.zoom:hover img {
  transform: scale(1.1);
}
</style>
