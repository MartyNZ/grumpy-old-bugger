<script setup>
import PrimeCarousel from "primevue/carousel";
import { qryProductThemes } from "~/queries/printify";

const { data: themes } = await useSanityQuery(qryProductThemes);
</script>
<template>
  <section id="product-theme-list" class="mb-4">
    <h4 class="mb-2">Filter by Theme</h4>
    <PrimeCarousel :value="themes" :showIndicators="false">
      <!-- :numVisible="1" :numScroll="1" :responsiveOptions="responsiveOptions" -->
      <template #item="theme">
        <span class="flex px-2">
          <NuxtLink
            class="border-surface-800 dark:border-surface-400 rounded-full border-[1px] px-3 py-1"
            :to="`/products/themes/${theme.data.slug}`"
          >
            {{ theme.data.title }}
          </NuxtLink>
        </span>
      </template>
    </PrimeCarousel>
  </section>
</template>
