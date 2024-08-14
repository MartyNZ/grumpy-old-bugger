<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const collectionPromotions = props.product.promotedBy.filter((promo) => {
  return promo.scope === 'collections';
});

const collectionPromos = props.product.store.tags.split(",").reduce((acc, tag) => {
  const matchingPromos = collectionPromotions.filter((promo) => {
    return promo.collections.some((collection) => {
      return collection.title.toLowerCase() === tag.trim().toLowerCase();
    });
  });
  return acc.concat(matchingPromos);
}, []);

const productPromos = props.product.promotedBy.filter((promo) => {
  return promo.scope === 'products';
});
// if (productPromos.length > 0) {
//   console.log(JSON.stringify(props.product.store.title, null, 2), ": ", JSON.stringify(productPromos, null, 2))
// }
// const selectedPromo = ref({});
// selectedPromo.value = productPromos[0] || collectionPromos[0];

const pricedFrom = computed(() => {
  let priceData = props.product.store.pricedFrom.price / 100;
  return priceData.toFixed(2);
});

// const discountedPrice = computed(() => pricedFrom.value * ((100 - selectedPromo.value.discount) / 100));
// console.log("selected Promo discount: ", JSON.stringify(selectedPromo.value.discount, null, 2));
// console.log("Discounted Price: ", discountedPrice.value);
// console.log("Computed pricedFrom: ", pricedFrom.value);
</script>
<template>
  <div id="product-card">
    <div class="dark:bg-surface-950 flex h-full w-full flex-col overflow-hidden rounded-md shadow-lg">
      <div class="zoom relative overflow-hidden bg-cover bg-[50%] bg-no-repeat">
        <template v-if="product.featureImage">
          <div class="relative">
            <SanityImage :asset-id="product.featureImage.assetId"
              class="aspect-square h-full object-cover align-middle transition duration-300 ease-linear"
              :alt="product.store.title" auto="format" max-w="380" />
            <template v-if="productPromos.length > 0">
              <div v-for="productPromo in productPromos" class="absolute aspect-square text-xs p-3 w-14
               text-center align-middle rounded-full z-10 top-2 right-2 bg-red-700 text-white shadow-lg">
                Save<br />
                {{ productPromo.discount }}%
              </div>
            </template>
            <template v-if="collectionPromos.length > 0">
              <div v-for="collectionPromo in collectionPromos" class="absolute aspect-square text-xs p-3 w-14
               text-center align-middle rounded-full z-10 top-2 right-2 bg-red-700 text-white shadow-lg">
                Save<br />
                {{ collectionPromo.discount }}%
              </div>
            </template>
          </div>
        </template>
        <template v-else>
          <div class="relative">
            <img :src="product.defaultImageUrl"
              class="aspect-square w-full object-cover align-middle transition duration-300 ease-linear"
              :alt="product.store.title" loading="lazy" placeholder />
            <template v-if="productPromos.length > 0">
              <div v-for="promo in productPromos" class="absolute aspect-square text-xs p-3 w-14
               text-center align-middle rounded-full z-10 top-2 right-2 bg-red-700 text-white shadow-lg">
                Save<br />
                {{ promo.discount }}%
              </div>
            </template>
            <template v-if="collectionPromos.length > 0">
              <div v-for="collectionPromo in collectionPromos" class="absolute aspect-square text-xs p-3 w-14
               text-center align-middle rounded-full z-10 top-2 right-2 bg-red-700 text-white shadow-lg">
                Save<br />
                {{ collectionPromo.discount }}%
              </div>
            </template>
          </div>
        </template>
        <NuxtLink :to="`/products/${product.slug}`">
          <div>
            <div
              class="mask absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,99.2%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out">
            </div>
          </div>
        </NuxtLink>
      </div>
      <div class="mb-auto px-2 py-4">
        <NuxtLink :to="`/products/${product.slug}`"
          class=" text-primary-700 hover:text-primary-400 dark:text-primary-400 hover:dark:text-primary-100 mb-2 inline-block text-base font-medium transition duration-500 ease-in-out">
          {{ product.store.title }}</NuxtLink>
        <p class="text-primary-700 dark:text-primary-300 text-sm">
          from:
          <span class="font-brand text-base">${{ pricedFrom }}</span>
          <!-- <span v-if="selectedPromo" class="mr-2">${{ discountedPrice.toFixed(2) }}</span>
          <span :class="selectedPromo ? 'line-through' : ''">${{ totalPrice.toFixed(2) }}</span> -->
        </p>
        <div v-if="product.colours && product.colours.length > 1" class="@container mt-4 justify-self-end">
          <div class="text-sm semi-bold w-full mb-2">Available in these colors</div>
          <div class="flex flex-wrap gap-1 lg:gap-2">
            <div v-for="colour in product.colours" :v-tooltip="colour.label" :key="colour._id"
              class="outline outline-1 outline-primary-950 dark:outline-primary-200 h-4 w-4 rounded-full @sm:w-6 @md:h-8 @sm:h-6 @md:w-8"
              :style="`background-color: ${colour.colour}`" :aria-label="colour.label"></div>
          </div>
        </div>
      </div>
      <div class="dark:bg-surface-700 bg-surface-50 border-t-10 border-surface-900 px-6 py-3 text-right text-sm">
        <NuxtLink :to="`/products/${product.slug}`"
          class="border-surface-500 hover:text-surface-950 hover:bg-surface-300 rounded border-[1px] px-3 py-2">
          <span>Order now</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
