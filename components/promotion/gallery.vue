<script setup>
import { qryAllLivePromotions } from '~/queries/promotions'

const isLoading = ref(true);
const { data: promotions } = await useSanityQuery(qryAllLivePromotions).finally(() => {
  isLoading.value = false;
})
// console.log("Promotions: ", JSON.stringify(promotions.value, null, 2))
</script>

<template>
  <section id="promotion-gallery" class="@container mb-5">
    <div class="grid grid-cols-1 gap-6 align-center p-1 @lg:grid-cols-2">
      <template v-for="p in promotions" :key="p._id">
        <promotion-hero :promo="p" enableZoom :loading="isLoading" />
      </template>
    </div>
  </section>
</template>

<style scoped></style>
