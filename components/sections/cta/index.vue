<script setup>
import { qryCtaById } from '~/queries/cta'
const props = defineProps({
  id: {
    type: String,
    required: true
  }
})
const { data: cta } = await useSanityQuery(qryCtaById, {
  id: props.id
})
</script>

<template>
  <section id="call-to-action" class="call-to-action">
    <div class="container" data-aos="fade-up">
      <div class="row justify-content-center">
        <div class="col-lg-6 text-center">
          <h3>{{ cta.title }}</h3>
          <LazySanityContent :blocks="cta.content" />
          <AppButtons :buttons="cta.buttons" />
        </div>
      </div>

    </div>
  </section>
</template>
