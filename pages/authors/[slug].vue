<script setup>
import { qryAuthor } from "~/queries/contacts";

const route = useRoute();
const slug = route.params.slug;

const { data: author, pending, error } = await useSanityQuery(qryAuthor, {
  slug: slug
});

// Handle error case
if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Author not found'
  });
}

// Only set SEO meta when author data is available
watchEffect(() => {
  if (author.value) {
    useSeoMeta({
      title: author.value?.name || '',
      description: author.value?.excerpt || '',
      ogTitle: author.value?.name || '',
      ogDescription: author.value?.excerpt || '',
      ogImage: author.value?.image?.asset?.url || '',
      twitterTitle: author.value?.name || '',
      twitterDescription: author.value?.excerpt || '',
      twitterImage: author.value?.image?.asset?.url || '',
      twitterCard: "summary_large_image",
    });
  }
});

definePageMeta({
  layout: false,
});
</script>
<template>
  <div>
    <NuxtLayout name="internal">
      <template #main>
        <section id="author">
          <div v-if="pending" class="flex justify-center items-center h-64">
            <p>Loading author...</p>
          </div>
          <div v-else-if="author" class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <article-author :author="author" />
            <div class="text-justify text-sm">
              <SanityContent :blocks="author.bio" />
            </div>
          </div>
          <div v-else>
            <p>Author not found</p>
          </div>
          <Divider />
          <article-list :articles="author.latestArticles" :sectionTitle="`${author.firstName}'s Latest Articles`" />
        </section>
      </template>
      <template #sidebar>
        <product-sidebar />
      </template>
    </NuxtLayout>
  </div>
</template>
