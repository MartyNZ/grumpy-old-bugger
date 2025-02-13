<script setup>
const props = defineProps({
  promo: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
  },
})
// console.log("Component props: ", JSON.stringify(props.promo, null, 2))
</script>

<template>
  <div class="max-w-[1200px] mx-auto mt-6">
    <!-- <pre>{{ promo.products }}</pre> -->
    <product-list :products="promo.products" :sectionTitle="promo.title" :description="promo.summary"
      :loading="loading" />
  </div>
</template>
