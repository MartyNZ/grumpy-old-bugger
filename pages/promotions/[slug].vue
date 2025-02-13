<script setup>
import { qryPromotionBySlug } from "~/queries/promotions";
import promotionCollections from "~/components/promotion/collections"
import promotionProducts from "~/components/promotion/products"
import promotionSubscribeSave from "~/components/promotion/subscribe-save"
const route = useRoute();
const slug = route.params.slug;
// console.log(slug)

const isLoading = ref(true);
const promo = ref();
try {
  const { data } = await useSanityQuery(qryPromotionBySlug, { slug: slug }).finally(() => {
    isLoading.value = false
  });
  if (promo) {
    promo.value = data.value
  };
} catch (error) {
  throw createError({ statusCode: 500, statusMessage: "promotion not found", message: error });
}
// console.log("Promo: ", JSON.stringify(promo.value.products, null, 2));
const data = useSiteSettingsStore();
const settings = data.settings;

// console.log("Settings: ", JSON.stringify(settings, null, 2));

useSeoMeta({
  title: computed(() => promo.value?.title || ''),
  description: computed(() => promo.value?.description || ''),
  ogTitle: computed(() => promo.value?.title || ''),
  ogDescription: computed(() => promo.value?.description || ''),
  // ogImage: computed(() => promo.value?.image.url || ''),
  twitterTitle: computed(() => promo.value?.title || ''),
  twitterDescription: computed(() => promo.value?.description || ''),
  // twitterImage: computed(() => promo.value?.image.url || ''),
  twitterCard: "summary_large_image",
});

const promotionSettings = computed(() => ({
  title: promo.value?.title,
  description: promo.value?.description,
  image: promo.value?.image.url,
  siteName: promo.value?.title,
  icon: promo.value?.image.url,
  twitterCard: "summary_large_image",
}));
defineOgImageComponent(
  'promotion', promotionSettings.value);

definePageMeta({
  layout: false,
});
</script>

<template>
  <div>
    <NuxtLayout name="internal">
      <template #main>
        <section id="promo-hero">
          <promotion-hero :loading="isLoading" :promo="promo" />
        </section>
        <section id="promo-content">
          <promotion-collections v-if="promo.scope === 'collections'" :promo="promo" :loading="isLoading" />
          <promotion-products v-else-if="promo.scope === 'products'" :promo="promo" :loading="isLoading" />
          <promotion-subscribe-save v-else-if="promo.scope === 'subscribe-save'" :promo="promo" :loading="isLoading" />
        </section>
      </template>
      <template #sidebar>
        <product-sidebar />
      </template>
    </NuxtLayout>
  </div>
</template>
