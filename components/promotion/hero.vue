<script setup>
const route = useRoute();
const fullPath = route.fullPath;
const props = defineProps({
  promo: {
    type: Object,
    required: true,
  },
  enableZoom: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div :class="{ 'zoom': enableZoom }"
    class="dark:shadow-surface-600 relative overflow-hidden shadow-lg mx-auto w-full">
    <SanityImage auto="format" :assetId="promo.image.assetId" height="auto" width="100%"
      class="w-full object-cover align-middle transition duration-300 ease-linear" />
    <div class="z-1 absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden">
      <div class="@container flex flex-col items-center justify-around relative h-full">
        <div class="title-banner">
          <span>{{ promo.title }}</span>
        </div>
        <div v-if="promo.byline && fullPath === `/promotions/${promo.slug}`"
          class="absolute max-w-[50%] bottom-1 right-1 sm:bottom-3 sm:right-2 content-end flex">
          <span
            class=" w-full text-sm sm:text-3xl font-semi-bold sm:font-bold italic text-white text-right drop-shadow-lg"
            style="filter: drop-shadow(0 1px 2px rgb(0 0 0 / 1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.6));">
            {{ promo.byline }}
          </span>
        </div>
        <!-- <div v-else="promo.byline && fullPath === `/promotions/${promo.slug}`" class=" absolute max-w-[50%] bottom-1
          left-1 sm:bottom-3 sm:right-2 content-end flex">
          <span
            class=" w-full text-sm sm:text-3xl font-semi-bold sm:font-bold italic text-white text-right drop-shadow-lg"
            style="filter: drop-shadow(0 1px 2px rgb(0 0 0 / 1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.6));">
            {{ promo.byline }}
          </span>
        </div> -->
        <div v-if="promo.cta && fullPath !== `/promotions/${promo.slug}`">
          <NuxtLink :to="`/promotions/${promo.slug}`"
            class="absolute bottom-5 right-2 bg-primary-200 text-primary-800 hover:bg-primary-300 hover:text-primary-900  focus:bg-primary-300  border-primary-700 active:ring-primary-700 dark:active:ring-primary-200 font-brand text-sm whitespace-nowrap text-nowrap rounded-full border-[1px] px-3 py-1 text-center active:ring-2 active:ring-offset-2 @sm:text-base @sm:px-3 @sm:py-1 @md:text-lg @lg:text-2xl @xl:text-3xl @xl:px-6 @xl:py-4 font-semibold">
            {{ promo.cta }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
div.title-banner {
  height: 1rem;
  width: 125px;
  background-color: #9C1B21;
  position: absolute;
  top: 50px;
  left: -6px;
  text-align: center;
  color: #FFF;
  font-weight: 500;
  font-size: .75rem;
  white-space: nowrap;
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  transform: rotate(-45deg);
}

.title-banner:before {
  box-sizing: border-box;
  border-style: solid;
  border-color: #9c1b21;
  border-width: 1.25rem;
  border-left-width: 125px;
  border-right-width: 125px;
  content: "";
  display: block;
  left: -50px;
  position: absolute;
  /* width: 141%; */
  border-top-width: 0px;
  border-bottom-color: #9c1b21;
  /* top: -2px; */
  z-index: -1;
}

.zoom:hover img {
  transform: scale(1.1);
}

@media (767px < width < 1280px) {
  div.title-banner {
    height: 2rem;
    width: 85px;
    background-color: #9C1B21;
    position: absolute;
    top: 145px;
    left: 20px;
    text-align: center;
    color: #FFF;
    font-weight: 700;
    font-size: 1.25rem;
    white-space: nowrap;
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }

  .title-banner:before {
    box-sizing: border-box;
    border-style: solid;
    border-color: #9c1b21;
    border-width: 2rem;
    border-left-width: 200px;
    border-right-width: 200px;
    content: "";
    display: block;
    left: -90px;
    position: absolute;
    /* width: 141%; */
    border-top-width: 0px;
    border-bottom-color: #9c1b21;
    /* top: -2px; */
    z-index: -1;
  }

}

@media (width > 1279px) {
  div.title-banner {
    height: 3rem;
    width: 300px;
    background-color: #9C1B21;
    position: absolute;
    top: 155px;
    left: 10px;
    text-align: center;
    color: #FFF;
    font-weight: 700;
    font-size: 2rem;
    white-space: nowrap;
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }

  .title-banner:before {
    box-sizing: border-box;
    border-style: solid;
    border-color: #9c1b21;
    border-width: 3rem;
    border-left-width: 240px;
    border-right-width: 350px;
    content: "";
    display: block;
    left: -118px;
    position: absolute;
    border-top-width: 0px;
    border-bottom-color: #9c1b21;
    z-index: -1;
  }

}

.zoom:hover img {
  transform: scale(1.1);
}

.title-shadow {
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.6));
}
</style>
