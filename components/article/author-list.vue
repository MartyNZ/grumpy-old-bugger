<script setup>
const props = defineProps({
  author: {
    type: Object,
    required: true,
  }
})
</script>
<template>
  <section class="authors-list mt-10" id="authors-list">
    <div class="flex w-full m-1 gap-2 mb-4 items-start">
      <div class="flex-shrink-0">
        <article-author :author="author" />
      </div>
      <div class="h-full mb-2 w-full ml-2">
        <div class="font-bold text-lg italic pb-4">Published Articles</div>
        <div class="authors-grid" :id="`authors-grid-${author.slug}`">
          <template v-if="author.articles.length > 0">
            <div v-for="article in author.articles" :key="article._id" class="text-lg">
              <app-link-internal :title="article.title" :slug="`the-rant-files/${article.slug}`" />
            </div>
          </template>
          <template v-else>
            <h5>No designs are available for this theme at present. But if it's here they must be coming!!!</h5>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
