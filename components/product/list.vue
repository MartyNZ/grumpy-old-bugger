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
</script>
<template>
  <section id="products-list">
    <h2 class="text-lg" v-if="sectionTitle">{{ sectionTitle }}</h2>
    <div v-if="description" class="text-balanced mb-4">
      {{ description }}
    </div>
    <div id="products-grid">
      <template v-for="product in products" :key="product.store._id">
        <!-- <pre>{{ product }}</pre> -->
        <product-summary-card :loading="loading" :product="product" />
      </template>
    </div>
  </section>
</template>

<style scoped>
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
</style>
