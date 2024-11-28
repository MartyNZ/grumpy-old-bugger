<script setup>
</script>
<template>
  <div class="@md:grid-cols-2 sticky top-[95px] mx-3 grid grid-cols-1">
    <div class="pb-8">
      <product-collection-navigation />
    </div>
    <div class="pb-8">
      <product-featured />
    </div>
    <div class="pb-8">
      <promotion-gallery />
    </div>
  </div>
</template>
<style scoped>
@keyframes fadein {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes fadeout {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.fadein {
  animation: fadein 150ms ease-in-out;
}

.fadeout {
  animation: fadeout 150ms ease-in-out;
}
</style>
