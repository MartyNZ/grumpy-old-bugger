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
  title: computed(() => page?.value?.seo?.title || page?.value?.title),
  description: computed(() => page?.value?.seo?.description || ''),
  ogTitle: computed(() => page?.value?.seo?.title || page?.value?.title),
  ogDescription: computed(() => page?.value?.seo?.description || ''),
  ogImage: computed(() => page.value.seo?.image?.asset.url || ''),
  twitterTitle: computed(() => page?.value?.seo?.title || page?.value?.title),
  twitterDescription: computed(() => page?.value?.seo?.description || ''),
  twitterImage: computed(() => page.value.seo?.image?.asset.url || ''),
  twitterCard: "summary_large_image",
});

definePageMeta({
  layout: false,
});

// const siteSettings = computed(() => ({
//   title: data.settings?.title || '',
//   description: data.settings?.description || '',
//   image: data.settings?.image || '',
//   siteName: data.settings?.title || '',
//   icon: data.settings?.logoUrl || ''
// }))
// defineOgImageComponent('default', siteSettings.value)

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
