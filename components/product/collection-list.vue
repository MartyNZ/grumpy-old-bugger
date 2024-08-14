<script setup>
const printifyCollectionNavigationStore =
  usePrintifyCollectionNavigationStore();
const collections =
  printifyCollectionNavigationStore.printifyCollectionNavigation;

// console.log("Collections: ", JSON.stringify(collections, null, 2))
</script>
<template>
  <section id="collections-list">
    <h2>Browse Collections</h2>
    <div id="collections-grid">
      <template
      v-for="child in collections.printifyCollectionNavGroup"
      :key="child._id">
        <product-collection-grid-item :collection="child" />
      </template>
    </div>
  </section>
</template>

<style scoped>
#collections-list {
  container-type: inline-size;
  margin-bottom: 2.5em;
}
#collections-grid {
  display: grid;
  gap: 1.5em;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  justify-items: center;
}
@container ( width > 530px) {
  #collections-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 0.5fr));
  }
}
</style>
