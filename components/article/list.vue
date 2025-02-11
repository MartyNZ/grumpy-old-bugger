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
    <h2 class="text-lg">
      <Skeleton v-if="loading" width="200px" height="24px" />
      <template v-else>{{ sectionTitle }}</template>
    </h2>

    <div v-if="description" class="text-balanced mb-4">
      <Skeleton v-if="loading" width="100%" height="20px" />
      <template v-else>{{ description }}</template>
    </div>

    <div id="articles-grid">
      <template v-if="loading">
        <div v-for="n in 6" :key="n" class="skeleton-card">
          <Skeleton height="200px" />
          <Skeleton width="85%" height="24px" class="mt-2" />
          <Skeleton width="60%" height="16px" class="mt-2" />
        </div>
      </template>
      <template v-else>
        <template v-for="article in articles" :key="article._id">
          <article-summary-card :article="article" />
        </template>
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

.skeleton-card {
  width: 100%;
  max-width: 300px;
}

@container (width > 530px) {
  #articles-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 0.5fr));
  }
}
</style>
