<script setup>
const props = defineProps({
  year: {
    type: Number,
  },
  siteOwner: {
    type: String,
  },
});
</script>
<template>
  <div class="bg-primary-950 w-full pb-2">
    <div
      class="text-surface-300 mx-auto max-w-[1280px] px-6 py-1 text-xs font-semibold md:flex md:items-center md:justify-between">
      <div class="py-1 text-center md:text-left">
        <span>© {{ year }} Copyright: </span>
        {{ siteOwner }}
      </div>
      <div class="py-1 text-center md:text-right">
        <!-- <span>Powered by: </span>
        <NuxtLink to="https://podify-plus" class="hover:text-primary-50 " target="_blank">PODify+</NuxtLink> -->
      </div>
    </div>
  </div>
</template>
