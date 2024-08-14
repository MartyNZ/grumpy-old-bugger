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
  <div class="w-full">
    <promotion-hero :promo="promo" enableZoom />
    <div class="max-w-[1200px] mx-auto -mt-4">
      <app-subscribe :promo="promo" />
    </div>
  </div>
</template>
