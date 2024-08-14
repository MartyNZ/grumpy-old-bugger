<script setup>
import { qryAuthorBySlug } from "../../queries/authors";
const route = useRoute();
const slug = route.params.slug;
const { data: author } = await useSanityQuery(qryAuthorBySlug, { slug });
</script>
<template>
  <section id="author">
    {{ author }}
  </section>
</template>
