<script setup>
import { qryAuthorBySlug } from "../../queries/authors";
const route = useRoute();
const slug = route.params.slug;
const { data: author } = await useSanityQuery(qryAuthorBySlug, { slug });


// defineOgImageComponent(
//   'default',
//   {
//     title: settings.title,
//     description: settings.description,
//     image: settings.image,
//     siteName: settings.title,
//     icon: settings.logoUrl,
//   });
</script>
<template>
  <section id="author">
    <pre>{{ author }}</pre>
  </section>
</template>
