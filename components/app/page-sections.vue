<script setup>
const props = defineProps({
  page: Object,
  required: true
});
// console.log("Page: ", JSON.stringify(props.page, null, 2));
</script>

<template>
  <div v-if="page">
    <template v-for="section in page.sections" :key="section._id">
      <div class="container" v-if="section._type == 'about'">
        <sections-about :id="section._id" />
      </div>
      <div class="container" v-else-if="section._type == 'whyUs'">
        <sections-why-us :id="section._id" />
      </div>
      <div class="container" v-else-if="section._type == 'services'">
        <sections-services :id="section._id" :layout="section.layout" />
      </div>
      <sections-Cta v-if="section._type == 'cta'" :id="section._id" />
      <div class="container" v-else-if="section._type == 'features'">
        <sections-features :id="section._id" :layout="section.layout" />
      </div>
      <div class="container" v-else-if="section._type == 'latest.articles'">
        <article-latest number="4" />
      </div>
      <div class="container" v-else-if="section._type == 'team'">
        <sections-team :id="section._id" />
      </div>
      <div class="container" v-else-if="section._type == 'testimonials'">
        <sections-testimonials :id="section._id" />
      </div>
      <div class="container" v-else-if="section._type == 'policy'">
        <sections-policy :id="section._id" />
      </div>
      <div class="container" v-else-if="section._type === 'promotion.gallery'">
        <promotion-gallery />
      </div>
      <div class="container" v-else>
        No sections selected.
      </div>
    </template>
  </div>
</template>

<style scoped></style>
