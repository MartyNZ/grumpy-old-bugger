<script setup>
import { qryPage } from "~/queries/siteSettings";
const route = useRoute();
const slug = route.params.slug;
const { data: page } = await useSanityQuery(qryPage, { slug: slug });
const data = useSiteSettingsStore();
const settings = data.settings;
// console.log('Page: ', JSON.stringify(page.value, null, 2));
// console.log('Page slug: ', slug, "Number of sections: ", JSON.stringify(page.value.sections.length, null, 2));

// useSeoMeta({
//   icon: () => settings.logoUrl,
//   title: () => page.value.title,
//   description: () => page.value.description,
//   ogTitle: () => page.value.title,
//   ogDescription: () => page.value.description,
//   ogImage: () => settings.image,
//   twitterTitle: () => page.value.title,
//   twitterDescription: () => page.value.description,
//   twitterImage: () => settings.image,
//   twitterCard: "summary_large_image",
// });

defineOgImageComponent(
  'default',
  {
    title: settings.title,
    description: settings.description,
    image: settings.image,
    siteName: settings.title,
    icon: settings.logoUrl,
  });

definePageMeta({
  layout: false,
});
</script>

<template>
  <div>
    <NuxtLayout name="default">
      <template #main>
        <app-page-sections :page="page" />
      </template>
      <template #sidebar>
        <product-sidebar />
      </template>
    </NuxtLayout>
  </div>
</template>
