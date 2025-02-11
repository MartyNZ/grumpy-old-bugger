<script setup>
import { qryAuthors } from "../../queries/authors";
const isLoading = ref(true);
const { data: authors } = await useSanityQuery(qryAuthors).finally(() => {
  isLoading.value = false
});
</script>
<template>
  <div>
    <template v-if="isLoading">
      <div v-for="i in 3" :key="i" class="mb-4">
        <Skeleton height="2rem" class="mb-2" />
        <div class="ml-5">
          <Skeleton v-for="j in 2" :key="j" height="1.5rem" class="mb-1" width="80%" />
        </div>
      </div>
    </template>

    <ul v-else>
      <li v-for="author in authors" :key="author._id">
        <NuxtLink :to="`/authors/${author.slug}`">
          <h2>{{ author.name }}</h2>
        </NuxtLink>
        <ul class="ml-5">
          <li v-for="article in author.articles" :key="article._id">
            <NuxtLink :to="`/the-rant-files/${article.slug}`">
              {{ article.title }}
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
