<script setup>
const props = defineProps({
  image: {
    type: String,
    required: true,
  },
});

</script>

<template>
  <div class="relative overflow-hidden flex w-[1200px] h-[600px]">
    <img :src="image" height="auto" width="100%" class="w-full object-cover align-middle" />

  </div>
</template>
