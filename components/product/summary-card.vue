<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: true,
  },
});

const userInfo = useCookie('user-info');

// Use the new composable for promotion logic
const { productPromotions, collectionPromotions, allPromotions } = useProductPromotions(props.product);

// Use the price calculations composable
const { calculatePrices } = usePriceCalculations();

// Image loading state
const hasLoaded = ref(false);
const imageLoaded = ref(false);

onMounted(() => {
  hasLoaded.value = true;
  // Fallback: hide LQIP after a delay if load event doesn't fire
  setTimeout(() => {
    imageLoaded.value = true;
  }, 2000);
});

// Handle image load event
const onImageLoad = () => {
  // console.log('Image loaded!'); // Debug log
  imageLoaded.value = true;
};

const pricedFrom = computed(() => {
  if (!props.product?.store?.variants || !userInfo.value?.currency?.rate) {
    return '0.00';
  }

  // Get all variants and calculate their prices
  const prices = props.product.store.variants.map(variant => {
    const { itemPrice } = calculatePrices(variant, userInfo.value.currency, 1, null);
    return parseFloat(itemPrice);
  });

  // Return the lowest price
  const lowestPrice = Math.min(...prices);
  return lowestPrice.toFixed(2);
});

// Create a simple counter to only debug first 3 products
let debugCount = 0;

const availableColorOptions = computed(() => {
  const colorOption = props.product?.store?.options?.find(opt => opt.type === 'color');

  if (!colorOption?.values || !props.product?.store?.variants) {
    return [];
  }

  // Get all option value IDs that are available in variants
  const availableOptionIds = new Set();
  props.product.store.variants.forEach(variant => {
    if (variant.isAvailable && variant.isEnabled && variant.options) {
      // Keep the option IDs as strings to match the color option value IDs
      const optionIds = variant.options.toString().split(',').map(id => id.trim());
      optionIds.forEach(id => availableOptionIds.add(id));
    }
  });

  // Filter color options to only show available ones
  return colorOption.values.filter(color => availableOptionIds.has(color.id));
});
</script>
<template>
  <!-- Loading State -->
  <template v-if="loading">
    <div class="w-full h-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md"></div>
  </template>

  <!-- Product Card -->
  <template v-else>
    <div class="bg-surface-0 dark:bg-surface-900 flex h-full w-full flex-col overflow-hidden rounded-md shadow-lg">
      <div class="zoom relative overflow-hidden bg-cover bg-[50%] bg-no-repeat">
        <div class="aspect-square w-full relative">
          <!-- Images with LQIP background and loading strategy -->
          <template v-if="product.featureImage">
            <div class="relative h-full w-full" :class="{ 'bg-cover bg-center': !imageLoaded }" :style="{
              backgroundImage: !imageLoaded && product.featureImage.asset?.metadata?.lqip ? `url(${product.featureImage.asset.metadata.lqip})` : 'none'
            }">
              <SanityImage :asset-id="product.featureImage.assetId"
                class="h-full w-full object-cover transition-all duration-300 ease-linear"
                :class="{ 'opacity-0': !hasLoaded }" :alt="product.store.title" auto="format" max-w="380"
                @load="onImageLoad" @error="onImageLoad" />
            </div>
          </template>
          <template v-else>
            <div class="relative h-full w-full">
              <img :src="product.defaultImageUrl"
                class="h-full w-full object-cover transition-all duration-300 ease-linear"
                :class="{ 'opacity-0': !hasLoaded }" :alt="product.store.title" loading="lazy" @load="onImageLoad"
                @error="onImageLoad" />
            </div>
          </template>

          <!-- Debug info -->
          <!-- <div class="absolute top-0 left-0 bg-red-500 text-white text-xs p-1 z-50">
            Loaded: {{ imageLoaded }}
          </div> -->

          <!-- Promotion Badges -->
          <div class="absolute top-2 right-2 z-10">
            <div v-for="promo in allPromotions" :key="promo.slug"
              class="aspect-square text-xs p-3 w-14 text-center rounded-full bg-red-700 text-white shadow-lg mb-1">
              Save<br />
              {{ promo.discount }}%
            </div>
          </div>
        </div>

        <!-- Zoom mask -->
        <NuxtLink :to="`/products/${product.slug}`">
          <div
            class="mask absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,99.2%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100">
          </div>
        </NuxtLink>
      </div>

      <!-- Content Container -->
      <div class="flex flex-col flex-1">
        <!-- Product Info -->
        <div class="flex flex-col flex-1 p-4">
          <NuxtLink :to="`/products/${product.slug}`"
            class="text-primary-900 hover:text-primary-600 dark:text-primary-200 hover:dark:text-primary-100 mb-2 text-base font-medium">
            {{ product.store.title }}
          </NuxtLink>

          <!-- Color Options -->
          <div v-if="availableColorOptions.length > 1" class="@container mt-auto">
            <div class="text-sm font-semibold mb-2">Available in these colors</div>
            <div class="flex flex-wrap gap-1">
              <div v-for="color in availableColorOptions" :key="color._key || color.id"
                class="outline outline-1 outline-primary-950 dark:outline-primary-200 h-4 w-4 rounded-full"
                :style="`background-color: ${color.colors}`" :title="color.title">
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <section id="card-footer" class="@container">
          <div
            class="dark:bg-surface-800 bg-surface-200 border-t border-surface-900 p-4 mt-auto flex flex-col gap-2 items-start @[165px]:flex-row @[165px]:justify-between @[165px]:items-center @[165px]:gap-0">
            <div class="text-primary-900 dark:text-primary-100 text-sm">
              from:
              <span v-if="userInfo" class="font-brand text-base">
                {{ userInfo.currency.symbol }}{{ pricedFrom }}
              </span>
            </div>
            <NuxtLink :to="`/products/${product.slug}`"
              class="border-surface-500 hover:text-surface-950 hover:bg-surface-300 rounded border py-1.5 px-2 self-end @[165px]:self-auto">
              <span style="white-space: nowrap;">Order now</span>
            </NuxtLink>
          </div>
        </section>
      </div>
    </div>
  </template>
</template>

<style scoped>
.zoom:hover img {
  transform: scale(1.1);
}
</style>
