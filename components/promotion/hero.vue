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
    class="promo-container dark:shadow-surface-600 relative overflow-hidden shadow @md:shadow-med @lg:shadow-lg mx-auto w-full">
    <SanityImage auto="format" :assetId="promo.image.assetId" height="auto" width="100%"
      class="w-full object-cover align-middle transition duration-300 ease-linear" :alt="promo.title" />
    <div class="z-1 absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden">
      <div class="flex flex-col items-center justify-around relative h-full">
        <div class="promo-banner">
          <span>{{ promo.title }}</span>
        </div>
        <div v-if="promo.byline && fullPath === `/promotions/${promo.slug}`" class="promo-byline">
          <span
            class="w-full text-sm @sm:text-3xl font-semi-bold sm:font-bold italic text-white text-right drop-shadow-lg">
            {{ promo.byline }}
          </span>
        </div>
        <div v-if="promo.cta && fullPath !== `/promotions/${promo.slug}`">
          <NuxtLink :to="`/promotions/${promo.slug}`" class="promo-cta">
            {{ promo.cta }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.promo-container {
  container: promo-container / inline-size
}

.promo-banner {
  height: .75rem;
  width: 125px;
  background-color: #9c1b21;
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

.promo-banner:before {
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

.promo-byline {
  position: absolute;
  display: flex;
  max-width: 50%;
  bottom: 1em;
  right: 1.5em;
  justify-content: end;
}

.promo-byline span {
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.6));
}

.promo-cta {
  position: absolute;
  bottom: 0.75em;
  right: 0.75em;
  background-color: var(--primary-200);
  color: var(--primary-800);
  border-radius: 2em;
  padding-block: 0.15em;
  padding-inline: 0.5em;
  /* font-size: 8px;
  font-weight: 600; */
  font: var(--font-brand)
}

.promo-cta:hover,
.promo-cta:focus {
  background-color: var(--primary-300);
  color: var(--primary-900);
}

.promo-cta:active {}

.zoom:hover img {
  transform: scale(1.1);
}

@container promo-container (321px < width < 767px) {
  .promo-banner {
    height: .75rem;
    width: 125px;
    background-color: #9c1b21;
    position: absolute;
    top: 60px;
    left: -6px;
    text-align: center;
    color: #FFF;
    font-weight: 500;
    font-size: .8rem;
    white-space: nowrap;
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }

  .promo-banner:before {
    box-sizing: border-box;
    border-style: solid;
    border-color: #9c1b21;
    border-width: 1.75rem;
    border-left-width: 200px;
    border-right-width: 200px;
    content: "";
    display: block;
    /* left: -90px; */
    position: absolute;
    /* width: 140px; */
    border-top-width: 0px;
    border-bottom-color: #9c1b21;
    top: -2px;
    z-index: -1;
  }

  .promo-cta {
    font-size: .9rem;
  }
}

@container promo-container (767px < width < 1280px) {
  .promo-banner {
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

  .promo-banner:before {
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

  .promo-cta {
    font-size: 1.25em;
  }
}

@container promo-container (width > 1279px) {
  .promo-banner {
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

  .promo-banner:before {
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

  .promo-cta {
    font-size: 2.5em;
  }
}

.zoom:hover img {
  transform: scale(1.1);
}

.title-shadow {
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.6));
}
</style>
