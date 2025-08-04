<script setup>
const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
  sectionTitle: {
    type: String,
  },
  description: {
    type: String,
  },
  loading: {
    type: Boolean,
  },
});
const responsiveOptions = ref([
  {
    breakpoint: '1199px',
    numVisible: 3,
    numScroll: 3
  },
  {
    breakpoint: '790px',
    numVisible: 3,
    numScroll: 3
  },
  {
    breakpoint: '525px',
    numVisible: 2,
    numScroll: 2
  }
]);
</script>
<template>
  <section id="products-list">
    <h2 class="text-lg" :class="{ 'mb-4': description }" v-if="sectionTitle">
      {{ sectionTitle }}
    </h2>
    <div v-if="description" class="text-balanced mb-4">
      {{ description }}
    </div>
    <Carousel :value="products" :numVisible="3" :numScroll="3" :responsiveOptions="responsiveOptions">
      <template #item="product">
        <!-- <pre>{{ product }}</pre> -->
        <product-summary-card :loading="loading" :product="product.data" />
      </template>
    </Carousel>
  </section>
</template>

<!-- <style scoped>
#products-list {
  container-type: inline-size;
  margin-bottom: 2.5em;
}

#products-grid {
  display: grid;
  gap: 1em;
  grid-template-columns: 1fr;
  justify-items: center;
}

/* 2 items per row for screens 350px and above */
@media (width >=300px) {
  #products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* For larger screens, use auto-fit for more flexible layout */
@media (width > 768px) {
  #products-grid {
    grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
  }
}
</style> -->
