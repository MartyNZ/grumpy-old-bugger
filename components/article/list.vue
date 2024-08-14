<script setup>
const props = defineProps({
  articles: {
    type: Array,
    required: true,
  },
  sectionTitle:{
    type: String,
    default: 'Latest Articles'
  },
  description:{
    type: String
  }
});
</script>
<template>
  <section id="article-list">
    <h2 class="text-lg">{{ sectionTitle }}</h2>
    <div v-if="description" class="text-balanced mb-4">{{ description }}</div>
    <div id="articles-grid">
      <template v-for="article in articles" :key="article._id">
        <!-- <pre>{{article}}</pre> -->
        <article-summary-card :article="article" />
      </template>
    </div>
  </section>
</template>
<style scoped>
#article-list {
  container-type: inline-size;
  margin-bottom: 2.5em;
}
#articles-grid {
  display: grid;
  gap: 1.5em;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  justify-items: center;
}
@container ( width > 530px) {
  #articles-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 0.5fr));
  }
}
</style>
