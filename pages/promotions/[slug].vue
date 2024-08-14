<script setup>
import { qryPromotionBySlug } from "~/queries/promotions";
import promotionCollections from "~/components/promotion/collections"
import promotionProducts from "~/components/promotion/products"
import promotionSubscribeSave from "~/components/promotion/subscribe-save"
const route = useRoute();
const slug = route.params.slug;
// console.log(slug)

const promo = ref();
try {
  const { data } = await useSanityQuery(qryPromotionBySlug, { slug: slug });
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
  title: () => promo.value.title,
  description: () => promo.value.description,
  ogTitle: () => promo.value.title,
  ogDescription: () => promo.value.description,
  ogImage: () => promo.value.image.url,
  twitterTitle: () => promo.value.title,
  twitterDescription: () => promo.value.description,
  twitterImage: () => promo.value.image.url,
  twitterCard: "summary_large_image",
});


const ogImageComponent = ref();
const ogImage = ref();
if (promo.value.useSocialImage) {
  ogImageComponent.value = 'social-image';
  ogImage.value = promo.value.socialImage.url;
} else {
  ogImageComponent.value = 'promotion';
  ogImage.value = promo.value.image.url;
}
// console.log("Use Social Image: ", promo.value.useSocialImage);

defineOgImageComponent(
  ogImageComponent.value,
  {
    title: promo.value.title,
    description: promo.value.byline,
    siteName: settings.title,
    siteLogo: settings.logoUrl,
    image: ogImage.value,
    cta: promo.value.cta,
  },
);

definePageMeta({
  layout: false,
});
</script>

<template>
  <div>
    <NuxtLayout name="internal">
      <template #main>
        <section>
          <div v-if="promo">
            <promotion-collections v-if="promo.scope === 'collections'" :promo="promo" />
            <promotion-products v-else-if="promo.scope === 'products'" :promo="promo" />
            <promotion-subscribe-save v-else-if="promo.scope === 'subscribe-save'" :promo="promo" />
          </div>
          <div class="w-full align-middle text-center" v-else>
            <h2>This promotion is no longer active</h2>
          </div>
        </section>
      </template>
      <template #sidebar>
        <product-sidebar />
      </template>
    </NuxtLayout>
  </div>
</template>
