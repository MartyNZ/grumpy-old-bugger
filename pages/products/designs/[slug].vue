<script setup>
import { qryProductsByDesign } from '~/queries/printify'
const slug = useRoute().params.slug;

const data = useSiteSettingsStore();
const settings = data.settings;
const isLoading = ref(true);
const { data: design } = await useSanityQuery(qryProductsByDesign, {
  slug: slug,
})
  .finally(() => {
    isLoading.value = false
  })
// console.log("Products by design: ", JSON.stringify(design.value, null, 2))

// Create the title as a computed property
const pageTitle = computed(() => design.value?.title);
useHead({
  title: pageTitle.value,
});
useSeoMeta({
  title: computed(() => design.value?.title || ''),
  description: computed(() => design.value?.theme?.description || ''),
  ogTitle: computed(() => design.value?.title || ''),
  ogDescription: computed(() => design.value?.theme?.description || ''),
  ogImage: computed(() => design.value?.image?.asset.url || ''),
  twitterTitle: computed(() => design.value?.title || ''),
  twitterDescription: computed(() => design.value?.theme?.description || ''),
  twitterImage: computed(() => design.value?.image?.asset.url || ''),
  twitterCard: "summary_large_image",
});

definePageMeta({
  layout: false,
});

// const themeSettings = (({
//   title: design.value?.title,
//   description: design.value?.theme?.description,
//   image: design.value?.image?.url,
//   siteName: settings.title,
//   siteLogo: settings.logoUrl,
// }))

// defineOgImageComponent('theme', themeSettings);
</script>
<template>
  <div>
    <NuxtLayout name="internal">
      <template #main>
        <section id="products-by-design" class="mb-8">
          <div class="mb-8 semi-bold italic text-lg">{{ design.theme.description }}</div>
          <product-list :products="design.products" :sectionTitle="design.title" :loading="isLoading" />
        </section>
      </template>
      <template #sidebar>
        <product-sidebar />
      </template>
    </NuxtLayout>
  </div>
</template>
