<script setup>
import { qryAllLivePromotions } from "~/queries/promotions";
const { data: promotions } = await useSanityQuery(qryAllLivePromotions);
// console.log(JSON.stringify(promotions.value, null, 2));

</script>
<template>
  <div class="mt-3 mx-3">
    <Carousel :value="promotions" :showNavigators="false" :showIndicators="false">
      <template #item="slotProps">
        <!-- <SanityImage :asset-id="slotProps.data.image.assetId" class="w-full object-cover" /> -->
        <promotion-hero :promo="slotProps.data" />
      </template>
    </Carousel>
  </div>
</template>
