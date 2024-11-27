<script setup>
import { qryFeaturesById } from '~/queries/features'
const props = defineProps({
  layout: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true
  }
})
const { data: features } = await useSanityQuery(qryFeaturesById, {
  id: props.id
})
</script>

<template>
  <section id="features" class="features">
    <SectionsFeaturesHero :features="features" v-if="features.layout === 'hero'" />
  </section>
</template>
