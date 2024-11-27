<script setup>
import { qryPolicyById } from '~/queries/sections'
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const { data: policy } = await useSanityQuery(qryPolicyById, {
  id: props.id
})
</script>
<template>
  <section id="policy" class="policy">
    <div class="container" data-aos="fade-up">

      <div class="section-header">
        <h2>{{ policy.title }}</h2>
      </div>
      <div data-aos="fade-up" data-aos-delay="200">
        <WebcnxnzPortableText :blocks="policy.content" />
      </div>
    </div>
  </section>
</template>
