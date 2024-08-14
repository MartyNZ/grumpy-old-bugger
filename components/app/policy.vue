<script setup>
const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <h2>{{ section.title }}</h2>
  <WebcnxnzPortableText :blocks="section.content" />
</template>
