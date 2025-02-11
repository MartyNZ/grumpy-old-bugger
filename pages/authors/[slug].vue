<script setup>
import { qryAuthorBySlug } from "../../queries/authors";
const route = useRoute();
const slug = route.params.slug;
const isLoading = ref(true);
const { data: author } = await useSanityQuery(qryAuthorBySlug, { slug }).finally(() => {
  isLoading.value = false
});
</script>
<template>
  <section id="author">
    <div v-if="isLoading" class="flex flex-column gap-3">
      <Skeleton width="15rem" height="1.5rem" />
      <Skeleton width="10rem" height="1rem" />
      <Skeleton height="12rem" />
      <div class="flex gap-3">
        <Skeleton width="4rem" height="4rem" shape="circle" />
        <div class="flex flex-column gap-2">
          <Skeleton width="10rem" height="1rem" />
          <Skeleton width="8rem" height="1rem" />
        </div>
      </div>
    </div>
    <div v-else>
      <pre>{{ author }}</pre>
    </div>
  </section>
</template>
