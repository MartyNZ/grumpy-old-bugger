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
  pending: {
    type: Boolean,
  },
});
</script>
<template>
  <section id="products-list">
    <h2 class="text-lg" v-if="sectionTitle">{{ sectionTitle }}</h2>
    <div v-if="description" class="text-balanced mb-4">{{ description }}</div>
    <div id="products-grid">
      <template v-for="product in products" :key="product.store._id">
        <product-summary-card :product="product" />
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
  grid-template-columns: repeat(auto-fit, minmax(150px, .5fr));
  justify-items: center;
}

@container (width > 530px) {
  #products-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 0.5fr));
  }
}
</style>
