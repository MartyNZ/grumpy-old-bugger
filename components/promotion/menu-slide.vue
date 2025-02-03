<script setup>
import { qryAllLivePromotions } from '~/queries/promotions';
const { data: promotions } = await useSanityQuery(qryAllLivePromotions);

// console.log("Promotions: ", JSON.stringify(promotions.value, null, 2));
</script>
<template>
  <div id="carousel" class="w-full ">
    <v3cnCarousel :items-to-show="1" :wrapAround="true" :transition="1000" :autoplay="8000">
      <v3cnSlide v-for="(promotion, index) in promotions" :key="promotion._id">
        <NuxtLink @click="$emit('closeMenu')" :to="`/promotions/${promotion.slug}`"
          class="flex flex-col items-center justify-center">
          <h3>{{ promotion.title }}</h3>
        </NuxtLink>
      </v3cnSlide>
      <!-- <template #addons="{ slidesCount }">
        <v3cnNavigation v-if="slidesCount > 1" />
        <v3cnPagination />
      </template> -->
    </v3cnCarousel>
  </div>
</template>
<style scoped>
/* #carousel {
  background-color: var(--surface-200);
  border-radius: 0.75rem;
}
.dark #carousel {
  background-color: var(--surface-900);
  border-radius: 0.75rem;
} */
/* .carousel__prev:hover,
.carousel__next:hover {
  display: grid;
  place-content: center;
  margin-inline: auto;
  cursor: pointer;
  background: #000;
  width: 45px;
  height: 45px;
  position: absolute;
  z-index: 100;
  border-radius: 50%;
  border: 1px solid #cce7d0;
  -webkit-transition: all 0.2s ease-out;
  transition: all 0.2s ease-out;
  text-align: center;
  line-height: 45px;
  font-size: 14px;
  color: var(--surface-400);
}
.carousel__icon {
  width: 20px;
  height: 20px;
  fill: var(--primary-700);
} */
</style>
