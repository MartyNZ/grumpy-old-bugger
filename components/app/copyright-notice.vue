<script setup>
const year = useDateFormat(useNow(), "YYYY");
const props = defineProps({
  siteOwner: {
    type: String,
  },
});
</script>
<template>
  <div class="bg-surface-950 text-surface-200 w-full pb-2">
    <div
      class=" mx-auto max-w-[1280px] px-6 py-1 text-xs font-semibold md:flex md:items-center md:justify-between"
    >
      <div class="py-1 text-center md:text-left">
        <span>© {{ year }} Copyright: </span>{{ siteOwner }}
      </div>
      <div class="py-1 text-center md:text-right">
        <span>site developed by: </span>
        <NuxtLink
          class="hover:text-primary-0"
          to="https://webconnectionz.com"
          target="_blank"
          >Web Connectionz</NuxtLink
        >
      </div>
    </div>
  </div>
</template>
