<script setup>
import { qryAllLivePromotions } from '~/queries/promotions'
const { data: promotions } = await useSanityQuery(qryAllLivePromotions)
// console.log("Promotions: ", JSON.stringify(promotions.value, null, 2))
</script>

<template>
  <div class="@container">
    <div class="@lg:grid-cols-2 grid grid-cols-1 gap-1 @md:gap-3 align-center p-1 @md:p-3">
      <template v-for="p in promotions" :key="p._id">
        <promotion-hero :promo="p" enableZoom />
      </template>
    </div>
  </div>
</template>

<style scoped></style>
