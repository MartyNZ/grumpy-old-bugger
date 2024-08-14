<script setup>
import { qryAuthors } from "../../queries/authors";
const { data: authors } = await useSanityQuery(qryAuthors);
</script>
<template>
  <ul>
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
</template>
