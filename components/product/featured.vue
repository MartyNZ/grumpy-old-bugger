<script setup>
import { qryFeaturedProducts } from "~/queries/printify";
const isLoading = ref(true);
const { data: featuredProducts } = await useSanityQuery(qryFeaturedProducts)
  .finally(() => {
    isLoading.value = false;
  });
</script>
<template>
  <section v-if="featuredProducts" id="featured-products" class="h-[400px] mb-8">
    <h3 class="dark:text-surface-300 text-center">Featured Products</h3>
    <template v-if="isLoading">
      <div class="flex w-full justify-center h-full">
        <div class="border-1 surface-border border-round m-2 flex flex-col items-center p-3">
          <div class="relative mx-auto">
            <Skeleton shape="circle" width="200px" height="200px" />
          </div>
          <div class="mt-3">
            <Skeleton width="150px" height="20px" />
          </div>
        </div>
      </div>
    </template>

    <div v-else id="featured-product-carousel" class="flex w-full justify-center h-full">
      <Carousel :value="featuredProducts" :numVisible="1" :numScroll="1" orientation="vertical" circular
        :autoplayInterval="7000" containerClass="flex items-center">
        <template #item="product">
          <NuxtLink :to="`/products/${product.data.slug}`" class="h-full flex items-center">
            <div class="border-1 surface-border border-round m-2 flex flex-col items-center p-3">
              <div class="relative mx-auto">
                <template v-if="product.data.featureImage">
                  <SanityImage :asset-id="product.data.featureImage.assetId" :alt="product.data.store.title"
                    class="aspect-square max-w-[200px] rounded-full object-cover shadow" />
                </template>
                <template v-else>
                  <img :src="product.data.defaultImageUrl" :alt="product.data.store.title"
                    class="aspect-square max-w-[200px] rounded-full object-cover shadow" />
                </template>
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
</template>
