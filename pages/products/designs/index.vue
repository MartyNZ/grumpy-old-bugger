<script setup>
import { qryProductThemes } from '~/queries/printify';
const data = useSiteSettingsStore();
const settings = data.settings;

const { data: themes } = await useSanityQuery(qryProductThemes)
// console.log("Themes: ", JSON.stringify(themes.value, null, 2))
const themeCount = themes.value.length;
// console.log("Theme Count: ", themeCount);
const currentTheme = themes.value[Math.floor(Math.random() * themeCount)];
// console.log("Current Theme: ", JSON.stringify(currentTheme, null, 2));


// Create the title as a computed property
const pageTitle = computed(() => "Explore our designs");
useHead({
  title: pageTitle.value,
});
// Safe SEO meta setup
useSeoMeta({
  title: computed(() => pageTitle.value || ''),
  ogTitle: computed(() => pageTitle.value || ''),
  description: computed(() => currentTheme?.description || ''),
  ogDescription: computed(() => currentTheme?.description || ''),
  ogImage: computed(() => currentTheme?.image?.asset.url || ''),
  twitterTitle: computed(() => pageTitle.value || ''),
  twitterDescription: computed(() => currentTheme?.description || ''),
  twitterImage: computed(() => currentTheme?.image?.asset.url || ''),
  twitterCard: "summary_large_image",
});
definePageMeta({
  layout: false,
});

// const themeSettings = (({
//   title: currentTheme.title,
//   description: currentTheme.excerpt,
//   image: currentTheme.image.url,
//   siteName: settings.title,
//   siteLogo: settings.logoUrl,
// }))
// defineOgImageComponent('theme', themeSettings);

</script>
<template>
  <div>
    <NuxtLayout name="internal">
      <template #main>
        <section id="products-by-theme" class="mb-8">
          <div class="semi-bold italic">
            <p>Lets face it. All our products are top quality, and we have a lot of them. But when you get right down to
              it, you're here because you want to make a statement. So, here is where all the statements live.</p>
            <p>Explore our designs and come back regularly, as we are adding to our library of designs every week.</p>
            <p>Click on a prefered design to see all the products available carrying that design.</p>
          </div>
          <Divider />
          <div v-for="theme in themes" :key="theme._id">
            <product-theme-design-list :theme="theme" />
            <Divider v-if="theme !== themes[themes.length - 1]" />
          </div>
        </section>
      </template>
      <template #sidebar>
        <product-sidebar />
      </template>
    </NuxtLayout>
  </div>
</template>
