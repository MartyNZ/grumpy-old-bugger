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

const pricedFrom = computed(() => {
  if (!props.product?.store?.pricedFrom?.price || !userInfo.value?.currency?.rate) {
    console.warn('Missing price data or currency rate');
    return '0.00';
  }

  let priceData = props.product.store.pricedFrom.price / 100;
  let rateAdjustedPrice = priceData * userInfo.value.currency.rate;
  return rateAdjustedPrice.toFixed(2);
});
</script>
<template>
  <!-- Loading State -->
  <template v-if="loading">
    <Card class="w-full">
      <template #header>
        <Skeleton height="200px" />
      </template>
      <template #content>
        <div class="flex flex-col gap-2">
          <Skeleton width="100%" height="2rem" />
          <Skeleton width="100%" height="4rem" />
          <div class="flex justify-between items-center">
            <Skeleton width="30%" height="1.5rem" />
            <Skeleton width="20%" height="1.5rem" />
          </div>
        </div>
      </template>
    </Card>
  </template>

  <!-- Product Card -->
  <template v-else>
    <div class="dark:bg-surface-900 flex h-full w-full flex-col overflow-hidden rounded-md shadow-lg">
      <div class="zoom relative overflow-hidden bg-cover bg-[50%] bg-no-repeat">
        <div class="aspect-square w-full relative">
          <!-- Images -->
          <template v-if="product.featureImage">
            <SanityImage :asset-id="product.featureImage.assetId"
              class="h-full w-full object-cover transition duration-300" :alt="product.store.title" auto="format"
              max-w="380" />
          </template>
          <template v-else>
            <img :src="product.defaultImageUrl" class="h-full w-full object-cover transition duration-300"
              :alt="product.store.title" loading="lazy" />
          </template>

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
            class="text-primary-700 hover:text-primary-400 dark:text-primary-400 hover:dark:text-primary-100 mb-2 text-base font-medium">
            {{ product.store.title }}
          </NuxtLink>

          <!-- Color Options -->
          <div v-if="product.colours?.length > 1" class="@container mt-auto">
            <div class="text-sm font-semibold mb-2">Available in these colors</div>
            <div class="flex flex-wrap gap-1">
              <div v-for="colour in product.colours" :key="colour._id" :title="colour.label"
                class="outline outline-1 outline-primary-950 dark:outline-primary-200 h-4 w-4 rounded-full"
                :style="`background-color: ${colour.colour}`">
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="dark:bg-surface-700 bg-surface-50 border-t border-surface-900 p-4 mt-auto flex justify-between items-center">
          <div class="text-primary-700 dark:text-primary-200 text-sm">
            from:
            <span v-if="userInfo" class="font-brand text-base">
              {{ userInfo.currency.symbol }}{{ pricedFrom }}
            </span>
          </div>
          <NuxtLink :to="`/products/${product.slug}`"
            class="border-surface-500 hover:text-surface-950 hover:bg-surface-300 rounded border py-1.5 px-2">
            <span style="white-space: nowrap;">Order now</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </template>
</template>
