<script setup>
import { qryAuthors } from '~/queries/contacts';
const { data: authors } = await useSanityQuery(qryAuthors);
// console.log("Authors: ", JSON.stringify(authors.value, null, 2))

const data = useSiteSettingsStore();
const settings = data.settings;

useSeoMeta({
  icon: computed(() => settings?.logoUrl || ''),
  title: computed(() => settings?.title || ''),
  ogTitle: computed(() => settings?.title || ''),
  description: computed(() => settings?.description || ''),
  ogDescription: computed(() => settings?.description || ''),
  ogImage: computed(() => settings?.image?.asset.url || ''),
  twitterTitle: computed(() => settings?.title || ''),
  twitterDescription: computed(() => settings?.description || ''),
  twitterImage: computed(() => settings?.image?.asset.url || ''),
  twitterCard: "summary_large_image",
});

definePageMeta({
  layout: false,
});
</script>
<template>
  <div>
    <NuxtLayout name="internal">
      <template #main>
        <section id="authors" class="mb-8">
          <div class="semi-bold italic">
            <p>We’re a motley crew of sarcastic scribes, seasoned complainers, and unapologetic curmudgeons who live to
              vent. Fueled by strong opinions and even stronger coffee, we’re the twisted minds behind the rants,
              rambles, and roasts that give Grumpy Old Bugger its gloriously grouchy soul.</p>
            <p>So, whether you’re here for a laugh, a cathartic nod of agreement, or just to revel in some top-tier
              complaining, welcome—you’re among friends. Misery loves company, after all</p>
          </div>
          <Divider />
          <div v-for="author in authors" :key="author._id">
            <article-author-list :author="author" />
          </div>
        </section>
      </template>
      <template #sidebar>
        <product-sidebar />
      </template>
    </NuxtLayout>
  </div>
</template>
