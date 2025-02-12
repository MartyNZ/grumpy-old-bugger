<script setup>
import { qryPage } from "~/queries/siteSettings";
const route = useRoute();
const slug = route.params.slug;
const isValidSlug = computed(() => slug && typeof slug === 'string')
if (!isValidSlug.value) {
  throw createError({ statusCode: 404 })
}

const { data: page } = await useSanityQuery(qryPage, { slug: slug })
const data = useSiteSettingsStore();
const settings = data.settings;

// console.log('Page: ', JSON.stringify(page.value, null, 2));
// console.log('Page slug: ', slug,);
// console.log("Number of sections: ", JSON.stringify(page.value.sections.length, null, 2));

useSeoMeta({
  icon: computed(() => settings?.logoUrl || ''),
  title: computed(() => page?.value?.title || ''),
  description: computed(() => page?.value?.description || ''),
  ogTitle: computed(() => page?.value?.title || ''),
  ogDescription: computed(() => page?.value?.description || ''),
  // ogImage: computed(() => settings?.image || ''),
  twitterTitle: computed(() => page?.value?.title || ''),
  twitterDescription: computed(() => page?.value?.description || ''),
  // twitterImage: computed(() => settings?.image || ''),
  twitterCard: "summary_large_image",
});

const siteSettings = computed(() => ({
  title: data.settings?.title || '',
  description: data.settings?.description || '',
  image: data.settings?.image || '',
  siteName: data.settings?.title || '',
  icon: data.settings?.logoUrl || ''
}))

defineOgImageComponent('default', siteSettings.value)

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
