<script setup>
const props = defineProps({
  promotions: {
    type: Array,
    required: true,
  },
});
// console.log("Promotions: ", JSON.stringify(props.promotions));
</script>
<template>
  <div id="carousel" class="mb-4 w-full ">
    <v3cnCarousel :items-to-show="1" :wrapAround="true" :transition="1000" :autoplay="8000">
      <v3cnSlide v-for="(promotion, index) in promotions" :key="promotion._id">
        <promotion-hero :promo="promotion" />
        <!-- {{ promotion }} -->
        <!-- <div class="flex flex-col flex-wrap md:flex-row">
          <div class="mb-4 grid w-full place-items-center gap-4 pr-3 md:max-w-[50%]">
            <h4
              class="mx-0 mb-4 mt-0 border-0 p-0 align-baseline font-brand text-xl font-semibold text-neutral-800 lg:text-left xl:text-2xl"
            >
              {{ promotion.type }}
            </h4>
            <h2
              class="font-brand mx-0 mb-2 mt-0 border-0 p-0 align-baseline text-xl md:text-center md:text-2xl lg:text-5xl">
              {{ promotion.title }}
            </h2>

            <h1 class="font-brand m-0 border-0 p-0 align-baseline text-2xl md:text-center md:text-3xl lg:text-4xl">
              {{ promotion.cta }}
            </h1>
            <p class="text-md mx-0 mb-5 mt-2 w-full border-0 p-0 align-baseline font-normal leading-9">
              {{ promotion.byline }}
            </p>
            <button type="button">
              <span class=""> {{ promotion.cta }}</span>
            </button>
          </div>
          <div class="mx-auto w-full rounded pt-3 shadow-lg md:max-w-[50%] lg:mt-0">
            <SanityImage :assetId="promotion.image.assetId"
              class="mx-auto aspect-square h-auto w-[340px] object-cover object-center transition duration-300 ease-linear sm:w-[760px] md:w-[595px]"
              :alt="promotion.title" />
          </div>
        </div> -->
      </v3cnSlide>
      <template #addons="{ slidesCount }">
        <v3cnNavigation v-if="slidesCount > 1" />
        <!-- <v3cnPagination /> -->
      </template>
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
