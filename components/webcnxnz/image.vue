<script setup>
const props = defineProps({
  node: { type: Object, required: true },
});

const imageLoaded = ref(false);

const loadImage = () => {
  imageLoaded.value = true;
};
</script>

<template>
  <div>
    <SanityImage
      auto="format"
      :asset-id="node.image.asset._ref"
      :alt="node.alt"
      @load="loadImage"
    />
  </div>
</template>
