<script setup>
const props = defineProps({
  collectionNav: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <section id="product-collection-navpanel" class="snaps-inline p-2">
    <!-- <pre>{{ collectionNav }}</pre> -->
    <NuxtLink
      v-for="child in collectionNav.printifyCollectionNavGroup"
      :key="child._id"
      :to="`/products/collections/${child.parentCollection.slug}`"
      class="hover:bg-surface-300 dark:hover:bg-surface-700 focus:bg-surface-300 dark:border-surface-500 border-surface-700 active:ring-surface-700 dark:active:ring-surface-200 whitespace-nowrap text-nowrap rounded-full border-[1px] px-3 py-1 text-center active:ring-2 active:ring-offset-2"
    >
      {{ child.title }}
    </NuxtLink>
  </section>
</template>
<style scoped>
#product-collection-navpanel {
  display: grid;
  gap: 1.5em;
  grid-auto-flow: column;
  /* grid-auto-columns: 23%; */
  overflow-x: auto;
  padding-bottom: 0.75em;
  margin-bottom: 0.75em;
}
.snaps-inline {
  scroll-snap-type: inline mandatory;
  scroll-padding-inline: 0.5em;
}

.snaps-inline > * {
  scroll-snap-align: start;
}
</style>
