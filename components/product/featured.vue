<script setup>
import Carousel from "primevue/carousel";
import { qryFeaturedProducts } from "~/queries/printify";
const { data: featuredProducts } = await useSanityQuery(qryFeaturedProducts);
</script>
<template>
  <section v-if="featuredProducts" id="featured-products">
    <h3 class="dark:text-surface-300">Featured Products</h3>
    <div id="featured-product-carousel" class="flex w-full justify-center">
      <Carousel
        :value="featuredProducts"
        :numVisible="1"
        :numScroll="1"
        orientation="vertical"
        circular
      >
        <!-- :autoplayInterval="7000" -->
        <template #item="product">
          <!-- <pre>{{ product.data }}</pre> -->
          <NuxtLink :to="`/products/${product.data.slug}`">
            <div
              class="border-1 surface-border border-round m-2 flex flex-col items-center p-3"
            >
              <div class="mb-3">
                <div class="relative mx-auto">
                  <template v-if="product.data.featureImage">
                    <SanityImage
                      :asset-id="product.data.featureImage.assetId"
                      :alt="product.data.store.title"
                      class="aspect-square max-w-[200px] rounded-full object-cover shadow"
                    />
                  </template>
                  <template v-else>
                    <img
                      :src="product.data.defaultImageUrl"
                      :alt="product.data.store.title"
                      class="aspect-square max-w-[200px] rounded-full object-cover shadow"
                    />
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
</template>
<style></style>
