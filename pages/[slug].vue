<script setup>
import { qryPage } from "~/queries/siteSettings";
const route = useRoute();
const slug = route.params.slug;
const isLoading = ref(true)
const { data: page } = await useSanityQuery(qryPage, { slug: slug }).finally(() => {
  isLoading.value = false
});
const data = useSiteSettingsStore();
const settings = data.settings;
// console.log('Page: ', JSON.stringify(page.value, null, 2));
// console.log('Page slug: ', slug,);
// console.log("Number of sections: ", JSON.stringify(page.value.sections.length, null, 2));

useSeoMeta({
  icon: computed(() => settings.logoUrl || ''),
  title: computed(() => page.value.title || ''),
  description: computed(() => page.value.description || ''),
  ogTitle: computed(() => page.value.title || ''),
  ogDescription: computed(() => page.value.description || ''),
  // ogImage: computed(() => settings.image || ''),
  twitterTitle: computed(() => page.value.title || ''),
  twitterDescription: computed(() => page.value.description || ''),
  // twitterImage: computed(() => settings.image || ''),
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
        <template v-if="isLoading">
          <div class="flex flex-col gap-4">
            <!-- Header skeleton -->
            <Skeleton height="4rem" class="mb-4" animation="wave" />

            <!-- Content sections skeleton -->
            <div v-for="n in 3" :key="n" class="mb-6">
              <Skeleton width="75%" height="2rem" class="mb-2" animation="wave" />
              <Skeleton height="12rem" animation="wave" />
            </div>
          </div>
        </template>
        <app-page-sections :page="page" v-else />
      </template>
      <template #sidebar>
        <template v-if="isLoading">
          <div class="flex flex-col gap-3">
            <Skeleton width="100%" height="10rem" animation="wave" />
            <Skeleton width="100%" height="8rem" animation="wave" />
          </div>
        </template>
        <product-sidebar v-else />
      </template>
    </NuxtLayout>
  </div>
</template>
