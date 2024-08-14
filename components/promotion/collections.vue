<script setup>
const props = defineProps({
  promo: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="w-full">
    <promotion-hero :promo="promo" enableZoom />
    <div class="max-w-[1200px] mx-auto">
      <ProductByCollection v-for="collection in promo.collections" :key="collection._key" :collection="collection"
        :title="promo.title" :description="promo.summary" />
    </div>
  </div>
</template>
