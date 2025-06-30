<script setup>
const props = defineProps({
  year: { type: undefined },
  settings: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <div class="w-full bg-surface-950 pb-2 sm:block">
    <div
      class="mx-auto max-w-[1280px] px-6 py-1 text-xs font-semibold text-surface-300 md:flex md:items-center md:justify-between">
      <div class="py-1 text-center md:text-left">
        <span>© {{ year }} Copyright: </span>{{ settings.siteOwner }}
      </div>
      <div class="py-1 text-center md:text-right">
        <span>site powered by: </span>
        <!-- <NuxtLink class="hover:text-surface-50" to="https://podifyplus.app" target="_blank"> -->
        PODify+
        <!-- </NuxtLink> -->
      </div>
    </div>
  </div>
</template>
