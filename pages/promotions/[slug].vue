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
        <section>
          <div v-if="isLoading">
            <div class="flex flex-col gap-4">
              <!-- Title skeleton -->
              <Skeleton height="3rem" class="mb-2" />
              <!-- Description skeleton -->
              <Skeleton height="2rem" width="70%" class="mb-4" />
              <!-- Content skeleton -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="n in 6" :key="n" class="flex flex-col gap-2">
                  <Skeleton height="200px" />
                  <Skeleton width="85%" height="2rem" />
                  <Skeleton width="60%" height="1.5rem" />
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="promo">
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
