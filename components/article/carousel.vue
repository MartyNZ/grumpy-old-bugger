<script setup>
import Carousel from "primevue/carousel";
const props = defineProps({
  articles: {
    type: Array,
    required: true,
  },
});

const responsiveOptions = ref([
  {
    breakpoint: "1400px",
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: "1199px",
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: "767px",
    numVisible: 1,
    numScroll: 1,
  },
  {
    breakpoint: "575px",
    numVisible: 1,
    numScroll: 1,
  },
]);
</script>
<template>
  <div class="card">
    <Carousel
      :value="articles"
      :numVisible="2"
      :numScroll="3"
      :responsiveOptions="responsiveOptions"
      showIndicators:false
    >
      <template #item="slotProps">
        <!-- {{ slotProps.data }} -->
        <article-summary-card :article="slotProps.data" />
      </template>
    </Carousel>
  </div>
</template>
