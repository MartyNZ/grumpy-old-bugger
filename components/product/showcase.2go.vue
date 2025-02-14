<script setup>
import { qryAllProducts } from "~/queries/printify";
const { data: allProducts } = await useSanityQuery(qryAllProducts);

const showCase = ref([]);
const allProductCount = allProducts.value.length;
const selectedIndexes = Array.from({ length: 5 }, () =>
  Math.floor(Math.random() * allProductCount)
);
for (const index of selectedIndexes) {
  showCase.value.push(allProducts.value[index]);
}


// const allProductCount = allProducts.value.length;
// const shuffledIndexes = Array.from({ length: allProductCount }, (_, i) => i)
//   .sort(() => Math.random() - 0.5);
// const selectedIndexes = shuffledIndexes.slice(0, 5);

// for (const index of selectedIndexes) {
//   for (let i = 0; i < 5; i++) {
//     const index = Math.floor(Math.random() * allProductCount);
//     showCase.value.push(allProducts.value[index]);
//   }
// }
</script>
<template>
  <ClientOnly>
    <section v-if="showCase" id="featured-products">
      <h3 class="dark:text-surface-300">Product Showcase</h3>
      <div id="featured-product-carousel" class="flex w-full justify-center">
        <Carousel :value="showCase" :numVisible="1" :numScroll="1" orientation="vertical" circular
          :autoplayInterval="7000" :show-indicators="false">
          <template #item="product">
            <!-- <pre>{{ product.data }}</pre> -->
            <NuxtLink :to="`/products/${product.data.slug}`">
              <div class="border-1 surface-border border-round m-2 flex flex-col items-center p-3">
                <div class="mb-3">
                  <div class="relative mx-auto">
                    <template v-if="product.data.featureImage">
                      <SanityImage :asset-id="product.data.featureImage.assetId" :alt="product.data.store.title"
                        class="aspect-square max-w-[200px] rounded-full object-cover shadow" />
                    </template>
                    <template v-else>
                      <img :src="product.data.defaultImageUrl" :alt="product.data.store.title"
                        class="aspect-square max-w-[200px] rounded-full object-cover shadow" loading="lazy" />
                    </template>
                  </div>
                </div>
                <div class="font-xs mb-3 grow-0 text-balance text-center">
                  {{ product.data.store.title }}
                </div>
              </div>
            </NuxtLink>
          </template>
        </Carousel>
      </div>
    </section>
  </ClientOnly>
</template>
