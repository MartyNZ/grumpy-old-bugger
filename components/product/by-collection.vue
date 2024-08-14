<script setup>
import { qryProductsByTag } from '~/queries/printify'
const tagsLookupStore = usePrintifyTagsLookupStore();
const tagsLookup = tagsLookupStore.tagsLookup;
const props = defineProps({
  title: {
    type: String
  },
  collection: {
    type: Object,
    required: true,
  },
  description: {
    type: String
  }
});
const { data: allProducts } = await useSanityQuery(qryProductsByTag, {
  tag: tagsLookup[props.collection.slug.current],
});
// console.log("Total Products: ", allProducts.value.length);
</script>
<template>
  <div id="products-list">
    <h3 v-if="title">{{ title }}</h3>
    <div v-if="description" class="text-balanced mb-4">{{ description }}</div>
    <div id="products-grid">
      <template v-for="product in allProducts" :key="product._id">
        <product-summary-card :product="product" />
      </template>
    </div>
  </div>
</template>

<style scoped>
#products-list {
  container-type: inline-size;
  margin-bottom: 3em;
}

#products-grid {
  display: grid;
  gap: 1.5em;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  justify-items: center;
}

@container (width > 530px) {
  #products-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 0.5fr));
  }
}
</style>
