<script setup>
</script>
<template>
  <div class="@container sticky top-[95px] w-full">
    <div class="w-full grid grid-cols-1 @xl:grid-cols-2">
      <div class="hidden sm:pb-8 md:block">
        <product-collection-navigation />
      </div>
      <div class="pb-8 place-content-center">
        <product-featured />
      </div>
      <div class="pb-8 justify-self-center">
        <product-designs-link />
      </div>
      <div class="pb-8 place-content-center">
        <promotion-gallery />
      </div>
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
