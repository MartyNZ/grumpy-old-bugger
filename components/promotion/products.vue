<script setup>
const props = defineProps({
  promo: {
    type: Object,
    required: true
  }
})
// console.log("Component props: ", JSON.stringify(props.promo, null, 2))
</script>

<template>
  <div class="w-full mx-auto">
    <promotion-hero :promo="promo" enableZoom />
    <div class="max-w-[1200px] mx-auto">
      <!-- <pre>{{ promo.products }}</pre> -->
      <ProductList :products="promo.products" :sectionTitle="promo.title" :description="promo.summary" />
    </div>
  </div>
</template>
