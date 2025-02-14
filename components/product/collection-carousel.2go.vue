<script setup>
import PrimeCarousel from "primevue/carousel";
import { qryAllPrintifyCollections } from "~/queries/printify";

const { data: collectionList } = await useSanityQuery(
  qryAllPrintifyCollections,
);
</script>
<template>
  <section id="product-collection-list" class="mb-4">
    <NuxtLink to="/products/collections">
      <h3>Product Collections</h3>
    </NuxtLink>
    <div class="carousel">
      <PrimeCarousel :value="collectionList" :showIndicators="false">
        <template #item="collection">
          <NuxtLink :to="`/products/collections/${collection.data.slug}`">
            <div class="border-1 surface-border border-round m-2 p-3">
              <div class="mb-3">
                <div class="relative mx-auto">
                  <img
                    :src="collection.data.imageUrl"
                    :alt="collection.data.title"
                    class="aspect-square w-full max-w-[200px] rounded-full object-cover shadow"
                  />
                </div>
              </div>
              <div class="mb-3 font-medium">{{ collection.data.title }}</div>
            </div>
          </NuxtLink>
        </template>
      </PrimeCarousel>
    </div>
  </section>
</template>
