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
    default: 0,
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
    default: 'slide',
  },
  wrapAround: {
    type: Boolean,
    default: false
  }
});
const config = computed(() => {
  return {
    wrapAround: props.wrapAround,
    transition: 1000,
    autoplay: props.autoplay,
    slideEffect: props.slideEffect,
    breakpointMode: 'carousel',
    pauseAutoplayOnHover: true,
    gap: 5,
    itemsToShow: 1,
    itemsToScroll: 1,
    breakpoints: {
      500: {
        itemsToShow: 2,
        itemsToScroll: 2,
        snapAlign: 'start',
      },
      768: {
        itemsToShow: 3,
        itemsToScroll: 3,
        snapAlign: 'center',
      },
      900: {
        itemsToShow: 4,
        itemsToScroll: 4,
        snapAlign: 'center',
      }
    },
  };
});
</script>
<template>
  <section id="products-slider" class="mt-10 mb-5 @container">
    <h2 class="text-lg" :class="{ 'mb-5': !description }" v-if="sectionTitle">
      {{ sectionTitle }}
    </h2>
    <div v-if="description" class="text-balanced mb-5">
      {{ description }}
    </div>
    <template v-if="products.length > 1">
      <div class="mx-auto mb-4">
        <v3cnCarousel v-bind="config">
          <v3cnSlide v-for="product in products" :key="product._id">
            <product-summary-card :product="product" :loading="loading" />
          </v3cnSlide>
          <template #addons="{ slidesCount }">
            <v3cnNavigation v-if="navigation" />
            <v3cnPagination v-if="pagination" />
          </template>
        </v3cnCarousel>
      </div>
    </template>
    <template v-else>
      <div class="mx-auto w-full @sm:w-2/3 @md:w-1/2">
        <product-summary-card :product="products[0]" :loading="loading" />
      </div>
    </template>
  </section>
</template>
<style scoped>
.carousel {
  --vc-nav-background: var(--surface-0);
  --vc-pgn-background-color: var(--surface-200);
  --vc-pgn-active-color: var(--surface-400);
  --vc-nav-color: var(--surface-200);
  --vc-nav-color-hover: #var(--surface-400);
  --vc-nav-border-radius: 50%;
  --vc-pgn-border-radius: 10px;
  --vc-pgn-height: 8px;
  --vc-pgn-width: 25px;
  --vc-png-bottom: -20px;
}

.dark .carousel {
  --vc-nav-background: var(--surface-700);
  --vc-pgn-background-color: var(--surface-400);
  --vc-pgn-active-color: var(--surface-700);
  --vc-nav-color: var(--surface-400);
  --vc-nav-color-hover: #var(--surface-700);
}

</style>
