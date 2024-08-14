<script setup>
import { qryProductsByDesign } from '~/queries/printify'
const slug = useRoute().params.slug;

const data = useSiteSettingsStore();
const settings = data.settings;
const { data: design } = await useSanityQuery(qryProductsByDesign, {
  slug: slug,
})
// console.log("Products by design: ", JSON.stringify(design.value, null, 2))

useSeoMeta({
  title: () => design.value.title,
  description: () => design.value.theme.description,
  ogTitle: () => design.value.title,
  ogDescription: () => design.value.theme.description,
  ogImage: () =>
    design.value.image.url,
  twitterTitle: () => design.value.title,
  twitterDescription: () => design.value.theme.description,
  twitterImage: () =>
    design.value.image.url,
  twitterCard: "summary_large_image",
});

defineOgImageComponent('collection', {
  title: design.value.title,
  description: design.value.description,
  siteName: settings.title,
  image: design.value.image.url,
  siteLogo: settings.logoUrl,
});

definePageMeta({
  layout: false,
});
</script>
<template>
  <div>
    <NuxtLayout name="internal">
      <template #main>
        <section id="products-by-design" class="mb-8">
          <div class="mb-8 semi-bold italic text-lg">{{ design.theme.description }}</div>
          <product-list :products="design.products" :sectionTitle="design.title" />
        </section>
      </template>
      <template #sidebar>
        <product-sidebar />
      </template>
    </NuxtLayout>
  </div>
</template>
