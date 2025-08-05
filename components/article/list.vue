<script setup>

const props = defineProps({
  articles: {
    type: Array,
    required: true,
  },
  sectionTitle: {
    type: String,
  },
  description: {
    type: String
  },
  loading: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <section id="article-list">
    <h2 v-if="sectionTitle" :class="!description ? 'mb-4' : ''" class="text-lg">{{ sectionTitle }}
    </h2>
    <div v-if="description" class="text-balanced mb-4">{{ description }}
    </div>

    <div id="articles-grid">
      <template v-for="article in articles" :key="article._id">
        <article-summary-card :article="article" :loading="loading" />
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


@container (width > 530px) {
  #articles-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 0.5fr));
  }
}
</style>
