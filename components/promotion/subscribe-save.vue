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
// console.log("Component props: ", JSON.stringify(props.promo, null, 2))
</script>

<template>
  <div class="max-w-[1200px] mx-auto -mt-4">
    <app-subscribe :promo="promo" :loading="loading" />
  </div>
</template>
