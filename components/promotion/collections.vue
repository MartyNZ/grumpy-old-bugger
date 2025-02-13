<script setup>
const props = defineProps({
  promo: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
  }
})
</script>

<template>
  <div class="max-w-[1200px] mx-auto">
    <product-by-collection v-for="collection in promo.collections" :key="collection._key" :collection="collection"
      :loading="loading" :title="promo.title" :description="promo.summary" />
    <!-- <ProductByCollection v-for="collection in promo.collections" :key="collection._key" :collection="collection"
        :title="promo.title" :description="promo.summary" /> -->
  </div>
</template>
